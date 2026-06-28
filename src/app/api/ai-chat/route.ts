import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { executeRagPipeline } from "@/lib/api-clients/ragService";
import { db } from "@/lib/db";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const body = await req.json();
    const parsed = chatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request: message is required and must be under 2000 characters." },
        { status: 400 }
      );
    }

    const { message } = parsed.data;

    // Log audit event
    if (userId) {
      await db.auditLog.create({
        data: {
          userId,
          action: "AI_CHAT_QUERY",
          details: message.substring(0, 200),
        },
      }).catch(() => {});
    }

    // Execute RAG pipeline
    const result = await executeRagPipeline(message, userId || "anonymous");

    return NextResponse.json({
      answer: result.answer,
      citations: result.citations,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "AI chat failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ status: "AI Chat endpoint operational" });
}
