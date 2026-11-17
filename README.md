# SaharaCare MVP: Accessible Healthcare & Patient Adherence Platform

> Built from scratch for the Codefest Hackathon. An independently implemented, clean, fully functional MVP connecting patients and caregivers through daily scheduled medication timelines, instant mark-as-taken logging, voice-assisted accessibility, and family adherence oversight.

---

## 🌟 What SaharaCare Does

SaharaCare is a full-stack digital health platform tailored for Nepal and South Asia. It bridges the critical communication and adherence gap between elderly patients and their family caregivers:

1. **Patient Care Journey:**
   - Visual **Today's Medication Timeline** organized into Morning, Afternoon, Evening, and Night.
   - One-tap **"Mark Taken"** action that records local timestamps, flips dose status, and dynamically recalculates adherence scores.
   - **Active Prescriptions Manager** to add new medicines with dosages, meal instructions, and time-of-day scheduling.
2. **Audio-Assisted Accessibility Subsystem:**
   - **Text-to-Speech (TTS):** Audibly reads the entire daily regimen and adherence score in clear synthesized speech (supporting English and Nepali voice locales).
   - **Voice Input (STT):** Hands-free speech-to-text dictation for notes and search filtering with clear microphone recording wave indicators.
   - **Accessible Fallback:** Text-based schedule and dynamic font resizing (Normal, A+, A++) for patients with low vision or unsupported speech environments.
3. **Caregiver Oversight Dashboard:**
   - Real-time compliance monitoring of linked family members (e.g., Ram Bahadur Shrestha, Age 68).
   - Animated **Adherence Progress Ring** displaying today's percentage, doses taken, and remaining pending doses.
   - Live **Alert Feed** logging reminders, taken confirmations, and late takes.
4. **Emergency Quick Dialers:**
   - Instant access to Nepal national emergency services: **Ambulance (102)**, **Police (100)**, and **Nepal Red Cross (01-4270650)**.
5. **Bilingual Support:**
   - One-tap toggle between **English** and **Nepali (नेपाली)** across all interfaces, notifications, and speech synthesizers.

---

## 🏗️ System Architecture & Technology Stack

| Layer | Technology | Role & Advantages |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15 (App Router) + React 19 | Fast server & client rendering, modern state hooks, responsive components. |
| **Language** | TypeScript 5.7+ | Strict type checking across entities, API contracts, and components. |
| **Design System** | Tailwind CSS 3.4 | SaharaCare signature Forest Green (`#083430`), Mint (`#EAF6F4`), and high contrast tokens. |
| **Backend** | Next.js Server Route Handlers | `/api/medications`, `/api/doses`, `/api/caregiver`, `/api/health`. |
| **Database** | Node.js 24 Native SQLite (`node:sqlite`) | Embedded relational database (`data/saharacare.db`) with zero external cloud dependencies or API keys. Atomic transactions and foreign keys. |
| **Audio** | Web Speech API | Native browser `SpeechSynthesis` and `SpeechRecognition` with explicit permission handling. |
| **Testing** | Node.js Native Test Runner (`node --test`) | Built-in test suite executing unit, backend, and integration tests in <200ms. |

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Node.js:** v20.19.0 or higher (v24.x recommended for native `node:sqlite`)
- **npm:** v10.x or higher
- **Git**

### Installation

1. Clone the repository and checkout the development branch:
   ```bash
   git clone git@github.com:Arun7076/Saharacare.git
   cd Saharacare
   git checkout codefest/saharacare-mvp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the automated test suite:
   ```bash
   npm test
   ```
   *(Executes 13 unit, database, and integration tests)*

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. Build for production:
   ```bash
   npm run build
   npm run start
   ```

---

## 📱 How to Demonstrate the MVP at Codefest

1. **Step 1: Patient Dashboard & Today's Schedule**
   - Open [http://localhost:3000](http://localhost:3000). The app launches in **Patient View** with Ram Bahadur's today schedule.
   - Note the Kathmandu date banner, the morning Metformin (Taken), and the afternoon Amlodipine (Scheduled).
2. **Step 2: Audio-Assisted Reading**
   - Click **"Read Today's Schedule Aloud"** in the Audio Assistant card.
   - Listen as the browser speaks the schedule clearly. Click **"Stop Audio"** to demonstrate playback control.
3. **Step 3: Hands-Free Voice Input**
   - Click **"Voice Note / Search"** (Microphone button).
   - Speak a phrase (e.g., *"Take medicine after dinner"*). Observe the live listening pulse and captured transcript banner.
4. **Step 4: Mark Dose Taken**
   - Click **"Mark Taken"** on the afternoon dose (Amlodipine 5mg).
   - Observe the immediate status transition to `taken`, the server timestamp recorded, the adherence percentage jumping from 33% to 67%, and the green confirmation banner.
5. **Step 5: Caregiver Monitoring**
   - Switch to **Caregiver View** using the top header or mobile bottom navigation.
   - View the linked patient summary, the updated 67% adherence ring, and the real-time alert feed logging the confirmed dose.
6. **Step 6: Accessibility Font Resizer & Bilingual Mode**
   - Click **A / A+ / A++** in the header to enlarge the entire UI typography for elderly patients.
   - Click **"नेपाली"** to switch the entire application and audio speech synthesis to Nepali.
7. **Step 7: Emergency SOS**
   - Click the red **"Emergency"** button to open direct dial shortcuts for Nepal Ambulance (102), Police (100), and Red Cross.

---

## 📜 Development Milestone History

All development was executed in 8 verified stages on branch `codefest/saharacare-mvp`:

- **Stage 0:** Initial analysis, application audit, feature scoping, and architecture planning (`f52bd4c`).
- **Stage 1:** Clean foundation scaffolding, entry point, build configuration (`730d8f2`).
- **Stage 2:** Core frontend layout, patient journey, medication manager, caregiver view (`4b41bb5`).
- **Stage 3:** SaharaCare UI redesign, font size accessibility, responsive mobile nav (`5bbf031`).
- **Stage 4:** Embedded SQLite database, relational tables, CRUD services, API endpoints (`3926fc5`).
- **Stage 5:** End-to-end frontend/backend integration, real-time database mutations (`39326b5`).
- **Stage 6:** Audio-assisted accessibility: speech synthesis, voice input, mic controls (`6c226c5`).
- **Stage 7:** Verification, comprehensive tests, and final polish (`Pending`).

---

## 🔒 Security & Privacy Notice

SaharaCare MVP uses exclusively synthetic mock patient records (`Ram Bahadur Shrestha`). No real patient data or protected health information is used or stored. The embedded SQLite database resides locally on the device with zero unauthorized external transmission.
