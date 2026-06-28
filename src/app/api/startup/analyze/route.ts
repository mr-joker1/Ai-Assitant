import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyzeStartupPitchDeck } from "@/lib/api-clients/openaiService";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id || "anonymous-user";

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const name = formData.get("name") as string || "Generic Startup";
    const website = formData.get("website") as string || "";
    const description = formData.get("description") as string || "";

    let extractedText = description;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileType = file.name.split(".").pop()?.toLowerCase();

      if (fileType === "pdf") {
        try {
          const parser = new PDFParse({ data: buffer });
          const pdfData = await parser.getText();
          extractedText += "\n" + pdfData.text;
        } catch (pdfErr) {
          console.error("PDF parsing failed, falling back to basic regex extraction", pdfErr);
          extractedText += "\n[Error reading PDF contents]";
        }
      } else if (fileType === "docx") {
        try {
          const docxData = await mammoth.extractRawText({ buffer });
          extractedText += "\n" + docxData.value;
        } catch (docxErr) {
          console.error("DOCX parsing failed", docxErr);
          extractedText += "\n[Error reading DOCX contents]";
        }
      } else if (fileType === "txt") {
        extractedText += "\n" + buffer.toString("utf8");
      }
    }

    if (!extractedText.trim()) {
      return NextResponse.json({ error: "No text content found to analyze" }, { status: 400 });
    }

    // Call OpenAI to extract details & perform screening
    const analysis = await analyzeStartupPitchDeck(
      file?.name || "manual_input.txt",
      extractedText
    );

    // Save startup analysis to database
    const startup = await db.startup.create({
      data: {
        userId,
        name,
        pitchDeckUrl: file ? `/uploads/${file.name}` : null,
        website,
        businessActivities: analysis.businessActivities,
        revenueModel: analysis.revenueModel,
        fundingAmount: parseFloat(analysis.funding.match(/\d+/)?.[0] || "0"),
        loansAmount: parseFloat(analysis.loans.match(/\d+/)?.[0] || "0"),
        investmentsAmount: parseFloat(analysis.investments.match(/\d+/)?.[0] || "0"),
        contractsDetails: analysis.contracts,
        complianceScore: analysis.complianceScore,
        halalStatus: analysis.status.toUpperCase() === "HALAL",
        reasons: analysis.reasons,
        evidence: analysis.evidence,
        suggestions: analysis.suggestions,
      }
    });

    return NextResponse.json({ startup, analysis });
  } catch (error: any) {
    console.error("Startup analyze route failed:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze startup pitch deck" }, { status: 500 });
  }
}
