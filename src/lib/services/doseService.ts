import { getDatabase, getKathmanduDateKey } from "../db";
import { TodayDose, AdherenceSummary, DoseStatus, TimeOfDay } from "@/types";

export const doseService = {
  getTodayDoses(patientId: string = "patient-ram-01"): TodayDose[] {
    const db = getDatabase();
    const todayKey = getKathmanduDateKey();

    const rows = db
      .prepare(`
        SELECT 
          d.id,
          d.medication_id as medicationId,
          m.name as medicationName,
          m.dosage,
          m.instructions,
          m.time_of_day as timeOfDay,
          d.scheduled_time as scheduledTime,
          d.status,
          d.taken_at as takenAt
        FROM dose_records d
        JOIN medications m ON d.medication_id = m.id
        WHERE m.patient_id = ? AND d.date_key = ?
        ORDER BY 
          CASE m.time_of_day
            WHEN 'morning' THEN 1
            WHEN 'afternoon' THEN 2
            WHEN 'evening' THEN 3
            WHEN 'night' THEN 4
            ELSE 5
          END,
          d.scheduled_time ASC
      `)
      .all(patientId, todayKey) as any[];

    return rows.map((r) => ({
      id: r.id,
      medicationId: r.medicationId,
      medicationName: r.medicationName,
      dosage: r.dosage,
      instructions: r.instructions ?? "",
      timeOfDay: r.timeOfDay as TimeOfDay,
      scheduledTime: r.scheduledTime,
      status: r.status as DoseStatus,
      takenAt: r.takenAt,
    }));
  },

  markDoseTaken(doseId: string): { dose: TodayDose; adherence: AdherenceSummary } {
    const db = getDatabase();

    const existing = db
      .prepare(`
        SELECT d.*, m.name as medication_name, m.patient_id
        FROM dose_records d
        JOIN medications m ON d.medication_id = m.id
        WHERE d.id = ?
      `)
      .get(doseId) as any;

    if (!existing) {
      throw new Error(`Dose record with ID '${doseId}' not found.`);
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Update dose record
    db.prepare(`
      UPDATE dose_records
      SET status = 'taken', taken_at = ?
      WHERE id = ?
    `).run(timeString, doseId);

    // Create caregiver notification alert
    const alertId = `alert-${Date.now()}`;
    db.prepare(`
      INSERT INTO caregiver_alerts (id, patient_id, type, message, severity, time, created_at)
      VALUES (?, ?, 'reminder', ?, 'info', 'Just now', ?)
    `).run(
      alertId,
      existing.patient_id,
      `${existing.medication_name} was marked as taken at ${timeString}.`,
      now.toISOString()
    );

    const doses = this.getTodayDoses(existing.patient_id);
    const updatedDose = doses.find((d) => d.id === doseId)!;
    const adherence = this.getAdherenceSummary(existing.patient_id);

    return { dose: updatedDose, adherence };
  },

  getAdherenceSummary(patientId: string = "patient-ram-01"): AdherenceSummary {
    const doses = this.getTodayDoses(patientId);
    const totalScheduled = doses.length;
    const taken = doses.filter((d) => d.status === "taken").length;
    const missed = doses.filter((d) => d.status === "missed").length;
    const pending = totalScheduled - taken - missed;
    const percentage =
      totalScheduled > 0 ? Math.round((taken / totalScheduled) * 100) : 100;

    return {
      percentage,
      totalScheduled,
      taken,
      missed,
      pending,
    };
  },
};
