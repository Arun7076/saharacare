import { getDatabase } from "../db";
import { doseService } from "./doseService";
import { PatientProfile, CaregiverAlert, AdherenceSummary } from "@/types";

export const caregiverService = {
  getOverview(patientId: string = "patient-ram-01"): {
    patient: PatientProfile;
    adherence: AdherenceSummary;
    alerts: CaregiverAlert[];
  } {
    const db = getDatabase();

    const patientRow = db
      .prepare(`
        SELECT id, name, age, phone, emergency_contact as emergencyContact, caregiver_name as caregiverName
        FROM patients
        WHERE id = ?
      `)
      .get(patientId) as any;

    const patient: PatientProfile = patientRow
      ? {
          id: patientRow.id,
          name: patientRow.name,
          age: patientRow.age,
          phone: patientRow.phone,
          emergencyContact: patientRow.emergencyContact,
          caregiverName: patientRow.caregiverName,
        }
      : {
          id: patientId,
          name: "Ram Bahadur Shrestha",
          age: 68,
          phone: "+977-9841234567",
          emergencyContact: "+977-9812345678",
          caregiverName: "Pooja Shrestha (Daughter)",
        };

    const adherence = doseService.getAdherenceSummary(patientId);

    const alertRows = db
      .prepare(`
        SELECT 
          a.id,
          p.name as patientName,
          a.type,
          a.message,
          a.severity,
          a.time
        FROM caregiver_alerts a
        JOIN patients p ON a.patient_id = p.id
        WHERE a.patient_id = ?
        ORDER BY a.created_at DESC
        LIMIT 10
      `)
      .all(patientId) as any[];

    const alerts: CaregiverAlert[] = alertRows.map((r) => ({
      id: r.id,
      patientName: r.patientName,
      type: r.type,
      message: r.message,
      severity: r.severity,
      time: r.time,
    }));

    return {
      patient,
      adherence,
      alerts,
    };
  },
};
