# SaharaCare MVP

SaharaCare MVP is an accessible, bilingual healthcare adherence platform built from scratch for the Codefest hackathon. It connects patients and caregivers through daily scheduled medication timelines, instant mark-as-taken logging, voice-assisted accessibility, and family adherence oversight.

## 🚀 Key Features

- **Patient Medication Timeline:** Visual morning, afternoon, evening, and night dose cards with dosage instructions.
- **Dose Adherence Tracking:** Real-time state machine (`scheduled` → `taken` / `late` / `missed`) with instant adherence score recalculation.
- **Audio-Assisted Accessibility:** Text-to-speech read-aloud and voice speech-to-text input with clear visual indicators and accessible text fallback.
- **Caregiver Monitoring Dashboard:** Live compliance tracking, adherence ring, and missed dose alerts.
- **Emergency Hotline Shortcuts:** Instant access to Nepal emergency services (Ambulance 102, Police 100, Red Cross).
- **Self-Contained Local Backend:** Powered by Node.js native `node:sqlite` database requiring zero external cloud subscriptions or API keys.

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Backend:** Next.js Server Route Handlers, Node.js 24 native SQLite (`node:sqlite`)
- **Audio Subsystem:** Web Speech API (`SpeechSynthesis` & `SpeechRecognition`)
- **Testing:** Node.js native test runner (`node --test`)

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone git@github.com:Arun7076/Saharacare.git
   cd Saharacare
   git checkout codefest/saharacare-mvp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Run the automated test suite:**
   ```bash
   npm test
   ```
