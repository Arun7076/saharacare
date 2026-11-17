import { NextResponse } from "next/server";
import { caregiverService } from "@/lib/services/caregiverService";

export async function GET() {
  try {
    const data = caregiverService.getOverview();
    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch caregiver overview." },
      { status: 500 }
    );
  }
}
