import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyzeBusinessLocal } from "@/lib/api-clients/openaiService";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id || "anonymous-user";

    const body = await req.json();
    const { name, type, description, loansAmount = 0, investmentsAmount = 0 } = body;

    if (!name || !type || !description) {
      return NextResponse.json({ error: "Name, type, and description are required" }, { status: 400 });
    }

    // Call OpenAI for structured Shariah audit
    const audit = await analyzeBusinessLocal(type, name, description, loansAmount, investmentsAmount);

    // Save to Database
    const business = await db.business.create({
      data: {
        userId,
        name,
        type: type.toUpperCase() as any,
        incomeSources: audit.incomeSources,
        prohibitedActivities: audit.prohibitedActivities,
        loansAmount,
        investmentsAmount,
        complianceStatus: audit.complianceStatus === "HALAL",
        suggestions: audit.suggestions,
      }
    });

    return NextResponse.json({ business, audit });
  } catch (error: any) {
    console.error("Business analyze route failed:", error);
    return NextResponse.json({ error: error.message || "Failed to audit local business" }, { status: 500 });
  }
}
