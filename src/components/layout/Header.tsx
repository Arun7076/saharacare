import React from "react";
import { UserRole, Language } from "@/types";
import { en } from "@/lib/i18n/en";
import { ne } from "@/lib/i18n/ne";
import { ShieldAlert, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FontSizeControl, FontSize } from "@/components/accessibility/FontSizeControl";

interface HeaderProps {
  role: UserRole;
  onRoleChange: (newRole: UserRole) => void;
  lang: Language;
  onLanguageToggle: () => void;
  onOpenEmergency: () => void;
  fontSize: FontSize;
  onChangeFontSize: (size: FontSize) => void;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  onRoleChange,
  lang,
  onLanguageToggle,
  onOpenEmergency,
  fontSize,
  onChangeFontSize,
}) => {
  const t = lang === "ne" ? ne : en;

  return (
    <header className="sticky top-0 z-30 bg-forest-900 text-white shadow-md border-b border-forest-800">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-forest-700 border border-mint-400 flex items-center justify-center text-mint-200 shadow-inner">
            <Heart className="w-5 h-5 fill-mint-300 text-mint-300" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-base sm:text-lg font-bold leading-none tracking-tight">
                {t.appName}
              </h1>
              <span className="text-[10px] font-bold bg-mint-200/20 text-mint-300 px-1.5 py-0.5 rounded border border-mint-400/30">
                MVP
              </span>
            </div>
            <p className="text-[11px] text-mint-200 hidden sm:block mt-0.5">
              {t.appTagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Accessible Font Size Adjuster */}
          <div className="hidden xs:block">
            <FontSizeControl fontSize={fontSize} onChangeFontSize={onChangeFontSize} />
          </div>

          {/* Language Toggle */}
          <button
            onClick={onLanguageToggle}
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-forest-800 hover:bg-forest-700 text-mint-100 border border-forest-700 min-h-[36px] transition-colors"
            title="Toggle Language"
            aria-label="Toggle language between English and Nepali"
          >
            {lang === "en" ? "नेपाली" : "English"}
          </button>

          {/* Role Switcher */}
          <div className="hidden sm:inline-flex rounded-lg bg-forest-950 p-1 border border-forest-800 text-xs">
            <button
              onClick={() => onRoleChange("patient")}
              className={`px-3 py-1 rounded-md transition-colors ${
                role === "patient"
                  ? "bg-forest-600 text-white font-bold shadow-sm"
                  : "text-mint-200 hover:text-white"
              }`}
            >
              {t.patientRole}
            </button>
            <button
              onClick={() => onRoleChange("caregiver")}
              className={`px-3 py-1 rounded-md transition-colors ${
                role === "caregiver"
                  ? "bg-forest-600 text-white font-bold shadow-sm"
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
            <ShieldAlert className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">{t.emergency}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
