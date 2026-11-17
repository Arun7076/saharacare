import { Medication, TodayDose, CaregiverAlert, PatientProfile } from "@/types";

export const initialPatient: PatientProfile = {
  id: "patient-ram-01",
  name: "Ram Bahadur Shrestha",
  age: 68,
  phone: "+977-9841234567",
  emergencyContact: "+977-9812345678",
  caregiverName: "Pooja Shrestha (Daughter)",
};

export const initialMedications: Medication[] = [
  {
    id: "med-1",
    patientId: "patient-ram-01",
    name: "Metformin 500mg",
    dosage: "1 tablet",
    instructions: "Take after breakfast with water",
    timeOfDay: "morning",
    active: true,
    createdAt: "2026-11-10T08:00:00Z",
  },
  {
    id: "med-2",
    patientId: "patient-ram-01",
    name: "Amlodipine 5mg",
    dosage: "1 tablet",
    instructions: "Blood pressure control, take after lunch",
    timeOfDay: "afternoon",
    active: true,
    createdAt: "2026-11-10T08:00:00Z",
  },
  {
    id: "med-3",
    patientId: "patient-ram-01",
    name: "Atorvastatin 20mg",
    dosage: "1 tablet",
    instructions: "Take before sleeping at night",
    timeOfDay: "night",
    active: true,
    createdAt: "2026-11-10T08:00:00Z",
  },
];

export const initialTodayDoses: TodayDose[] = [
  {
    id: "dose-1",
    medicationId: "med-1",
    medicationName: "Metformin 500mg",
    dosage: "1 tablet",
    instructions: "Take after breakfast with water",
    timeOfDay: "morning",
    scheduledTime: "08:30 AM",
    status: "taken",
    takenAt: "08:35 AM",
  },
  {
    id: "dose-2",
    medicationId: "med-2",
    medicationName: "Amlodipine 5mg",
    dosage: "1 tablet",
    instructions: "Blood pressure control, take after lunch",
    timeOfDay: "afternoon",
    scheduledTime: "01:30 PM",
    status: "scheduled",
    takenAt: null,
  },
  {
    id: "dose-3",
    medicationId: "med-3",
    medicationName: "Atorvastatin 20mg",
    dosage: "1 tablet",
    instructions: "Take before sleeping at night",
    timeOfDay: "night",
    scheduledTime: "09:30 PM",
    status: "scheduled",
    takenAt: null,
  },
];

export const initialCaregiverAlerts: CaregiverAlert[] = [
  {
    id: "alert-1",
    patientName: "Ram Bahadur Shrestha",
    type: "late_take",
    message: "Amlodipine 5mg was taken 25 minutes past scheduled time yesterday.",
    time: "Yesterday, 01:55 PM",
    severity: "warning",
  },
  {
    id: "alert-2",
    patientName: "Ram Bahadur Shrestha",
    type: "reminder",
    message: "Morning Metformin was confirmed taken on time.",
    time: "Today, 08:35 AM",
    severity: "info",
  },
];
