# PROJECT MANIFEST: Aspiration Architect (v0.02)

## 1. THE VISION & PHILOSOPHY
We are building **Aspiration Architect**, a holistic life-management application that fuses **Gamified Achievement** with **Compassionate Strategy**.
* **The Core Hybrid:** It combines the rigid "Point Value" (PV) system of *Aspiration Architect* with the empathetic "Guardian Angel" persona.
* **The "North Star":** The user is tracking towards a yearly cumulative goal (e.g., 4,400 PV).
* **The 3 Pillars:** Balance is maintained across **LOVE** (Rose), **HEALTH** (Teal), and **FREEDOM** (Amber).
* **The User:** A 63-year-old web designer who values **Dark Mode**, **Low Friction**, and **Privacy**.

## 2. THE TECH STACK (Strict Protocol)
* **Frontend:** React 18 (Vite Build Tool).
* **Styling:** Tailwind CSS (Utility-first).
    * **Theme:** Deep Space (`#0B1120` base).
    * **Font:** Inter / Sans-serif.
* **Backend:** Firebase (Firestore + Authentication).
* **Deployment:** GitHub Actions (FTP Robot).
    * *Note:* We DO NOT use standard Hostinger Git Webhooks. We use `.github/workflows/deploy.yml` to build and ship `dist/`.

## 3. VISUAL DESIGN SYSTEM
* **Background:** `#0B1120` (Deep Space).
* **Surface:** `#0f1522` (Card Surface).
* **LOVE:** `#ef4444` (Red-500).
* **HEALTH:** `#06b6d4` (Cyan-500).
* **FREEDOM:** `#f59e0b` (Amber-500).
* **Components:** Arc Gauges (SVG Path), Smart Badges (Status/Sync).

## 4. THE LOGIC ENGINE (Phase v0.02 Focus)
### A. The Weighting Algorithm
Tasks are prioritized by a "Guardian Score":
* **Formula:** `Score = (Potency × 2) + (Urgency × 1.5) + (Neglect Factor × 3) + (Dependency Bonus)`.
* **Dependency:** If Task A unlocks Task B, Task A gets a priority boost.

### B. The "Notepad Loop" (Low Friction)
* **Input:** User types/speaks naturally into `notepad_raw`.
* **Processing:** The system parses this text against the **PV Library** to auto-log tasks and update the score.

## 5. DATA ARCHITECTURE (Firestore Schema)
1.  **`context` (User Profile):** Active Goals, People, Settings.
2.  **`library` (The Rulebook):** Catalog of activities and Point Values.
3.  **`history` (Permanent Record):** Daily Logs, Calculated Scores, Notepad Entries.

## 6. CODING STANDARDS (Non-Negotiable)
* **Indentation:** **HARD TABS (`\t`)** only.
* **Routing:** Must rely on `public/.htaccess` for Apache servers.
* **Defensive UI:**
    * Cards/Modals must have `overflow-hidden`.
    * **Mobile First:** No horizontal body scrolling.
    * **Versioning:** Use `src/constants.js` as the source of truth.

## 7. CURRENT PHASE: v0.02 (The Logic Expansion)
* **Status:** Live Environment Active (`v0.1.0`).
* **Goal:** Implement the "PV Scoring Engine" and "Daily Totals".
* **Immediate Tasks:**
    1.  Connect Dashboard Gauges to real Firestore data.
    2.  Build the "Notepad Loop" parser.
    3.  Implement the "Weekly Pulse" with live data.

**I am ready. Please acknowledge this manifest and await my first instruction.**
