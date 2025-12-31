# PROJECT CONTEXT: Aspiration Architect (v0.1.0)

## 1. CORE ENVIRONMENT
- **IDE:** VS Code (Primary Tool for ALL File Operations).
- **Terminal:** CMD (Primary) / PowerShell (Used for `npm` commands, builds, and deployment).
- **Stack:** React (Vite) + Firebase (Firestore/Auth) + Tailwind CSS + Lucide React.
- **Workflow:** Local Development (localhost:5173) -> Build -> Hosting (Hostinger/Firebase).

## 2. CODING STANDARDS (STRICT)
- **Indentation:** **HARD TABS REQUIRED (`\t`).**
    - **Rule:** Do NOT use spaces for indentation.
    - **Override:** The AI must actively suppress its training bias for space-indentation.
- **Comments:** VERBOSE. Explain "Why", not just "What".
- **Architecture:** Modern React (Hooks), clean separation of concerns (Components vs. Logic).
- **Date Format:** ALWAYS use `MM-DD-YYYY` for display.
- **Mobile Integrity:** If it breaks on mobile, it is broken period.
- **Visual Palette:**
    - Background: `#1A1A1A` (Deep Charcoal)
    - Surface: `#252525` (Lighter Charcoal)
    - Love: `#E88D8D` (Warm Rose)
    - Health: `#4ECDC4` (Soft Teal)
    - Freedom: `#F7B731` (Amber/Gold)

## 3. THE "GUARDIAN" PROTOCOL (ANTI-REGRESSION)
- **Preservation First:** NEVER strip existing functionality to fix a bug.
- **No "Go-Karts":** Do not provide stripped-down "logic only" snippets. Always provide the full context.
- **Atomic Updates:** Features must be complete (UI + Logic + Data) before integration.
- **Build Safety:** The session is not closed until `npm run build` passes.

## 4. CURRENT ARCHITECTURE & FEATURES (Planned v0.1.0)
- **Guardian Dashboard:**
    - Visual Radial Gauges for the 3 Pillars (Love, Health, Freedom).
    - Intelligent Morning Greeting.
- **Task Engine:**
    - Weighted Priority Logic (Potency + Urgency + Neglect Factor).
    - Cross-Category Impact indicators.
- **Notepad Loop:**
    - Freeform text entry (`notepad_raw`).
    - Low-friction "Dump" interface.
- **Permanent Record (Firestore):**
    - `history` collection: Daily logs, snapshots of 3-pillar balance.
    - `context` document: Static user profile, goals, and important dates.

## 5. FILE WRITING PROTOCOL (The "Interactive Handshake" System)
**Context:** To strictly prevent browser timeouts and buffer overflows, we use a **Turn-Based Delivery System** for any file exceeding 50 lines.

**The "One Turn, One Chunk" Rule:**
1.  **Strict Trigger:** If a file is > 50 lines or contains complex React logic, the AI **MUST** split it.
2.  **The Procedure:**
    * **Turn 1:** AI generates **[Part 1 of X]**.
    * **HARD STOP:** The AI **MUST** end its response immediately after the code block.
    * **Status Check:** The AI concludes with: *"Part 1 complete. Waiting for user to type 'Next'..."*
    * **User Action:** User reviews/copies Part 1 and types **"Next"**.
    * **Turn 2:** AI generates **[Part 2 of X]**.
    * *(Repeat until complete)*.
3.  **Prohibited Actions:**
    * The AI must **NEVER** output multiple parts (e.g., Part 1 AND Part 2) in a single response message.
    * The AI must **NEVER** assume the user is ready; it must wait for the explicit "Next" trigger.
4.  **Assembly Instructions (VS Code):**
    * User opens the target file.
    * User pastes chunks sequentially (append mode).
    * User saves and runs `npm run build` ONLY after the final chunk is received and pasted.

**Constraint:** NEVER generate PowerShell `[System.IO.File]::WriteAllText` scripts for files larger than 50 lines. Always default to the Manual Editor Protocol.
