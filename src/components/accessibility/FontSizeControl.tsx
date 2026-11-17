"use client";

import React from "react";
import { Type } from "lucide-react";

export type FontSize = "normal" | "large" | "extra-large";

interface FontSizeControlProps {
  fontSize: FontSize;
  onChangeFontSize: (size: FontSize) => void;
}

export const FontSizeControl: React.FC<FontSizeControlProps> = ({
  fontSize,
  onChangeFontSize,
}) => {
  return (
    <div className="inline-flex items-center space-x-1 bg-white/10 backdrop-blur-sm p-1 rounded-lg border border-forest-700/60 text-xs">
      <Type className="w-3.5 h-3.5 text-mint-200 ml-1 mr-0.5" />
      <button
        onClick={() => onChangeFontSize("normal")}
        className={`px-2 py-0.5 rounded transition-colors text-xs font-semibold ${
          fontSize === "normal"
            ? "bg-mint-100 text-forest-900 font-bold"
            : "text-mint-200 hover:text-white"
        }`}
        title="Normal Text Size"
        aria-label="Set normal text size"
      >
        A
      </button>
      <button
        onClick={() => onChangeFontSize("large")}
        className={`px-2 py-0.5 rounded transition-colors text-xs font-semibold ${
          fontSize === "large"
            ? "bg-mint-100 text-forest-900 font-bold"
            : "text-mint-200 hover:text-white"
        }`}
        title="Large Text Size"
        aria-label="Set large text size"
      >
        A+
      </button>
      <button
        onClick={() => onChangeFontSize("extra-large")}
        className={`px-2 py-0.5 rounded transition-colors text-xs font-semibold ${
          fontSize === "extra-large"
            ? "bg-mint-100 text-forest-900 font-bold"
            : "text-mint-200 hover:text-white"
        }`}
        title="Extra Large Text Size"
        aria-label="Set extra large text size"
      >
        A++
      </button>
    </div>
  );
};
