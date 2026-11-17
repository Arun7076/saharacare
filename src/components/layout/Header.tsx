import React from "react";
import { UserRole, Language } from "@/types";
import { en } from "@/lib/i18n/en";
import { ne } from "@/lib/i18n/ne";
import { PhoneCall, ShieldAlert, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  role: UserRole;
  onRoleChange: (newRole: UserRole) => void;
  lang: Language;
  onLanguageToggle: () => void;
  onOpenEmergency: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  onRoleChange,
  lang,
  onLanguageToggle,
  onOpenEmergency,
}) => {
  const t = lang === "ne" ? ne : en;

  return (
    <header className="sticky top-0 z-30 bg-forest-900 text-white shadow-md border-b border-forest-800">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-forest-700 border border-mint-400 flex items-center justify-center text-mint-200">
            <Heart className="w-6 h-6 fill-mint-300 text-mint-300" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tight">{t.appName}</h1>
            <p className="text-[11px] text-mint-200 hidden sm:block mt-0.5">
              {t.appTagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Language Toggle */}
          <button
            onClick={onLanguageToggle}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-forest-800 hover:bg-forest-700 text-mint-100 border border-forest-700 min-h-[36px]"
            title="Toggle Language"
            aria-label="Toggle language between English and Nepali"
          >
            {lang === "en" ? "नेपाली" : "English"}
          </button>

          {/* Role Switcher */}
          <div className="inline-flex rounded-lg bg-forest-950 p-1 border border-forest-800 text-xs">
            <button
              onClick={() => onRoleChange("patient")}
              className={`px-3 py-1 rounded-md transition-colors ${
                role === "patient"
                  ? "bg-forest-600 text-white font-medium"
                  : "text-mint-200 hover:text-white"
              }`}
            >
              {t.patientRole}
            </button>
            <button
              onClick={() => onRoleChange("caregiver")}
              className={`px-3 py-1 rounded-md transition-colors ${
                role === "caregiver"
                  ? "bg-forest-600 text-white font-medium"
                  : "text-mint-200 hover:text-white"
              }`}
            >
              {t.caregiverRole}
            </button>
          </div>

          {/* Emergency SOS Button */}
          <Button
            variant="danger"
            size="sm"
            onClick={onOpenEmergency}
            className="flex items-center space-x-1 font-bold text-xs px-3 shadow-md bg-red-600 hover:bg-red-700"
            aria-label={t.emergency}
          >
            <ShieldAlert className="w-4 h-4 mr-1 text-white" />
            <span className="hidden xs:inline">{t.emergency}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
