# W4C Directory — Session Report

**Date:** Friday, January 31, 2026
**Session Time:** Afternoon (~2 hours)
**Project:** Websites4Contractors.com (W4C Directory)
**Platform:** Brilliant Directories

---

## Session Goal

Set up payment gateway for the W4C Directory so the site can accept membership payments before launch.

---

## Key Decision Made

**Switched from Square to Stripe.** Research confirmed that Square is not a supported payment gateway in Brilliant Directories. Stripe is BD's #1 recommended gateway — no monthly fees, on-site checkout, native recurring billing support, and the most stable integration across thousands of BD sites.

---

## Completed This Session

1. **Stripe account reclaimed and rebranded** — Rob had an existing unused Stripe account on his primary email. Updated business name to Websites4Contractors, set website URL, and rewrote the product description to reflect the directory/membership model (previously referenced an old handyman website business).

2. **Public-facing payment details configured** — Set statement descriptor (WEBSITES4CONTRACTORS) and shortened descriptor (W4CONTRACT) so customers recognize charges on their bank statements. Updated customer support email from personal Gmail to support@websites4contractors.com.

3. **Identity verification submitted** — Personal information (name, DOB, SSN, address, phone) submitted to Stripe. Photo ID still pending — laptop camera was unavailable, Rob will complete via phone.

4. **Master checklist created** — Built a comprehensive living document tracking all tasks, issues, and progress across the entire W4C project (BD setup, Stripe, domain, content, client migration, outreach). Includes an observed issues/bugs log with 10 tracked items.

5. **Project folder organized** — Migrated all W4C documents from a nested subfolder inside the Aspiration Architect project to a dedicated `W4C-Websites4Contractors/` project folder with proper structure (docs, data, outreach, assets). Created a README with project overview and quick reference.

---

## Blocked / Pending

| Item | Blocker | Impact |
|------|---------|--------|
| Stripe photo ID verification | Need phone camera — will complete on mobile | Payments & payouts paused until verified |
| 3 URLs in Stripe Public Details | Ran out of time — quick fix next session | Old handymanjobleads.com URL still referenced |

---

## What's Next (Priority Order)

1. Complete photo ID verification on phone (5 min)
2. Fix 3 remaining URLs in Stripe Public Details and save (2 min)
3. Configure Stripe Branding (logo, colors)
4. Verify bank account / payout settings
5. Enable customer email receipts
6. Connect Stripe to Brilliant Directories using test API keys
7. Run test transaction on front-end of site
8. Switch to live API keys

---

## Overall W4C Project Status

| Area | Status | Completion |
|------|--------|------------|
| BD Core Setup (plans, categories) | ✅ Done | ~70% |
| Payment Gateway (Stripe) | 🔄 In Progress | ~60% |
| Domain Connection | ⬜ Not Started | 0% |
| Google Maps API | ⬜ Not Started | 0% |
| Site Pages (About, Pricing, FAQ, Legal) | ⬜ Not Started | 0% |
| Client Migration (10 clients) | ⬜ Not Started | 0% |
| Founding Member Outreach | ⬜ Not Started | 0% |

**Estimated remaining work to launch:** 8-12 hours across multiple sessions.

---

## Files Updated/Created

| File | Location | Action |
|------|----------|--------|
| `w4c-master-checklist-01-31-2026.md` | `docs/planning/` | Created |
| `w4c-stripe-setup-progress-01-31-2026.md` | `docs/progress-reports/` | Created |
| `README.md` | Project root | Created |
| All existing W4C files | `W4C-Websites4Contractors/` | Migrated from old location |

---

*Report generated for TMC Project sync.*
