import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      db.learningCourse.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          lessons: {
            select: { id: true, title: true, sequenceOrder: true },
            orderBy: { sequenceOrder: "asc" },
          },
        },
      }),
      db.learningCourse.count({ where: { isPublished: true } }),
    ]);

    return NextResponse.json({ courses, total, page, pages: Math.ceil(total / limit) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

const progressSchema = z.object({
  courseId: z.string(),
  lessonId: z.string(),
  quizScore: z.number().min(0).max(100).optional().default(0),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = progressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid progress data" }, { status: 400 });
    }

    const { courseId, lessonId, quizScore } = parsed.data;

    const lesson = await db.learningLesson.findUnique({
      where: { id: lessonId },
      select: { xpReward: true },
    });

    const xpEarned = (lesson?.xpReward || 50) + Math.floor(quizScore / 10) * 10;

    const progress = await db.userProgress.create({
      data: {
        userId: session.user.id,
        courseId,
        lessonId,
        quizScore,
        xpEarned,
      },
    });

    return NextResponse.json({ progress, xpEarned });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
