import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

async function requireAdmin(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const user = await db.user.findUnique({ where: { id: session.user.id as string }, select: { role: true } });
  if (user?.role !== "ADMIN") {
    return { error: NextResponse.json({ 
      error: `Forbidden: Admin access required. Logged in as: ${session.user.email} (Role in DB: ${user?.role || 'NOT_FOUND'}, ID: ${session.user.id})` 
    }, { status: 403 }) };
  }
  return { userId: session.user.id };
}

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard.error) return guard.error;

  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action") || "overview";

    if (action === "overview") {
      const [userCount, companyCount, cryptoCount, fatwaCount, scholarCount, auditCount] =
        await Promise.all([
          db.user.count(),
          db.company.count(),
          db.cryptoToken.count(),
          db.fatwa.count(),
          db.scholar.count(),
          db.auditLog.count(),
        ]);

      return NextResponse.json({
        stats: { userCount, companyCount, cryptoCount, fatwaCount, scholarCount, auditCount },
      });
    }

    if (action === "users") {
      const page = parseInt(searchParams.get("page") || "1");
      const limit = 20;
      const [users, total] = await Promise.all([
        db.user.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: "desc" },
          select: { id: true, name: true, email: true, role: true, createdAt: true },
        }),
        db.user.count(),
      ]);
      return NextResponse.json({ users, total, page, pages: Math.ceil(total / limit) });
    }

    if (action === "audit") {
      const page = parseInt(searchParams.get("page") || "1");
      const limit = 50;
      const logs = await db.auditLog.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          userEmail: true,
          action: true,
          details: true,
          ipAddress: true,
          createdAt: true,
        },
      });
      return NextResponse.json({ logs });
    }

    if (action === "thresholds") {
      const thresholds = await db.configThreshold.findMany({ orderBy: { name: "asc" } });
      return NextResponse.json({ thresholds });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

const thresholdSchema = z.object({
  name: z.string().min(3),
  value: z.number().min(0).max(100),
  description: z.string().optional(),
});

const userRoleSchema = z.object({
  userId: z.string(),
  role: z.enum(["USER", "ADMIN"]),
});

export async function PUT(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard.error) return guard.error;

  try {
    const body = await req.json();
    const { action } = body;

    if (action === "update_threshold") {
      const parsed = thresholdSchema.safeParse(body.data);
      if (!parsed.success) return NextResponse.json({ error: "Invalid threshold data" }, { status: 400 });

      const threshold = await db.configThreshold.upsert({
        where: { name: parsed.data.name },
        update: { value: parsed.data.value, description: parsed.data.description },
        create: parsed.data,
      });
      return NextResponse.json({ threshold });
    }

    if (action === "update_user_role") {
      const parsed = userRoleSchema.safeParse(body.data);
      if (!parsed.success) return NextResponse.json({ error: "Invalid role data" }, { status: 400 });

      const user = await db.user.update({
        where: { id: parsed.data.userId },
        data: { role: parsed.data.role },
        select: { id: true, name: true, email: true, role: true },
      });
      return NextResponse.json({ user });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
