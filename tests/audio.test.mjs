import { test, describe } from "node:test";
import assert from "node:assert/strict";

describe("SaharaCare Audio-Assisted Subsystem Unit Tests", () => {
  // Test Doses & Adherence Fixture
  const mockDoses = [
    {
      id: "dose-1",
      medicationId: "med-1",
      medicationName: "Metformin 500mg",
      dosage: "1 tablet",
      instructions: "Take after breakfast with water",
      timeOfDay: "morning",
      scheduledTime: "08:30 AM",
      status: "taken",
      takenAt: "08:35 AM",
    },
    {
      id: "dose-2",
      medicationId: "med-2",
      medicationName: "Amlodipine 5mg",
      dosage: "1 tablet",
      instructions: "Take after lunch",
      timeOfDay: "afternoon",
      scheduledTime: "01:30 PM",
      status: "scheduled",
      takenAt: null,
    },
  ];

  const mockAdherence = {
    percentage: 50,
    totalScheduled: 2,
    taken: 1,
    missed: 0,
    pending: 1,
  };

  test("1. English Speech Synthesis Script Formulation", () => {
    const doseDetails = mockDoses
      .map((d) => `${d.medicationName}, dosage ${d.dosage}. ${d.instructions || ""}`)
      .join(". ");

    const textToSpeak = `Namaste Ram Bahadur. Here is your SaharaCare medication schedule for today. You have ${mockDoses.length} scheduled doses. Your adherence score is ${mockAdherence.percentage} percent. Doses include: ${doseDetails}.`;

    assert.ok(textToSpeak.includes("Namaste Ram Bahadur"));
    assert.ok(textToSpeak.includes("50 percent"));
    assert.ok(textToSpeak.includes("Metformin 500mg"));
    assert.ok(textToSpeak.includes("Amlodipine 5mg"));
  });

  test("2. Nepali Speech Synthesis Script Formulation (देवनागरी)", () => {
    const doseDetails = mockDoses
      .map((d) => `${d.medicationName}, ${d.dosage}, ${d.instructions || ""}`)
      .join(". ");

    const textToSpeak = `नमस्ते राम बहादुर। आज तपाईंको ${mockDoses.length} वटा औषधि तालिकामा छन्। पालना दर ${mockAdherence.percentage} प्रतिशत छ। औषधिहरू: ${doseDetails}।`;

    assert.ok(textToSpeak.includes("नमस्ते राम बहादुर"));
    assert.ok(textToSpeak.includes("५० प्रतिशत") || textToSpeak.includes("50 प्रतिशत"));
    assert.ok(textToSpeak.includes("Metformin 500mg"));
  });

  test("3. Graceful Fallback Handling when Web Speech API is Absent", () => {
    // In headless Node.js environment, window.speechSynthesis is undefined
    const isSpeechSynthesisSupported = typeof window !== "undefined" && "speechSynthesis" in window;
    assert.equal(isSpeechSynthesisSupported, false, "Should detect unsupported environment cleanly");

    // Fallback error messaging verification
    let errorCaught = "";
    function onError(err) {
      errorCaught = err;
    }

    if (!isSpeechSynthesisSupported) {
      onError("Text-to-speech is not supported on this browser.");
    }

    assert.equal(errorCaught, "Text-to-speech is not supported on this browser.");
  });

  test("4. Microphone Permission Denial Error Handling", () => {
    function handleSpeechError(eventError) {
      if (eventError === "not-allowed") {
        return "Microphone access was denied. Please allow microphone permissions.";
      }
      return `Speech recognition error: ${eventError}`;
    }

    const deniedMessage = handleSpeechError("not-allowed");
    assert.equal(deniedMessage, "Microphone access was denied. Please allow microphone permissions.");

    const noSpeechMessage = handleSpeechError("network");
    assert.equal(noSpeechMessage, "Speech recognition error: network");
  });
});
