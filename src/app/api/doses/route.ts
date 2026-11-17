import { NextResponse } from "next/server";
import { doseService } from "@/lib/services/doseService";

export async function GET() {
  try {
    const doses = doseService.getTodayDoses();
    const adherence = doseService.getAdherenceSummary();
    return NextResponse.json({ success: true, doses, adherence });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch doses." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    if (!body.doseId || typeof body.doseId !== "string") {
      return NextResponse.json(
        { success: false, error: "Dose ID is required." },
        { status: 400 }
      );
    }

    const result = doseService.markDoseTaken(body.doseId);
    return NextResponse.json({
      success: true,
      dose: result.dose,
      adherence: result.adherence,
    });
  } catch (error: any) {
    const status = error.message?.includes("not found") ? 404 : 400;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update dose status." },
      { status }
    );
  }
}
