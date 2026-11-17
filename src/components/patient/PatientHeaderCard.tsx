import React from "react";
import { AdherenceSummary, Language } from "@/types";
import { en } from "@/lib/i18n/en";
import { ne } from "@/lib/i18n/ne";
import { Card } from "@/components/ui/Card";
import { CheckCircle2, Clock, Calendar, Sparkles } from "lucide-react";

interface PatientHeaderCardProps {
  adherence: AdherenceSummary;
  lang: Language;
}

export const PatientHeaderCard: React.FC<PatientHeaderCardProps> = ({
  adherence,
  lang,
}) => {
  const t = lang === "ne" ? ne : en;

  // Kathmandu Date formatting
  const todayDate = new Intl.DateTimeFormat(lang === "ne" ? "ne-NP" : "en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <Card className="bg-gradient-to-br from-forest-900 via-forest-800 to-forest-700 text-white border-forest-600 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Date & Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-mint-200 bg-forest-950/40 px-2.5 py-1 rounded-full border border-forest-600/50">
            <Calendar className="w-3.5 h-3.5 text-mint-300" />
            <span>{todayDate} · Asia/Kathmandu</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
            Namaste, Ram Bahadur
          </h2>
          <p className="text-xs text-mint-100/90 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {adherence.taken === adherence.totalScheduled && adherence.totalScheduled > 0
                ? "Excellent! All medications taken for today."
                : `${adherence.pending} medication dose${adherence.pending === 1 ? "" : "s"} remaining today.`}
            </span>
          </p>
        </div>

        {/* Adherence Mini Badge */}
        <div className="flex items-center space-x-3 bg-forest-950/50 p-3 rounded-2xl border border-forest-600/60 self-start sm:self-auto">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-mint-300">
              {t.adherenceScore}
            </p>
            <p className="text-2xl font-black text-white leading-none mt-0.5">
              {adherence.percentage}%
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-forest-700 flex items-center justify-center text-mint-200 border border-mint-400/40">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 pt-4 border-t border-forest-700/60">
        <div className="flex items-center justify-between text-xs text-mint-200 mb-1.5 font-medium">
          <span>
            {t.dosesTaken}: {adherence.taken} / {adherence.totalScheduled}
          </span>
          <span>{adherence.percentage}% Completed</span>
        </div>
        <div className="w-full h-2.5 bg-forest-950/70 rounded-full overflow-hidden p-0.5 border border-forest-700">
          <div
            className="h-full bg-gradient-to-r from-mint-300 to-emerald-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(adherence.percentage, 4)}%` }}
          />
        </div>
      </div>
    </Card>
  );
};
