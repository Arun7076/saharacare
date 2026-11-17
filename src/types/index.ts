export type Language = "en" | "ne";
export type UserRole = "patient" | "caregiver";
export type DoseStatus = "scheduled" | "taken" | "late" | "missed";
export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  instructions: string;
  timeOfDay: TimeOfDay;
  active: boolean;
  createdAt: string;
}

export interface TodayDose {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  instructions: string;
  timeOfDay: TimeOfDay;
  scheduledTime: string;
  status: DoseStatus;
  takenAt?: string | null;
}

export interface AdherenceSummary {
  percentage: number;
  totalScheduled: number;
  taken: number;
  missed: number;
  pending: number;
}

export interface CaregiverAlert {
  id: string;
  patientName: string;
  type: "missed_dose" | "late_take" | "reminder";
  message: string;
  time: string;
  severity: "info" | "warning" | "urgent";
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  phone: string;
  emergencyContact: string;
  caregiverName: string;
}
