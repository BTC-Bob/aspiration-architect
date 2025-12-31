# PROJECT MANIFEST: Aspiration Architect (v0.01)

## 1. THE VISION & PHILOSOPHY
We are building **Aspiration Architect**, a holistic life-management application that fuses **Gamified Achievement** with **Compassionate Strategy**.
* [cite_start]**The Core Hybrid:** It combines the rigid "Point Value" (PV) system of *Aspiration Architect* [cite: 146] [cite_start]with the empathetic "Guardian Angel" persona[cite: 368].
* [cite_start]**The "North Star":** The user is tracking towards a yearly cumulative goal (e.g., 4,400 PV)[cite: 9].
* [cite_start]**The 3 Pillars:** Balance is maintained across **LOVE** (Rose), **HEALTH** (Teal), and **FREEDOM** (Amber)[cite: 229].
* **The User:** A 63-year-old web designer who values **Dark Mode**, **Low Friction**, and **Privacy**.

## 2. THE TECH STACK (Strict Protocol)
* **Frontend:** React (Vite).
* **Styling:** Tailwind CSS (Utility-first).
    * **Theme:** Dark Mode Default (`class="dark"`).
    * **Font:** Inter / Sans-serif.
* **Backend:** Firebase (Firestore + Authentication).
* **Icons:** Lucide React.

## 3. VISUAL DESIGN SYSTEM
* **Background:** `#1A1A1A` (Deep Charcoal).
* **Surface:** `#252525` (Lighter Charcoal).
* **LOVE:** `#E88D8D` (Warm Rose).
* **HEALTH:** `#4ECDC4` (Soft Teal).
* **FREEDOM:** `#F7B731` (Amber/Gold).
* **Components:** Radial Gauges ("Breathing" animations), Overflow-protected Cards.

## 4. THE LOGIC ENGINE
### A. The Weighting Algorithm
Tasks are prioritized by a "Guardian Score":
* [cite_start]**Formula:** `Score = (Potency × 2) + (Urgency × 1.5) + (Neglect Factor × 3) + (Dependency Bonus)` [cite: 395-413].
* **Dependency:** If Task A unlocks Task B, Task A gets a priority boost.

### B. The "Notepad Loop" (Low Friction)
* **Input:** User types/speaks naturally into `notepad_raw` (e.g., "Ate walnuts, called Mom").
* **Processing:** The system parses this text against the **PV Library** to auto-log tasks and update the score.

## 5. DATA ARCHITECTURE (Firestore Schema)
1.  **`context` (User Profile):**
    * Active Goals (Status, Deadlines).
    * People (Relationships, Last Contact Date).
2.  **`library` (The Rulebook):**
    * *Critical Addition:* A static catalog of activities and their Point Values (e.g., "Sleep > 7 hours" = 5 PV). This enables the gamification.
3.  **`history` (Permanent Record):**
    * Daily Logs, Calculated Day Score, Notepad Entries, and "Guardian Reflections."

## 6. CODING STANDARDS (Non-Negotiable)
* **Indentation:** **HARD TABS (`\t`)** only.
* **Defensive UI:**
    * Cards/Modals must have `overflow-hidden`.
    * Text must use `truncate` or `whitespace-nowrap`.
    * **Mobile First:** No horizontal body scrolling.
* **Anti-Regression:** "The Ferrari Protocol" — Never break existing features.

## 7. INTERACTION PROTOCOL
1.  **Micro-Chunks:** Split files >50 lines.
2.  **The Wait:** STOP after every part. Wait for "Next".
3.  **The Build:** Session stays open until `npm run build` passes.

## 8. CURRENT PHASE: v0.01 (Initialization)
* **Goal:** Initialize Environment.
* **Tasks:**
    1.  Setup Vite/React + Tailwind.
    2.  Configure `tailwind.config.js` with Guardian Colors.
    3.  Create the `App.jsx` skeleton with the Radial Gauge Dashboard.

**I am ready. Please acknowledge this manifest and await my first instruction.**
