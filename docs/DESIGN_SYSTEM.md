# ASPIRATION ARCHITECT - DESIGN CONSTITUTION
> **Version:** 1.1
> **Last Updated:** 12-30-2025
> **Status:** SUPREME AUTHORITY (Overrides all other documents)

## 1. COLOR PALETTE (DO NOT CHANGE)
- **Background Deep:** `#0B1120` (Main App Background)
- **Standard Card:** `#0f1522` (General Widgets)
- **PV High-Contrast Card:** `#1A2435` (Daily PV Gauge Background)
- **Borders:** `border-slate-800`

## 2. THE THREE PILLARS (Gradients)
- **LOVE & FAMILY:**
  - Color: `#ef4444` (Red-500)
  - Gradient: `from-[#1e1b2e] to-[#0f172a]`
- **HEALTH & BODY:**
  - Color: `#06b6d4` (Cyan-500)
  - Gradient: `from-[#0f2231] to-[#0f172a]`
- **FREEDOM & FINANCE:**
  - Color: `#f59e0b` (Amber-500)
  - Gradient: `from-[#1f1e1b] to-[#0f172a]`

## 3. UI GEOMETRY RULES
### The Arc Gauge
- **Type:** SVG Path (Rainbow Arch). DO NOT use CSS rotation circles.
- **Shape:** Perfect top-half semi-circle.
- **Track:** Stroke width 12, Slate-800.
- **Value:** Centered text, size 4xl, White.

### The Dashboard Header
- **Layout:** 3-Column Split (Status | Greeting | PV).
- **Greeting:** Absolutely centered on desktop view.
- **PV Widget:** Right-aligned, utilizing `#1A2435` background.

## 4. STATUS INDICATORS (HEADER LEFT)
- **Dual Badge System:** The header must always display two badges stacked or aligned:
  1. **Identity Badge:** "Guardian Protocol Active" (Blue/Shield).
  2. **Sync Badge:** "Live Sync" (Green/Activity) when connected, or "Offline" (Red) when token expires.
- **Shape:** Full rounded pill shape (`rounded-full`).
