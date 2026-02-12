# TMC Filesystem Integration — Setup Notes

**Created:** 01-26-2026
**Status:** Pending Setup
**Priority:** Optional (Wednesday 01-28-2026 or later)

---

## Goal

Enable the Coach to read and write TMC markdown files directly — no manual uploads needed at kickoff.

---

## Current State

- Coach has Google Calendar access ✓
- Coach creates markdown files that Rob downloads and saves manually
- Filesystem MCP currently only allows: `C:\Users\mrxbi\AlexWorkspace\projects\00-CNA-Packet-Master-Business-Plan\site-hub-v3`

---

## Information Needed

**Question 1:** Where is your TMC folder located?
- Full path (e.g., `C:\Users\mrxbi\Documents\TMC` or similar)
- This folder should contain:
  ```
  /TMC/
  ├── COACH-INSTRUCTIONS.md
  ├── /daily/
  │   └── daily-MM-DD-YYYY.md
  ├── /goals/
  │   └── goals-MM-DD-YYYY.md
  ├── /templates/
  │   ├── daily-template.md
  │   └── goals-template.md
  └── /reference/
      └── (planning documents, etc.)
  ```

**Question 2:** Which integration method do you prefer?
- **Option A:** Filesystem MCP config update (simplest — just add the path)
- **Option B:** VS Code + Claude Code CLI (familiar workflow from client projects)
- **Option C:** Hybrid (use both depending on context)

---

## Option A: Filesystem MCP Setup

If you choose this route, we need to:

1. Locate your Claude Desktop or MCP config file (usually `claude_desktop_config.json` or similar)
2. Add your TMC folder path to the `allowedDirectories` array
3. Restart Claude Desktop

**Example config snippet:**
```json
{
  "filesystem": {
    "allowedDirectories": [
      "C:\\Users\\mrxbi\\AlexWorkspace\\projects\\00-CNA-Packet-Master-Business-Plan\\site-hub-v3",
      "C:\\Users\\mrxbi\\PATH\\TO\\TMC"
    ]
  }
}
```

---

## Option B: VS Code + Claude Code CLI

If you prefer this route:

1. Initialize a Git repo in your TMC folder (if not already)
2. Use the same split-screen workflow you use for clients:
   - Claude Project (this conversation) for strategy/coaching
   - Claude Code CLI for file creation/editing
3. Benefit: Full version control history of all daily logs and goals

---

## Benefits Once Set Up

| Before | After |
|--------|-------|
| Upload 2 files at kickoff | Coach reads files directly |
| Download files and save manually | Coach writes directly to folders |
| No version history | Git history of all changes (Option B) |
| Risk of forgetting uploads | Seamless kickoff routine |

---

## Ideal Kickoff Flow (Post-Setup)

1. Rob says "Good morning"
2. Coach automatically:
   - Checks Google Calendar (today + tomorrow)
   - Reads latest `goals-MM-DD-YYYY.md` from `/goals/`
   - Reads yesterday's `daily-MM-DD-YYYY.md` from `/daily/`
   - Creates today's daily file from template
3. Foundation Inspection begins
4. Task list built and saved directly to `/daily/daily-[TODAY].md`
5. End of session: Goals file updated with new date stamp if changed

---

## Next Steps

1. **Rob:** Provide TMC folder path
2. **Rob:** Decide Option A vs B vs C
3. **Together:** Walk through setup (15-30 min on a construction day)
4. **Test:** Run a kickoff with direct file access

---

## Notes

- This is infrastructure investment — setup once, benefit daily
- Not urgent for days off (Mon/Tue) — better for a construction day
- Can always fall back to manual upload if issues arise

---

*Hand this file back to the Coach at the start of the setup session.*
