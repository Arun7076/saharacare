import { Language, TodayDose, AdherenceSummary } from "@/types";

export interface SpeechRecognitionResultState {
  transcript: string;
  isFinal: boolean;
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function isSpeechRecognitionSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
  );
}

export function speakSchedule(
  doses: TodayDose[],
  adherence: AdherenceSummary,
  lang: Language,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: string) => void
): boolean {
  if (!isSpeechSynthesisSupported()) {
    if (onError) onError("Text-to-speech is not supported on this browser.");
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  let textToSpeak = "";
  if (lang === "ne") {
    const doseDetails = doses
      .map((d) => `${d.medicationName}, ${d.dosage}, ${d.instructions || ""}`)
      .join(". ");
    textToSpeak = `नमस्ते राम बहादुर। आज तपाईंको ${doses.length} वटा औषधि तालिकामा छन्। पालना दर ${adherence.percentage} प्रतिशत छ। औषधिहरू: ${doseDetails}।`;
  } else {
    const doseDetails = doses
      .map((d) => `${d.medicationName}, dosage ${d.dosage}. ${d.instructions || ""}`)
      .join(". ");
    textToSpeak = `Namaste Ram Bahadur. Here is your SaharaCare medication schedule for today. You have ${doses.length} scheduled doses. Your adherence score is ${adherence.percentage} percent. Doses include: ${doseDetails}.`;
  }

  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = lang === "ne" ? "ne-NP" : "en-US";
  utterance.rate = 0.95; // Slightly slower for elderly patient clarity
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    if (onError) onError(`Speech synthesis error: ${e.error}`);
  };

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}

export function createSpeechRecognizer(
  lang: Language,
  onResult: (text: string) => void,
  onEnd: () => void,
  onError: (error: string) => void
): any {
  if (!isSpeechRecognitionSupported()) {
    onError("Speech recognition is not supported on this browser.");
    return null;
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  try {
    const recognizer = new SpeechRecognition();
    recognizer.continuous = false;
    recognizer.interimResults = true;
    recognizer.lang = lang === "ne" ? "ne-NP" : "en-US";

    recognizer.onresult = (event: any) => {
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      onResult(currentTranscript);
    };

    recognizer.onend = () => {
      onEnd();
    };

    recognizer.onerror = (event: any) => {
      if (event.error === "not-allowed") {
        onError("Microphone access was denied. Please allow microphone permissions.");
      } else if (event.error === "no-speech") {
        onError("No speech was detected. Please try speaking again.");
      } else {
        onError(`Speech recognition error: ${event.error}`);
      }
      onEnd();
    };

    return recognizer;
  } catch (err: any) {
    onError(err.message || "Could not initialize microphone recognizer.");
    return null;
  }
}
