import { getDatabase, getKathmanduDateKey } from "../db";
import { Medication, TimeOfDay } from "@/types";

export interface CreateMedicationInput {
  patientId?: string;
  name: string;
  dosage: string;
  instructions?: string;
  timeOfDay: TimeOfDay;
}

export const medicationService = {
  getMedications(patientId: string = "patient-ram-01"): Medication[] {
    const db = getDatabase();
    const rows = db
      .prepare(`
        SELECT id, patient_id as patientId, name, dosage, instructions, time_of_day as timeOfDay, active, created_at as createdAt
        FROM medications
        WHERE patient_id = ? AND active = 1
        ORDER BY created_at DESC
      `)
      .all(patientId) as any[];

    return rows.map((r) => ({
      ...r,
      active: Boolean(r.active),
      instructions: r.instructions ?? "",
    }));
  },

  createMedication(input: CreateMedicationInput): Medication {
    const db = getDatabase();
    const patientId = input.patientId || "patient-ram-01";

    if (!input.name || !input.name.trim()) {
      throw new Error("Medication name is required.");
    }
    if (!input.dosage || !input.dosage.trim()) {
      throw new Error("Medication dosage is required.");
    }

    const medId = `med-${Date.now()}`;
    const now = new Date().toISOString();
    const instructions = input.instructions ? input.instructions.trim() : "";

    // Insert medication
    db.prepare(`
      INSERT INTO medications (id, patient_id, name, dosage, instructions, time_of_day, active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?)
    `).run(medId, patientId, input.name.trim(), input.dosage.trim(), instructions, input.timeOfDay, now);

    // Also materialize today's dose record
    const todayKey = getKathmanduDateKey();
    const doseId = `dose-${Date.now()}`;
    const timeMap: Record<TimeOfDay, string> = {
      morning: "08:00 AM",
      afternoon: "01:00 PM",
      evening: "06:00 PM",
      night: "09:00 PM",
    };

    db.prepare(`
      INSERT INTO dose_records (id, medication_id, date_key, scheduled_time, status, taken_at)
      VALUES (?, ?, ?, ?, 'scheduled', NULL)
    `).run(doseId, medId, todayKey, timeMap[input.timeOfDay]);

    return {
      id: medId,
      patientId,
      name: input.name.trim(),
      dosage: input.dosage.trim(),
      instructions,
      timeOfDay: input.timeOfDay,
      active: true,
      createdAt: now,
    };
  },
};
