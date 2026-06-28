import { NextRequest, NextResponse } from "next/server";
import { getNewsFeed } from "@/lib/api-clients/newsData";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "Islamic finance investing";
    const category = searchParams.get("category") || "GENERAL";
    const forceRefresh = searchParams.get("refresh") === "true";

    const news = await getNewsFeed({ query: q, category, forceRefresh });
    return NextResponse.json({ news, total: news.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
