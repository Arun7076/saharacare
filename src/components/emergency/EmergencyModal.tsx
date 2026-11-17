import React from "react";
import { Language } from "@/types";
import { en } from "@/lib/i18n/en";
import { ne } from "@/lib/i18n/ne";
import { Phone, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  if (!isOpen) return null;
  const t = lang === "ne" ? ne : en;

  const contacts = [
    {
      name: t.ambulance,
      number: "102",
      badge: "National Ambulance",
      desc: "Emergency medical response & patient transport across Nepal",
    },
    {
      name: t.police,
      number: "100",
      badge: "Emergency Dispatch",
      desc: "Nepal Police emergency hotline",
    },
    {
      name: t.redCross,
      number: "+977-1-4270650",
      badge: "Kathmandu Central",
      desc: "Blood bank and emergency ambulance services",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-red-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-red-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-700/60 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">{t.emergencyTitle}</h2>
              <p className="text-xs text-red-100">{t.emergencySubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-red-100 hover:text-white hover:bg-red-700/50"
            aria-label={t.close}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Hotlines */}
        <div className="p-5 space-y-3.5">
          {contacts.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-red-100 bg-red-50/50 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-forest-900 text-base">{item.name}</h3>
                  <span className="text-[10px] font-semibold bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-forest-700 mt-0.5">{item.desc}</p>
                <p className="text-base font-extrabold text-red-700 mt-1">{item.number}</p>
              </div>
              <a
                href={`tel:${item.number}`}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>{t.callNow}</span>
              </a>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <Button variant="outline" size="md" onClick={onClose}>
            {t.close}
          </Button>
        </div>
      </div>
    </div>
  );
};
