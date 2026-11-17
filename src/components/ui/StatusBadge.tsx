import React from "react";
import clsx from "clsx";
import { DoseStatus, Language } from "@/types";
import { en } from "@/lib/i18n/en";
import { ne } from "@/lib/i18n/ne";

interface StatusBadgeProps {
  status: DoseStatus;
  lang?: Language;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, lang = "en" }) => {
  const t = lang === "ne" ? ne : en;

  const config = {
    taken: {
      label: t.taken,
      className: "bg-emerald-100 text-emerald-800 border-emerald-300",
    },
    scheduled: {
      label: t.scheduled,
      className: "bg-sky-100 text-sky-800 border-sky-300",
    },
    late: {
      label: t.late,
      className: "bg-amber-100 text-amber-800 border-amber-300",
    },
    missed: {
      label: t.missed,
      className: "bg-red-100 text-red-800 border-red-300",
    },
  }[status];

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border",
        config.className
      )}
    >
      {config.label}
    </span>
  );
};
