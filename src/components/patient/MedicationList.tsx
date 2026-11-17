import React from "react";
import { Medication, Language } from "@/types";
import { en } from "@/lib/i18n/en";
import { ne } from "@/lib/i18n/ne";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill, Plus, CheckCircle2, Clock } from "lucide-react";

interface MedicationListProps {
  medications: Medication[];
  onOpenAddModal: () => void;
  lang: Language;
}

export const MedicationList: React.FC<MedicationListProps> = ({
  medications,
  onOpenAddModal,
  lang,
}) => {
  const t = lang === "ne" ? ne : en;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-forest-900">{t.myMedicines}</h2>
          <p className="text-xs text-forest-600">
            {medications.length} {medications.length === 1 ? "active medicine" : "active medicines"}
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={onOpenAddModal} className="flex items-center space-x-1">
          <Plus className="w-4 h-4 mr-1" />
          <span>{t.addMedication}</span>
        </Button>
      </div>

      {medications.length === 0 ? (
        <Card className="text-center py-10 bg-mint-50/50">
          <Pill className="w-12 h-12 text-forest-400 mx-auto mb-3 opacity-60" />
          <p className="text-base font-semibold text-forest-900 mb-2">{t.noMedicinesYet}</p>
          <Button variant="primary" size="md" onClick={onOpenAddModal}>
            <Plus className="w-4 h-4 mr-1" />
            {t.addMedication}
          </Button>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {medications.map((med) => (
            <Card key={med.id} className="border-mint-200 hover:border-mint-300">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-forest-900 text-base">{med.name}</h3>
                  <p className="text-sm text-forest-700 font-medium">{med.dosage}</p>
                </div>
                <span className="text-[11px] font-semibold bg-mint-100 text-forest-800 border border-mint-200 px-2 py-0.5 rounded-full capitalize">
                  {med.timeOfDay}
                </span>
              </div>
              {med.instructions && (
                <p className="text-xs text-forest-600 mt-2 bg-mint-50 p-2 rounded-lg border border-mint-100">
                  {med.instructions}
                </p>
              )}
              <div className="flex items-center space-x-1 text-[11px] text-emerald-700 font-medium mt-3">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Active Prescription</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
