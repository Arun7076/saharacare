import React from "react";
import { AdherenceSummary, CaregiverAlert, PatientProfile, Language } from "@/types";
import { en } from "@/lib/i18n/en";
import { ne } from "@/lib/i18n/ne";
import { Card } from "@/components/ui/Card";
import { User, Bell, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from "lucide-react";

interface CaregiverDashboardProps {
  patient: PatientProfile;
  adherence: AdherenceSummary;
  alerts: CaregiverAlert[];
  lang: Language;
}

export const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({
  patient,
  adherence,
  alerts,
  lang,
}) => {
  const t = lang === "ne" ? ne : en;

  return (
    <div className="space-y-6">
      {/* Patient Profile Header Card */}
      <Card className="bg-gradient-to-r from-forest-900 to-forest-800 text-white border-forest-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-forest-700 border border-mint-400 flex items-center justify-center text-mint-200">
              <User className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-mint-300">
                {t.linkedPatient}
              </span>
              <h2 className="text-xl font-bold">{patient.name}</h2>
              <p className="text-xs text-mint-100">
                Age: {patient.age} · Phone: {patient.phone}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-forest-950/60 px-3 py-1.5 rounded-xl border border-forest-700/60 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-mint-100 font-medium">{patient.caregiverName}</span>
          </div>
        </div>
      </Card>

      {/* Adherence Score Card */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="sm:col-span-1 flex flex-col items-center justify-center text-center p-6 bg-mint-50/60">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-mint-200"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-forest-700 transition-all duration-500 ease-out"
                strokeDasharray={`${adherence.percentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-forest-900 leading-none">
                {adherence.percentage}%
              </span>
              <span className="text-[10px] font-bold text-forest-600 uppercase mt-0.5">
                Score
              </span>
            </div>
          </div>
          <h3 className="font-bold text-forest-900 text-sm mt-3">{t.adherenceScore}</h3>
        </Card>

        {/* Breakdown Stats */}
        <div className="sm:col-span-2 grid grid-cols-2 gap-3">
          <Card className="flex items-center space-x-3.5 bg-emerald-50/50 border-emerald-200">
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-800">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-900">{adherence.taken}</p>
              <p className="text-xs font-semibold text-emerald-700">{t.dosesTaken}</p>
            </div>
          </Card>

          <Card className="flex items-center space-x-3.5 bg-sky-50/50 border-sky-200">
            <div className="p-3 bg-sky-100 rounded-xl text-sky-800">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-sky-900">{adherence.pending}</p>
              <p className="text-xs font-semibold text-sky-700">{t.dosesPending}</p>
            </div>
          </Card>

          <Card className="col-span-2 flex items-center justify-between p-4 bg-white">
            <div className="text-xs text-forest-700">
              <span className="font-bold text-forest-900">Total Today: </span>
              {adherence.totalScheduled} doses scheduled across morning, afternoon, and night.
            </div>
            <span className="text-xs font-bold text-forest-800 bg-mint-100 px-3 py-1 rounded-full border border-mint-200">
              Daily Regimen
            </span>
          </Card>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-forest-700" />
          <h3 className="text-base font-bold text-forest-900">{t.recentAlerts}</h3>
        </div>

        <div className="space-y-2.5">
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              className={`p-4 border ${
                alert.severity === "warning"
                  ? "bg-amber-50/40 border-amber-200"
                  : "bg-mint-50/30 border-mint-200"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-xl mt-0.5 ${
                    alert.severity === "warning"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-forest-100 text-forest-800"
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-forest-900">
                      {alert.patientName}
                    </h4>
                    <span className="text-[11px] text-forest-500">{alert.time}</span>
                  </div>
                  <p className="text-xs text-forest-700 mt-1 leading-relaxed">
                    {alert.message}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
