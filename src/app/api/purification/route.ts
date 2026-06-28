import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id || "anonymous-user";

    const records = await db.purificationRecord.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    const totalPurified = records
      .filter(r => r.status === "PURIFIED")
      .reduce((sum, r) => sum + r.amount, 0);

    const totalPending = records
      .filter(r => r.status === "PENDING")
      .reduce((sum, r) => sum + r.amount, 0);

    return NextResponse.json({ records, totalPurified, totalPending });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id || "anonymous-user";

    const body = await req.json();
    const { source, type, amount } = body;

    if (!source || !type || !amount) {
      return NextResponse.json({ error: "Source, type, and amount are required" }, { status: 400 });
    }

    const record = await db.purificationRecord.create({
      data: {
        userId,
        source,
        type,
        amount: parseFloat(amount),
        status: "PENDING"
      }
    });

    return NextResponse.json({ record });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id || "anonymous-user";

    const body = await req.json();
    const { id, status, donationRecipient } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Record ID and status are required" }, { status: 400 });
    }

    const record = await db.purificationRecord.update({
      where: { id },
      data: {
        status,
        purifiedAt: status === "PURIFIED" ? new Date() : null,
        donationRecipient: donationRecipient || null
      }
    });

    return NextResponse.json({ record });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
