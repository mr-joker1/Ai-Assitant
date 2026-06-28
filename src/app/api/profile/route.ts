import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";
import bcrypt from "bcryptjs";

const updateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  image: z.string().url().optional().or(z.literal("")),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        zakatCalculations: { orderBy: { date: "desc" }, take: 5 },
        purificationRecords: { orderBy: { createdAt: "desc" }, take: 5 },
        portfolios: { take: 3 },
        progress: { orderBy: { completedAt: "desc" }, take: 10 },
      },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const totalXP = user.progress.reduce((sum, p) => sum + p.xpEarned, 0);
    const level = Math.floor(totalXP / 200) + 1;

    return NextResponse.json({ user, totalXP, level });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }

    const { name, image, currentPassword, newPassword } = parsed.data;
    const updateData: any = {};

    if (name) updateData.name = name;
    if (image !== undefined) updateData.image = image || null;

    if (newPassword && currentPassword) {
      const user = await db.user.findUnique({ where: { id: session.user.id } });
      if (!user?.password) {
        return NextResponse.json({ error: "Cannot change password for OAuth accounts" }, { status: 400 });
      }
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    const user = await db.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: { id: true, name: true, email: true, image: true, role: true },
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
