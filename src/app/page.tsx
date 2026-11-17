"use client";

import React, { useState, useMemo } from "react";
import { UserRole, Language, TodayDose, Medication, TimeOfDay } from "@/types";
import { en } from "@/lib/i18n/en";
import { ne } from "@/lib/i18n/ne";
import {
  initialPatient,
  initialMedications,
  initialTodayDoses,
  initialCaregiverAlerts,
} from "@/lib/mock-data";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { PatientHeaderCard } from "@/components/patient/PatientHeaderCard";
import { TodayDoseTimeline } from "@/components/patient/TodayDoseTimeline";
import { MedicationList } from "@/components/patient/MedicationList";
import { MedicationForm } from "@/components/patient/MedicationForm";
import { CaregiverDashboard } from "@/components/caregiver/CaregiverDashboard";
import { EmergencyModal } from "@/components/emergency/EmergencyModal";
import { FontSize } from "@/components/accessibility/FontSizeControl";
import { CalendarDays, Pill, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SaharaCareApp() {
  const [role, setRole] = useState<UserRole>("patient");
  const [lang, setLang] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<"schedule" | "medicines">("schedule");
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("normal");

  // Application State
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [doses, setDoses] = useState<TodayDose[]>(initialTodayDoses);
  const [alerts, setAlerts] = useState(initialCaregiverAlerts);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const t = lang === "ne" ? ne : en;

  // Recalculate adherence score dynamically
  const adherence = useMemo(() => {
    const totalScheduled = doses.length;
    const taken = doses.filter((d) => d.status === "taken").length;
    const missed = doses.filter((d) => d.status === "missed").length;
    const pending = totalScheduled - taken - missed;
    const percentage =
      totalScheduled > 0 ? Math.round((taken / totalScheduled) * 100) : 100;

    return { percentage, totalScheduled, taken, missed, pending };
  }, [doses]);

  // Mark Dose Taken Action
  const handleMarkTaken = (doseId: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setDoses((prev) =>
      prev.map((dose) => {
        if (dose.id === doseId) {
          return {
            ...dose,
            status: "taken",
            takenAt: timeString,
          };
        }
        return dose;
      })
    );

    // Provide immediate user feedback
    const dose = doses.find((d) => d.id === doseId);
    if (dose) {
      setFeedbackMessage(`Confirmed: ${dose.medicationName} marked as taken.`);
      setTimeout(() => setFeedbackMessage(null), 3500);

      // Add alert update for caregiver
      setAlerts((prev) => [
        {
          id: `alert-${Date.now()}`,
          patientName: initialPatient.name,
          type: "reminder",
          message: `${dose.medicationName} marked as taken at ${timeString}.`,
          time: "Just now",
          severity: "info",
        },
        ...prev,
      ]);
    }
  };

  // Add Medication Action
  const handleSaveMedication = (newMedData: {
    name: string;
    dosage: string;
    instructions: string;
    timeOfDay: TimeOfDay;
  }) => {
    const newMedId = `med-${Date.now()}`;
    const newMed: Medication = {
      id: newMedId,
      patientId: initialPatient.id,
      ...newMedData,
      active: true,
      createdAt: new Date().toISOString(),
    };

    setMedications((prev) => [...prev, newMed]);

    const timeMap: Record<TimeOfDay, string> = {
      morning: "08:00 AM",
      afternoon: "01:00 PM",
      evening: "06:00 PM",
      night: "09:00 PM",
    };

    const newDose: TodayDose = {
      id: `dose-${Date.now()}`,
      medicationId: newMedId,
      medicationName: newMedData.name,
      dosage: newMedData.dosage,
      instructions: newMedData.instructions,
      timeOfDay: newMedData.timeOfDay,
      scheduledTime: timeMap[newMedData.timeOfDay],
      status: "scheduled",
      takenAt: null,
    };

    setDoses((prev) => [...prev, newDose]);

    setFeedbackMessage(`Added new medication: ${newMedData.name}`);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const fontSizeClass = {
    normal: "",
    large: "text-lg [&_h1]:text-2xl [&_h2]:text-2xl [&_h3]:text-xl [&_p]:text-base [&_span]:text-sm",
    "extra-large": "text-xl [&_h1]:text-3xl [&_h2]:text-3xl [&_h3]:text-2xl [&_p]:text-lg [&_span]:text-base",
  }[fontSize];

  return (
    <div className={`min-h-screen bg-mint-50 flex flex-col pb-20 sm:pb-8 ${fontSizeClass}`}>
      {/* Top Header */}
      <Header
        role={role}
        onRoleChange={setRole}
        lang={lang}
        onLanguageToggle={() => setLang((prev) => (prev === "en" ? "ne" : "en"))}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Toast / Feedback Notice */}
        {feedbackMessage && (
          <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-sm font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
            <span>{feedbackMessage}</span>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-emerald-700 hover:text-emerald-900 text-xs underline font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Patient View */}
        {role === "patient" && (
          <div className="space-y-5">
            {/* Patient Header Progress Card */}
            <PatientHeaderCard adherence={adherence} lang={lang} />

            {/* Tab Navigation */}
            <div className="flex items-center justify-between border-b border-mint-200 pb-3">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("schedule")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    activeTab === "schedule"
                      ? "bg-forest-900 text-white shadow-sm"
                      : "bg-white text-forest-800 border border-mint-200 hover:bg-mint-100"
                  }`}
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>{t.todaySchedule}</span>
                </button>

                <button
                  onClick={() => setActiveTab("medicines")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    activeTab === "medicines"
                      ? "bg-forest-900 text-white shadow-sm"
                      : "bg-white text-forest-800 border border-mint-200 hover:bg-mint-100"
                  }`}
                >
                  <Pill className="w-4 h-4" />
                  <span>{t.myMedicines}</span>
                </button>
              </div>

              {activeTab === "schedule" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAddMedOpen(true)}
                  className="hidden sm:inline-flex"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span>{t.addMedication}</span>
                </Button>
              )}
            </div>

            {/* Tab Contents */}
            {activeTab === "schedule" ? (
              <TodayDoseTimeline
                doses={doses}
                onMarkTaken={handleMarkTaken}
                lang={lang}
              />
            ) : (
              <MedicationList
                medications={medications}
                onOpenAddModal={() => setIsAddMedOpen(true)}
                lang={lang}
              />
            )}
          </div>
        )}

        {/* Caregiver View */}
        {role === "caregiver" && (
          <CaregiverDashboard
            patient={initialPatient}
            adherence={adherence}
            alerts={alerts}
            lang={lang}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        role={role}
        onRoleChange={setRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        lang={lang}
      />

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        lang={lang}
      />

      {/* Add Medication Modal */}
      <MedicationForm
        isOpen={isAddMedOpen}
        onClose={() => setIsAddMedOpen(false)}
        onSave={handleSaveMedication}
        lang={lang}
      />
    </div>
  );
}
