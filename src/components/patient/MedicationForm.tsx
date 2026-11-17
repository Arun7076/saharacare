import React, { useState } from "react";
import { TimeOfDay, Language } from "@/types";
import { en } from "@/lib/i18n/en";
import { ne } from "@/lib/i18n/ne";
import { Button } from "@/components/ui/Button";
import { X, PlusCircle } from "lucide-react";

interface MedicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (med: {
    name: string;
    dosage: string;
    instructions: string;
    timeOfDay: TimeOfDay;
  }) => void;
  lang: Language;
}

export const MedicationForm: React.FC<MedicationFormProps> = ({
  isOpen,
  onClose,
  onSave,
  lang,
}) => {
  if (!isOpen) return null;
  const t = lang === "ne" ? ne : en;

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("morning");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter the medication name.");
      return;
    }
    if (!dosage.trim()) {
      setError("Please enter the dosage.");
      return;
    }

    onSave({
      name: name.trim(),
      dosage: dosage.trim(),
      instructions: instructions.trim(),
      timeOfDay,
    });

    setName("");
    setDosage("");
    setInstructions("");
    setTimeOfDay("morning");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-mint-300 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-forest-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-mint-300" />
            <h2 className="text-lg font-bold">{t.addMedication}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-mint-200 hover:text-white"
            aria-label={t.cancel}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1.5">
              {t.medName} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Paracetamol 500mg"
              className="w-full px-3.5 py-2.5 rounded-xl border border-mint-300 focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm text-forest-900 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1.5">
              {t.medDosage} *
            </label>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g., 1 tablet after meals"
              className="w-full px-3.5 py-2.5 rounded-xl border border-mint-300 focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm text-forest-900 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1.5">
              {t.medTimeOfDay}
            </label>
            <select
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-mint-300 focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm text-forest-900 bg-white"
            >
              <option value="morning">{t.morning} (08:00 AM)</option>
              <option value="afternoon">{t.afternoon} (01:00 PM)</option>
              <option value="evening">{t.evening} (06:00 PM)</option>
              <option value="night">{t.night} (09:00 PM)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1.5">
              {t.medInstructions}
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g., Drink full glass of water, do not skip"
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl border border-mint-300 focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm text-forest-900 bg-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2">
            <Button type="button" variant="outline" size="md" onClick={onClose}>
              {t.cancel}
            </Button>
            <Button type="submit" variant="primary" size="md">
              {t.saveMedication}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
