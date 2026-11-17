# SaharaCare MVP: System Architecture Document

## 1. High-Level Architectural Overview

SaharaCare MVP is engineered as a robust, lightweight, self-contained full-stack healthcare web application. It eliminates brittle external cloud dependencies while strictly preserving the clinical, accessibility, and caregiver-monitoring essence of the original SaharaCare platform.

```
+------------------------------------------------------------------------------------+
|                                BROWSER CLIENT                                      |
|                                                                                    |
|  +--------------------+  +----------------------+  +----------------------------+  |
|  | Patient Dashboard  |  | Caregiver Monitoring |  | Audio Accessibility Engine |  |
|  | - Today's Doses    |  | - Adherence Summary  |  | - Speech Synthesis (TTS)   |  |
|  | - Mark Dose Taken  |  | - Alert Feed         |  | - Voice Input (STT)        |  |
|  | - Medicine Forms   |  | - Linked Patient     |  | - Fallback Status Notice   |  |
|  +--------------------+  +----------------------+  +----------------------------+  |
|             |                       |                            |                 |
|             +-----------------------+----------------------------+                 |
|                                     |                                              |
|                           HTTP Fetch API / JSON                                    |
+-------------------------------------|----------------------------------------------+
                                      |
+-------------------------------------v----------------------------------------------+
|                              NEXT.JS BACKEND (Node.js 24)                          |
|                                                                                    |
|  API Route Handlers:                                                               |
|  - GET/POST     /api/medications   (Fetch active list, create new medication)      |
|  - GET/PATCH    /api/doses         (Today's Kathmandu schedule, mark taken)        |
|  - GET/POST     /api/caregiver     (Adherence score, caregiver alert records)      |
|  - GET          /api/health        (Health check, system status, uptime)           |
|                                     |                                              |
|                                     v                                              |
|  Service Layer:                                                                    |
|  - MedicationService: Validates dosage, intervals & active status                  |
|  - DoseService: Computes scheduled times, Kathmandu date key, adherence %          |
|  - AlertService: Triggers caregiver alerts for missed / late doses                 |
|                                     |                                              |
|                                     v                                              |
|  Persistence Layer (`node:sqlite` Native SQLite Engine):                           |
|  - Database file: `data/saharacare.db`                                             |
|  - Atomic transactions, zero C++ compilation dependencies                          |
+------------------------------------------------------------------------------------+
```

---

## 2. Directory Structure

```
c:\Users\ACER\Documents\Saharacare/
├── CODEFEST_PLAN.md             # Codefest plan, audit, feature scoping
├── ARCHITECTURE.md              # Technical specification and system design
├── PROGRESS.md                  # Incremental milestone progress tracker
├── README.md                    # Project overview, installation, demo instructions
├── package.json                 # Next.js, React, Tailwind, Lucide dependencies
├── tsconfig.json                # Strict TypeScript configuration
├── tailwind.config.ts           # SaharaCare color system & design tokens
├── postcss.config.mjs           # PostCSS Tailwind processor
├── next.config.ts               # Next.js 15 build configuration
├── data/
│   └── saharacare.db            # Embedded SQLite database (generated on boot)
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Global Root layout with header & accessibility
│   │   ├── page.tsx             # Main dashboard (Patient & Caregiver switcher)
│   │   ├── medicines/
│   │   │   └── page.tsx         # Medication management & creation page
│   │   ├── caregiver/
│   │   │   └── page.tsx         # Caregiver adherence & monitoring dashboard
│   │   └── api/
│   │       ├── health/route.ts       # Health endpoint
│   │       ├── medications/route.ts  # Medication CRUD
│   │       ├── doses/route.ts        # Dose retrieval & mark-taken state machine
│   │       └── caregiver/route.ts    # Adherence metrics & alert generation
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Navigation, language toggle & emergency trigger
│   │   │   └── BottomNav.tsx         # Mobile-first bottom action bar
│   │   ├── patient/
│   │   │   ├── TodayDoseTimeline.tsx # Morning/Afternoon/Evening dose list
│   │   │   ├── DoseItemCard.tsx      # Individual dose card with "Mark Taken" button
│   │   │   └── MedicationForm.tsx    # Add/edit medication modal form
│   │   ├── caregiver/
│   │   │   ├── AdherenceCard.tsx     # Percentage score ring & breakdown
│   │   │   └── AlertList.tsx         # Missed dose and reminder notifications
│   │   ├── audio/
│   │   │   ├── AudioAssistant.tsx    # Speech synthesis & voice recognition bar
│   │   │   └── VoiceMicButton.tsx    # Accessible microphone toggle with wave state
│   │   ├── emergency/
│   │   │   └── EmergencyModal.tsx    # 102/100 quick dialer with local hospitals
│   │   └── ui/
│   │       ├── Button.tsx            # Standard and Large button variants
│   │       ├── Card.tsx              # SaharaCare mint-bordered cards
│   │       └── StatusBadge.tsx       # Scheduled, Taken, Late, Missed badges
│   ├── lib/
│   │   ├── db.ts                # `node:sqlite` connection & migration bootstrapping
│   │   ├── services/            # Business logic for medications, doses, adherence
│   │   ├── i18n/
│   │   │   ├── en.ts            # English translations
│   │   │   └── ne.ts            # Nepali translations (देवनागरी)
│   │   └── audio.ts             # Web Speech API helpers & browser fallback guards
│   └── types/
│       └── index.ts             # Shared domain models and API contracts
└── tests/
    ├── db.test.mjs              # SQLite schema, foreign keys & seeding tests
    ├── doses.test.mjs           # Dose state transitions & adherence calculation tests
    └── api.test.mjs             # API endpoint responses & error handling tests
```

---

## 3. Relational Data Models & Schema Design

The SQLite schema represents the core domain without bloated legacy tables:

### 3.1 `patients` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Unique UUID or slug (e.g., `patient-ram`) |
| `name` | TEXT | NOT NULL | Patient's full name |
| `phone` | TEXT | | Contact phone number |
| `emergency_contact` | TEXT | | Designated family contact |
| `created_at` | TEXT | NOT NULL | ISO8601 creation timestamp |

### 3.2 `medications` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Unique medication ID |
| `patient_id` | TEXT | REFERENCES patients(id) | Associated patient |
| `name` | TEXT | NOT NULL | Medicine name (e.g., "Metformin 500mg") |
| `dosage` | TEXT | NOT NULL | Dosage description (e.g., "1 Tablet") |
| `instructions` | TEXT | | Meal advice (e.g., "Take after breakfast") |
| `time_of_day` | TEXT | NOT NULL | `morning` \| `afternoon` \| `evening` \| `night` |
| `active` | INTEGER | DEFAULT 1 | Active status boolean (1=active, 0=inactive) |
| `created_at` | TEXT | NOT NULL | ISO timestamp |

### 3.3 `dose_records` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Unique dose record ID |
| `medication_id` | TEXT | REFERENCES medications(id) | Linked medication |
| `date_key` | TEXT | NOT NULL | Date format `YYYY-MM-DD` in Asia/Kathmandu |
| `scheduled_time` | TEXT | NOT NULL | Time format `HH:MM` (e.g., `08:00`) |
| `status` | TEXT | NOT NULL | `scheduled` \| `taken` \| `late` \| `missed` |
| `taken_at` | TEXT | | Actual ISO timestamp when taken |

### 3.4 `caregiver_alerts` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Unique alert ID |
| `patient_id` | TEXT | REFERENCES patients(id) | Patient context |
| `type` | TEXT | NOT NULL | `missed_dose` \| `late_take` \| `low_adherence` |
| `message` | TEXT | NOT NULL | Human-readable alert summary |
| `created_at` | TEXT | NOT NULL | ISO timestamp |
| `acknowledged` | INTEGER | DEFAULT 0 | 0=unread, 1=acknowledged |

---

## 4. Audio-Assisted Subsystem Architecture

To fulfill the Codefest accessibility directive without introducing brittle external audio APIs:

1. **Text-to-Speech (TTS) Engine:**
   - Uses `window.speechSynthesis` with configured utterance rate, pitch, and locale (`en-US` or `ne-NP`).
   - Generates spoken summaries of daily schedules: *"Good morning Ram. You have 2 medicines scheduled today. First: Metformin 500mg, one tablet after breakfast."*
   - Stop/Pause audio playback controls to respect patient control.
2. **Speech-to-Text (STT) Voice Input:**
   - Uses `SpeechRecognition` / `webkitSpeechRecognition` with explicit microphone permission query.
   - Live visual status indicator (flashing recording dot & listening feedback).
   - Allows hands-free symptom logging and search filtering.
3. **Graceful Fallback Mode:**
   - If Web Speech API is absent or microphone permission is denied, clear visual text banners and large-font buttons appear so that no functionality is blocked.

---

## 5. Security & Privacy Safeguards

- **Synthetic Patient Data Only:** All initial seeds use synthetic mock personas (e.g., "Ram Bahadur Shrestha", "Sita Devi"). Zero real patient data or PII.
- **Local Isolation:** The SQLite database stays securely on the local device at `data/saharacare.db`.
- **Zero Insecure Key Leaks:** No third-party API keys or sensitive credentials exposed in client bundles.
