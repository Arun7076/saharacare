import { NextResponse } from "next/server";
import { medicationService } from "@/lib/services/medicationService";

export async function GET() {
  try {
    const medications = medicationService.getMedications();
    return NextResponse.json({ success: true, medications });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch medications." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: "Medicine name is required." },
        { status: 400 }
      );
    }

    if (!body.dosage || typeof body.dosage !== "string" || !body.dosage.trim()) {
      return NextResponse.json(
        { success: false, error: "Dosage is required." },
        { status: 400 }
      );
    }

    const validTimes = ["morning", "afternoon", "evening", "night"];
    if (!validTimes.includes(body.timeOfDay)) {
      return NextResponse.json(
        { success: false, error: "Valid time of day (morning/afternoon/evening/night) is required." },
        { status: 400 }
      );
    }

    const medication = medicationService.createMedication({
      name: body.name.trim(),
      dosage: body.dosage.trim(),
      instructions: body.instructions?.trim() || "",
      timeOfDay: body.timeOfDay,
    });

    return NextResponse.json({ success: true, medication }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create medication." },
      { status: 500 }
    );
  }
}
