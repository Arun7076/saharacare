"use client";

import React, { useState, useEffect } from "react";
import { TodayDose, AdherenceSummary, Language } from "@/types";
import { en } from "@/lib/i18n/en";
import { ne } from "@/lib/i18n/ne";
import {
  isSpeechSynthesisSupported,
  isSpeechRecognitionSupported,
  speakSchedule,
  stopSpeaking,
  createSpeechRecognizer,
} from "@/lib/audio";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Volume2, VolumeX, Mic, MicOff, Radio, AlertCircle } from "lucide-react";

interface AudioAssistantCardProps {
  doses: TodayDose[];
  adherence: AdherenceSummary;
  lang: Language;
  onVoiceSearch?: (query: string) => void;
}

export const AudioAssistantCard: React.FC<AudioAssistantCardProps> = ({
  doses,
  adherence,
  lang,
  onVoiceSearch,
}) => {
  const t = lang === "ne" ? ne : en;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasTtsSupport, setHasTtsSupport] = useState(true);
  const [hasSttSupport, setHasSttSupport] = useState(true);

  useEffect(() => {
    setHasTtsSupport(isSpeechSynthesisSupported());
    setHasSttSupport(isSpeechRecognitionSupported());
  }, []);

  // Handle Text-to-Speech
  const handleReadSchedule = () => {
    setErrorMessage(null);
    const success = speakSchedule(
      doses,
      adherence,
      lang,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      (err) => {
        setIsSpeaking(false);
        setErrorMessage(err);
      }
    );

    if (!success) {
      setErrorMessage(t.audioUnavailable);
    }
  };

  const handleStopAudio = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  // Handle Speech-to-Text Voice Input
  const handleToggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setErrorMessage(null);
    setVoiceQuery("");

    const recognizer = createSpeechRecognizer(
      lang,
      (text) => {
        setVoiceQuery(text);
        if (onVoiceSearch) onVoiceSearch(text);
      },
      () => setIsListening(false),
      (err) => {
        setIsListening(false);
        setErrorMessage(err);
      }
    );

    if (recognizer) {
      try {
        recognizer.start();
        setIsListening(true);
      } catch (err: any) {
        setErrorMessage("Microphone recognition could not be started.");
        setIsListening(false);
      }
    }
  };

  return (
    <Card className="bg-white border-mint-300 shadow-sm overflow-hidden p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Title & Badge */}
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-forest-900">{t.audioAssistant}</h3>
            <span className="text-[10px] font-bold bg-mint-100 text-forest-700 px-2 py-0.5 rounded-full border border-mint-200">
              Accessibility
            </span>
          </div>
          <p className="text-xs text-forest-600">
            Listen to your daily medication regimen or use hands-free voice commands.
          </p>
        </div>

        {/* Audio Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* TTS Button */}
          {isSpeaking ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleStopAudio}
              className="flex items-center space-x-1.5 bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200 font-bold"
            >
              <VolumeX className="w-4 h-4 text-amber-700" />
              <span>{t.stopAudio}</span>
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReadSchedule}
              className="flex items-center space-x-1.5 border-mint-300 hover:bg-mint-200 font-bold text-forest-900"
              title="Speak today's schedule aloud"
            >
              <Volume2 className="w-4 h-4 text-forest-700" />
              <span>{t.readSchedule}</span>
            </Button>
          )}

          {/* STT Voice Input Button */}
          <Button
            variant={isListening ? "danger" : "outline"}
            size="sm"
            onClick={handleToggleVoiceInput}
            className={`flex items-center space-x-1.5 font-bold ${
              isListening ? "animate-pulse" : "border-mint-300"
            }`}
            title="Speak a medication note or query"
          >
            {isListening ? (
              <>
                <Radio className="w-4 h-4 animate-spin text-white" />
                <span>{t.listening}</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-forest-700" />
                <span>{t.voiceSearch}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Speaking Indicator */}
      {isSpeaking && (
        <div className="mt-3 p-3 bg-mint-100/70 rounded-xl border border-mint-300 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2 text-xs font-bold text-forest-900">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-forest-600"></span>
            </span>
            <span>{t.audioSuccess}</span>
          </div>
          <button
            onClick={handleStopAudio}
            className="text-[11px] text-forest-700 hover:text-forest-900 underline font-bold"
          >
            {t.stopAudio}
          </button>
        </div>
      )}

      {/* Voice Recognition Live Feedback */}
      {isListening && (
        <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-200 flex items-center space-x-2 animate-in fade-in">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
          <p className="text-xs text-red-900 font-semibold">
            {t.listening}: {voiceQuery ? `"${voiceQuery}"` : "Waiting for speech..."}
          </p>
        </div>
      )}

      {/* Voice Query Result Display */}
      {voiceQuery && !isListening && (
        <div className="mt-3 p-3 bg-mint-50 rounded-xl border border-mint-200 text-xs text-forest-800 flex items-center justify-between">
          <span>
            <strong className="text-forest-900">Voice Note Captured:</strong> “{voiceQuery}”
          </span>
          <button
            onClick={() => setVoiceQuery("")}
            className="text-forest-600 hover:text-forest-900 text-[11px] underline ml-2"
          >
            Clear
          </button>
        </div>
      )}

      {/* Error / Fallback Notice */}
      {errorMessage && (
        <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Fallback Banner if Web Speech is completely unsupported */}
      {(!hasTtsSupport || !hasSttSupport) && (
        <div className="mt-3 p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-gray-600">
          <strong>Accessibility Note:</strong> Browser Web Speech API is partially unavailable in this environment. Text-based schedules and large font sizes remain 100% accessible.
        </div>
      )}
    </Card>
  );
};
