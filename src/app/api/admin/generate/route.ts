import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { generateScholars, generateFatwas, generateCourses } from "@/lib/services/ai-generator";

export const maxDuration = 60; // Allow more time for AI generation
export const dynamic = "force-dynamic";

async function requireAdmin(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const user = await db.user.findUnique({ where: { id: session.user.id as string }, select: { role: true } });
  if (user?.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 }) };
  }
  return { userId: session.user.id };
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard.error) return guard.error;

  try {
    const body = await req.json();
    const { type } = body;

    let result;
    if (type === "scholars") {
      result = await generateScholars();
    } else if (type === "fatwas") {
      result = await generateFatwas();
    } else if (type === "courses") {
      result = await generateCourses();
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true, count: result.length, data: result });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate content" }, { status: 500 });
  }
}
