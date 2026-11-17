import React from "react";
import { UserRole, Language } from "@/types";
import { en } from "@/lib/i18n/en";
import { ne } from "@/lib/i18n/ne";
import { CalendarDays, Pill, Users, ShieldAlert } from "lucide-react";

interface BottomNavProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: "schedule" | "medicines";
  onTabChange: (tab: "schedule" | "medicines") => void;
  onOpenEmergency: () => void;
  lang: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  role,
  onRoleChange,
  activeTab,
  onTabChange,
  onOpenEmergency,
  lang,
}) => {
  const t = lang === "ne" ? ne : en;

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-mint-200 px-3 py-2 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <button
          onClick={() => {
            if (role !== "patient") onRoleChange("patient");
            onTabChange("schedule");
          }}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
            role === "patient" && activeTab === "schedule"
              ? "text-forest-900 font-bold bg-mint-100"
              : "text-forest-600 hover:text-forest-900"
          }`}
        >
          <CalendarDays className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">{t.todaySchedule}</span>
        </button>

        <button
          onClick={() => {
            if (role !== "patient") onRoleChange("patient");
            onTabChange("medicines");
          }}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
            role === "patient" && activeTab === "medicines"
              ? "text-forest-900 font-bold bg-mint-100"
              : "text-forest-600 hover:text-forest-900"
          }`}
        >
          <Pill className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">{t.myMedicines}</span>
        </button>

        <button
          onClick={() => onRoleChange("caregiver")}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
            role === "caregiver"
              ? "text-forest-900 font-bold bg-mint-100"
              : "text-forest-600 hover:text-forest-900"
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">{t.caregiverDashboard}</span>
        </button>

        <button
          onClick={onOpenEmergency}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl text-red-600 hover:text-red-700 transition-all"
        >
          <ShieldAlert className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight font-bold">{t.emergency}</span>
        </button>
      </div>
    </nav>
  );
};
