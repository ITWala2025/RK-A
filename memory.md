# memory.md — Project Decision & Progress Log

Running log for this repo. Newest entries at the top. AI agents: read this before starting work, and append an entry after finishing meaningful work.

---

## 2026-09-28 — Phase 1 implementation kicked off

**Context:** PRD.md finalized (v1.0 draft). User requested: create `Agents.md`, `Design.md`, `memory.md`, `test.md`, and implement **Phase 1** from the PRD roadmap, explicitly deferring Supabase wiring to a later pass.

**Decisions made:**
- Single Next.js 15 (App Router, TypeScript, Tailwind) app in `web/`, using route groups `(site)`, `(admin)`, `(portal)` instead of PRD §5.2's three separate apps — chosen to reduce Phase 1 tooling overhead while staying structurally separable later. See [Design.md](Design.md) §2.
- All data access goes through a repository interface in `src/lib/data/` with in-memory implementations now, so Supabase can be dropped in later without touching UI code. See [Design.md](Design.md) §5.
- No real authentication in Phase 1 — a dev-only role switcher stands in for RBAC so screens can be reviewed per persona. Must not be mistaken for a security boundary.
- Monetary values stored as integer cents; VAT computed per PRD Irish rules (23/13.5/9/0/Exempt/Reverse Charge).
- Phase 1 build excludes: e-signature, payment gateway, ITSM SLA engine, CSAT, knowledge base, compliance rules engine automation (compliance dashboard shows static sample data only). These are Phase 2+ per PRD §6.

**Open questions (from PRD §7.3, still unanswered by stakeholders):**
1. Payment gateway / e-signature vendor preference — not yet chosen, so both are stubbed only.
2. Simplified onboarding for individual (non-company) clients — Phase 1 models `entityType: individual` with CRO/VAT fields optional, but no dedicated simplified flow built yet.
3. DPO designation/contact for Privacy Policy — placeholder text used on the Privacy Policy page pending firm confirmation.
4. Accounting-software integration priority (Xero/QuickBooks/Big Red Cloud/Surf) — not started (Phase 4 scope).
5. External Auditor access model (per-engagement vs firm-wide) — not built in Phase 1 (no ITSM/audit center yet).

**Status:** See task-by-task status below; update as work progresses.

### Phase 1 build checklist status
- [x] `web/` Next.js app scaffolded (Next.js 16 canary/Turbopack, App Router, TypeScript, Tailwind)
- [x] Public website: Home, About, Services (+ deep-dive), Contact (lead capture → API route → repository), Privacy, Terms
- [x] Admin Portal: dashboard, Leads (list + status select), Customer 360 (list + detail), Quotes (list/new/detail with Send/Accept/Convert-to-Invoice), Invoices (list/new/detail, VAT-compliant, payment recording)
- [x] Client Portal: dashboard (deadlines/invoices/documents summary cards, sample + live data), Documents (list + mock upload with simulated scan), Invoices (list/detail + mock "Pay Now")
- [x] Repository/mock-data layer for leads, customers, quotes, invoices, documents, compliance, staff (`web/src/lib/data/*`)
- [x] Dev-only role switcher (Admin) / customer switcher (Client Portal) — `web/src/lib/auth/session.tsx`
- [x] `npm run build` and `npm run lint` passing in `web/`
- [x] Manual smoke test: all public/admin/portal routes return 200, POST `/api/leads` creates a lead, dynamic `[id]` detail pages resolve seed data correctly

### Implementation notes
- Used Next.js Server Actions (`"use server"` functions in `actions.ts` files under each admin module) for Lead status updates, Quote lifecycle transitions, and Invoice status/payment recording — avoids hand-rolled API routes for Phase 1 admin mutations.
- Client Portal pages are client components that call the repository layer directly in `useEffect`/event handlers (rather than server components), since the "logged-in customer" is only known client-side via the dev-only session switcher, not a real session/cookie yet. This is a deliberate Phase 1 simplification — when Supabase Auth lands, portal pages should move to server components reading the session from cookies.
- `web/next.config.ts` sets `turbopack.root` to the `web/` directory since the repo root (one level up) intentionally has no lockfile.
- Fixed eslint-plugin-react-hooks "purity"/"set-state-in-effect" rules (bundled with this Next.js version) by: (1) isolating `Date.now()` calls behind a plain helper (`isoDateDaysFromNow` in `lib/format.ts`) instead of calling it inline in component bodies, and (2) inlining data-fetching directly inside `useEffect` (with a cancellation flag) rather than calling a named async helper from the effect.

**Next steps (not started):** Supabase schema + `*.supabase.ts` repository implementations, real auth/RBAC, ITSM Service Desk module, e-signature/payment gateway integrations, compliance rules engine automation — all Phase 2+ per PRD §6.

