# BIS Standards — AI-powered Intelligent Assistant for Indian Standards and BIS Services

**Problem Statement:** SIH26107 — AI-powered Intelligent Assistant for Indian Standards and BIS Services for Industries and Consumers

**Secondary Capability:** SIH26108-inspired Procurement Specification Analysis and Standard Recommendation

> ⚠️ **This is a Smart India Hackathon prototype for idea demonstration only.** It is **not** a production system.
> AI, the verified BIS knowledge base, OCR/PDF text extraction, a real database, the patent database, and
> government schemes data are all represented here using **mock services with realistic demo data**. No real
> external AI, BIS, patent, or government scheme integrations are called anywhere in this codebase.

---

## What this prototype demonstrates

A React frontend talks to a real backend REST API — this is genuine frontend↔backend communication, not
hardcoded UI data. Every screen result comes back from an HTTP call to the backend's mock services.

**Core workflow (fully wired, end to end):**

```
Procurement PDF → Requirement Extraction → BIS Standard Matching → Ranked Results → AI Explanation → Compliance Report
```

**Supporting features:** Patent Guidance, Government Schemes Finder & Eligibility Check (personalised using an
editable User Profile).

## Tech stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React.js (Vite), React Router, Axios, lucide-react |
| Backend   | Java 17, Spring Boot 3.2 (Spring Web / REST), Maven |
| Data      | In-memory mock data only — no database is required to run this prototype |

## Project structure

```
/frontend   React application (port 5173)
/backend    Spring Boot application (port 8080)
README.md   This file
```

### Backend package structure

```
src/main/java/com/example/bisassistant/
    controller/   AssistantController, ProcurementController, StandardController,
                  ExplanationController, ReportController, PatentController,
                  AuthController, ProfileController, SchemeController
    service/      AssistantService, ProcurementService, StandardMatchingService,
                  ExplanationService, ReportService, PatentService,
                  AuthService (also owns profile storage), SchemeService
    model/        Request/response records for every endpoint
    repository/   MockStandardRepository, MockSchemeRepository (in-memory demo data)
    config/       CorsConfig (allows the Vite dev server to call the API)
    BisAssistantApplication.java
```

## How to run

### Backend (Spring Boot) — runs on **http://localhost:8080**

```bash
cd backend
mvn spring-boot:run
```

Requires Java 17+ and Maven. On first run Maven will download the Spring Boot dependencies (internet access
required for that one-time step).

### Frontend (React + Vite) — runs on **http://localhost:5173**

```bash
cd frontend
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser. The frontend is configured (see `.env.example`) to call the
backend at `http://localhost:8080/api` — copy `.env.example` to `.env` if you need to change that.

> Start the backend first, then the frontend, so the first API calls (e.g. loading the profile) succeed
> immediately. If the backend isn't running yet, the frontend shows a clean "Could not reach the backend"
> message rather than crashing.

## The 7 modules

**Core BIS workflow (fully connected):**
1. BIS Standard Assistant
2. Procurement Specification Analyzer
3. BIS Standard Matching Engine
4. AI-Powered Explanation
5. Compliance Report Generation

**Supporting features:**
6. Patent Guidance
7. Government Schemes Finder & Eligibility Check (personalised via the User Profile page)

## Main demonstration flow

1. Landing Page → **Get Started**
2. Dashboard → **Procurement Analyzer**
3. Upload/select a sample procurement PDF (drag-and-drop or browse)
4. **Analyze Document** → backend returns mock extracted requirements
5. **Find Relevant BIS Standards** → backend returns ranked standards with relevance scores
6. Select the top standard → **View Standard Details**
7. **View AI Explanation** → backend returns a simulated explanation, matched requirements and a potential gap
8. Ask a follow-up question (e.g. "Explain this standard in simple language")
9. **Generate Compliance Report** → backend returns structured report data
10. **Download Report** → opens a print-ready view (Save as PDF), or download as a plain HTML file

**Government Schemes Finder flow:**
1. **User Profile and Government Schemes Finder require logging in.** Use the demo account
   (`demo@example.com` / `demo1234`) shown on the Login page, or register a new one.
2. Open **User Profile** to view/edit your full profile, or open **Government Schemes Finder** directly — its
   "Edit Profile" link opens a focused page for just the scheme-matching fields (User Type, Sector, State,
   Business Size, Turnover, Purpose) without leaving the schemes flow
3. "Your Profile Information" is read automatically from the saved profile
4. Click **Find Suitable Schemes** → backend compares the profile against the mock schemes database
5. Review ranked results (Eligible / Partially Matched / Not Matched) with matched/unmatched criteria
6. **View Details** on any scheme for its full eligibility criteria, benefits, required documents, and a
   preliminary-assessment disclaimer

The BIS Assistant chat and Patent Guidance pages are reachable from the sidebar at any time and also call the
backend directly.

## REST API summary

| Method | Endpoint                     | Purpose |
|--------|-------------------------------|---------|
| POST   | `/api/assistant/query`        | BIS Standard Assistant chat |
| POST   | `/api/procurement/analyze`    | Upload a PDF (multipart), get mock extracted requirements |
| POST   | `/api/standards/match`        | Ranked mock standard matches for a set of requirements |
| GET    | `/api/standards/{id}`         | Mock standard detail lookup |
| POST   | `/api/explanation`            | Simulated AI explanation for a matched standard |
| POST   | `/api/explanation/followup`   | Simulated answer to a follow-up chat question |
| POST   | `/api/reports/generate`       | Builds the Compliance Report preview data |
| POST   | `/api/patent/guidance`        | Simulated preliminary patent guidance |
| GET    | `/api/profile`                | Current logged-in user's profile (401 if not logged in) |
| PUT    | `/api/profile`                | Update the logged-in user's profile (reflected app-wide immediately) |
| POST   | `/api/auth/register`          | Create a prototype account (name, email, password, ...) and log in |
| POST   | `/api/auth/login`              | Log in with email + password |
| POST   | `/api/auth/logout`             | Log out (clears the single in-memory session) |
| GET    | `/api/auth/status`             | Check session state on page load — `{ authenticated, profile }` |
| GET    | `/api/schemes`                | Full mock government schemes catalogue |
| GET    | `/api/schemes/{id}`           | A single scheme's full details |
| POST   | `/api/schemes/eligibility`    | Ranked schemes with basic eligibility results for a profile |

All endpoints accept/return JSON except `/api/procurement/analyze`, which accepts `multipart/form-data`.

## What's real vs. what's mocked

| Capability | In this prototype | Future (production) |
|---|---|---|
| Product → standard matching | Keyword-based mock lookup in `StandardMatchingService` | AI + verified BIS knowledge base + matching engine |
| PDF requirement extraction | Fixed demo JSON, file is accepted but not parsed | Real text/OCR extraction + AI understanding |
| BIS standard data | Hand-written demo entries in `MockStandardRepository` | Verified BIS knowledge base |
| AI explanation | Template sentences built from the request payload | AI-generated natural-language explanation |
| Compliance report | Structured JSON assembled by `ReportService`, no PDF file | Full PDF generation with verified references |
| Patent guidance | Fixed illustrative response | Real patent database / prior-art search API |
| Government schemes | 6 hand-written demo schemes in `MockSchemeRepository`, simple rule-based matching in `SchemeService` | Real government schemes API/database |
| User accounts & profile | Prototype login/registration with an in-memory account store (plaintext passwords, single server-side session, no tokens) — see `AuthService` | Production authentication (hashing, sessions/JWT, multi-device) and a real database |

No screen in this prototype claims a product **"is BIS certified"** or **"is legally compliant"**, and no screen
claims guaranteed scheme approval — government scheme results always show a preliminary-assessment disclaimer,
since final eligibility is decided by the concerned government authority.

## Notes

- CORS is open to `localhost` origins only (see `CorsConfig`), suitable for local development.
- Basic error handling is included on both sides: the frontend shows a dismissible error banner for backend-
  unavailable, empty-input, wrong-file-type, and failed-request cases; the backend returns clean JSON error
  bodies via a global exception handler instead of default error pages.
- The user profile is a single in-memory record (no authentication, no database) — good enough for a one-user
  demo. Editing it from the Profile page updates it everywhere else in the app immediately, no refresh needed.
- **User Profile and Government Schemes Finder require logging in** (`RequireAuth` on the frontend, a 401 from
  the backend if called without a session). Use the seeded demo account (`demo@example.com` / `demo1234`) or
  register a new one from the Login page. The session is a single in-memory value on the backend (no tokens,
  no password hashing) — intentionally minimal for a prototype; it resets whenever the backend restarts.
- This project intentionally has no production-grade authentication, database, or CI/CD — those are out of
  scope for an SIH prototype.
