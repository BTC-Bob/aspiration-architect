# Constants & Standards
## AspirationArchitect v0.3 Data Reference

### Context
> **App:** AspirationArchitect — A personal life management app built around 
> three pillars: Love, Health, and Freedom (in that order).
>
> **This Document:** Central reference for all constant values, color codes, 
> PV tiers, date formats, and global standards used throughout the app.

---

## Global Standards

### Date Format

| Standard | Value |
|----------|-------|
| Format | MM-DD-YYYY |
| Example | 01-11-2026 |
| Enforcement | Strictly enforced everywhere |

**Usage:**
- Firestore document IDs for dailyLogs
- All date displays in UI
- All date inputs
- Journal timestamps

---

### Pillar Order

**Always referenced as:** Love, Health, Freedom (L/H/F)

This order is strictly enforced in:
- Dropdown menus
- Gauge displays
- Distribution displays
- Category groupings
- Color references

---

## Pillar Colors

### Primary Colors

| Pillar | Name | Tailwind Class | Hex Code | RGB |
|--------|------|----------------|----------|-----|
| Love | Red-500 | `text-red-500` / `bg-red-500` | #ef4444 | 239, 68, 68 |
| Health | Cyan-500 | `text-cyan-500` / `bg-cyan-500` | #06b6d4 | 6, 182, 212 |
| Freedom | Amber-500 | `text-amber-500` / `bg-amber-500` | #f59e0b | 245, 158, 11 |

### Secondary/Muted Colors (for backgrounds, borders)

| Pillar | Light | Hex | Dark | Hex |
|--------|-------|-----|------|-----|
| Love | Red-100 | #fee2e2 | Red-900 | #7f1d1d |
| Health | Cyan-100 | #cffafe | Cyan-900 | #164e63 |
| Freedom | Amber-100 | #fef3c7 | Amber-900 | #78350f |

### Neutral Colors

| Usage | Tailwind Class | Hex Code |
|-------|----------------|----------|
| Unbuilt day (Blueprint) | Gray-700 | #374151 |
| Faded/Poor day | 50% opacity of primary | — |
| Background | Gray-50 | #f9fafb |
| Card background | White | #ffffff |
| Text primary | Gray-900 | #111827 |
| Text secondary | Gray-500 | #6b7280 |

---

## PV (Point Value) System

### Value Tiers

| Tier | PV per 30 min | Use Case |
|------|---------------|----------|
| Maintenance | 2 | Minor tasks, grooming, small errands |
| Standard | 5 | Typical habits, daily tasks |
| High Impact | 10 | Deep work, intense exercise, major actions |

### PV Calculation Formula

```
Total PV = (Value Tier Rate) × (Duration ÷ 30 min)
```

**Examples:**

| Task | Value Tier | Duration | Calculation | Total PV |
|------|------------|----------|-------------|----------|
| Shaving | Maintenance (2) | 15 min | 2 × (15÷30) | 1 PV |
| Email review | Standard (5) | 30 min | 5 × (30÷30) | 5 PV |
| Deep work | High Impact (10) | 2 hr | 10 × (120÷30) | 40 PV |
| Gym workout | High Impact (10) | 1 hr | 10 × (60÷30) | 20 PV |

### Negative PV Range

| Category | PV Range |
|----------|----------|
| Minor negative | -1 to -3 |
| Moderate negative | -3 to -5 |
| Major negative | -5 to -10 |

---

## Daily PV Targets

| Tier | PV Range | Meaning | Color Indicator |
|------|----------|---------|-----------------|
| Poor | 0–30 | Minimal intentional action | Red/Warning |
| Below Average | 31–50 | Some progress, missed key commitments | Orange |
| Average | 51–75 | Solid day, partial completion | Yellow |
| Good | 76–100 | Strong day, Core 3 + Protocols complete | Green |
| Exceptional | 101+ | Everything done plus extra impact | Blue/Gold |

### Default Daily Target

| Setting | Value |
|---------|-------|
| Default | 75 PV |
| Tier | Good day threshold |

---

## Annual PV Targets

| Tier | PV Range | Daily Average | Meaning |
|------|----------|---------------|---------|
| Poor | 0–15,000 | ~41/day | Significant struggle |
| Below Average | 15,001–22,000 | ~60/day | Inconsistent effort |
| Average | 22,001–28,000 | ~77/day | Steady, showed up most days |
| Good | 28,001–34,000 | ~93/day | Strong consistency + milestones |
| Exceptional | 34,001+ | ~93+/day | Transformational year |

### Default Annual Target

| Setting | Value |
|---------|-------|
| Default | 28,000 PV |
| Tier | Good year threshold |

---

## Streak Bonuses

| Streak Length | Bonus PV | Milestone Name |
|---------------|----------|----------------|
| 7 days | +5 PV | Weekly Warrior |
| 14 days | +10 PV | Fortnight Focus |
| 30 days | +25 PV | Monthly Master |
| 60 days | +50 PV | Consistency Champion |
| 90 days | +100 PV | Quarterly Quest |

**Rules:**
- Bonuses are one-time per streak
- Breaking and restarting allows re-earning bonuses
- No penalty for broken streaks

---

## Milestone PV Range

| Type | PV Range |
|------|----------|
| Minimum | 100 PV |
| Typical | 300–500 PV |
| Maximum | 1,000 PV |

### Milestone PV Distribution

| Component | Percentage |
|-----------|------------|
| Sub-goals (divided evenly) | 60% |
| Completion bonus | 40% |

---

## Protocol Completion Bonus

| Setting | Default Value |
|---------|---------------|
| Completion Bonus | +5 PV |
| Configurable | Yes (per Protocol) |

---

## Duration Presets

Standard duration buttons used throughout the app:

```
[ 15m ] [ 30m ] [ 45m ] [ 1h ] [ 1.5h ] [ 2h ] [ 2h+ ]
```

| Button | Minutes |
|--------|---------|
| 15m | 15 |
| 30m | 30 |
| 45m | 45 |
| 1h | 60 |
| 1.5h | 90 |
| 2h | 120 |
| 2h+ | Custom input |

---

## Time-Based Greetings

| Time Range | Greeting |
|------------|----------|
| 5:00 AM – 11:59 AM | "Good morning, {designation}" |
| 12:00 PM – 4:59 PM | "Good afternoon, {designation}" |
| 5:00 PM – 9:59 PM | "Good evening, {designation}" |
| 10:00 PM – 4:59 AM | "Burning late, {designation}" |

---

## Dashboard Timeline

| Setting | Value |
|---------|-------|
| Start time | 6:00 AM |
| End time | 10:00 PM |
| Display format | 12-hour with AM/PM |

---

## Protocol Time of Day

| Value | Display Window |
|-------|----------------|
| morning | 6 AM – 12 PM (auto-expand) |
| afternoon | 12 PM – 6 PM |
| evening | 6 PM – 10 PM (auto-expand) |

---

## Schedule Types

### Tier 1 (One-Tap)

| Type | Days Array |
|------|------------|
| daily | [0, 1, 2, 3, 4, 5, 6] |
| weekdays | [1, 2, 3, 4, 5] |
| weekends | [0, 6] |
| custom | User-selected |

**Day Index Mapping:**
| Index | Day |
|-------|-----|
| 0 | Sunday |
| 1 | Monday |
| 2 | Tuesday |
| 3 | Wednesday |
| 4 | Thursday |
| 5 | Friday |
| 6 | Saturday |

### Tier 2 (Advanced)

| Type | Description |
|------|-------------|
| interval | Every X days |
| specific-dates | Specific days of month (e.g., 1st, 15th) |

---

## Privacy PIN

| Setting | Value |
|---------|-------|
| Format | 4-digit numeric |
| Recovery | Security question |
| Scope | Per-entry (not whole app) |
| Timeout | Auto-lock after 5 minutes or navigation |

---

## Core Task Count

| Setting | Default | Range |
|---------|---------|-------|
| Default Core Tasks | 3 | 1–5 |
| Adjustable per day | Yes | |

---

## Blueprint Visualization

### Grid Dimensions

| Dimension | Value |
|-----------|-------|
| Columns | 52 weeks + 1 day |
| Rows | 7 days (Sun–Sat) |
| Total blocks | 365 (366 leap year) |

### Block States

| State | Visual | Condition |
|-------|--------|-----------|
| Love dominant | #ef4444 solid | Love PV > Health and Freedom |
| Health dominant | #06b6d4 solid | Health PV > Love and Freedom |
| Freedom dominant | #f59e0b solid | Freedom PV > Love and Health |
| Balanced | White/gradient | All pillars within 10% |
| Poor day | 50% opacity | 0–30 PV |
| Unbuilt | #374151 | Future or no data |

### Special Markers

| Marker | Meaning |
|--------|---------|
| ⭐ | Memorable Moment |
| 🏆 | Milestone achieved |
| Glowing border | Current day |

---

## App Version

| Setting | Value |
|---------|-------|
| Current Version | v0.3.0 |
| Stage | Alpha |
| Display | "v0.3.0 • Alpha" |

---

## Firebase Configuration

| Setting | Value |
|---------|-------|
| Project ID | aspiration-architect-b90be |
| Auth Provider | Google Account |
| Database | Cloud Firestore |

---

## Code Standards

| Standard | Value |
|----------|-------|
| Indentation | Tabs (not spaces) |
| Framework | React 18 |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Routing | React Router DOM v6 |

---

## Prolonged Skip Awareness

| Setting | Value |
|---------|-------|
| Trigger threshold | 7+ consecutive days |
| Display | Gentle prompt in Morning Greeting |
| Penalty | None (awareness only) |

---

## Category Dropdown Grouping Order

1. **Love-Primary** (60% Love)
2. **Health-Primary** (60% Health)
3. **Freedom-Primary** (60% Freedom)
4. **Balanced** (no dominant pillar)
5. **Negative** (negative PV categories)

---

*Document Version: 0.3.0*
*Last Updated: 01-11-2026*
