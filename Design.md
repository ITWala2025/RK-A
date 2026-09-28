# Design.md — Technical Design

Companion to [PRD.md](PRD.md). Describes how Phase 1 (per PRD §6 roadmap) is actually built, with Supabase deliberately deferred (per user instruction) but designed for as a near-term swap-in.

## 1. Scope of this document

- Confirms the technical stack choice for Phase 1 implementation (a pragmatic subset of PRD §5).
- Defines the repository/folder structure.
- Defines the data model (TypeScript types) for Phase 1 entities.
- Defines the data-access abstraction that isolates mock data now and Supabase later.
- Defines routing map across the three modules.
- Defines the auth/RBAC stub used until real Supabase Auth is added.

## 2. Stack decision for Phase 1

PRD §5.2 recommends separate Next.js (public site) and React/Vite SPAs (admin/client portals). For Phase 1, to minimize duplicated tooling while still meeting the PRD's SEO/LCP requirement for the public site, we use **one Next.js 15 (App Router, TypeScript) application** (`web/`) serving all three modules as route groups:

- `(site)` — public marketing site, server components, SSG/ISR where possible.
- `(admin)` — Admin Portal, mostly client components behind the mock-auth guard.
- `(portal)` — Client Portal, mostly client components behind the mock-auth guard.

Rationale: single deployable for Phase 1, still cleanly separable later (each route group could be extracted into its own app if the practice needs true SPA independence). Tailwind CSS for styling. No backend framework yet — Next.js Route Handlers (`src/app/api/*`) stand in for the "serverless/edge function" lead-capture endpoint described in PRD §2.1.7, backed by the mock repository layer.

**Deferred to a later phase (explicitly out of scope for this pass):**
- Supabase project, schema, Postgres RLS policies, Supabase Auth.
- Real payment gateway, e-signature, malware scanning, email/SMS provider integrations.
- ITSM SLA-clock engine, CSAT surveys, knowledge base (PRD Phase 2 scope).
- Compliance Calendar rules engine automation (PRD §2.2.2F) — Phase 1 shows static/sample deadline data on dashboards only.

## 3. Folder structure

```
web/
  src/
    app/
      (site)/
        page.tsx                 Home
        about/page.tsx
        services/page.tsx        Services index
        services/[slug]/page.tsx Service deep-dive
        contact/page.tsx
        privacy/page.tsx
        terms/page.tsx
        layout.tsx               Public site chrome (header/footer/nav)
      (admin)/
        admin/layout.tsx         Admin shell (sidebar, role guard)
        admin/page.tsx           Admin dashboard / KPIs
        admin/leads/page.tsx     Lead list + kanban-style status board
        admin/leads/[id]/page.tsx
        admin/customers/page.tsx           Customer list
        admin/customers/[id]/page.tsx      Customer 360 view
        admin/quotes/page.tsx
        admin/quotes/[id]/page.tsx
        admin/quotes/new/page.tsx
        admin/invoices/page.tsx
        admin/invoices/[id]/page.tsx
        admin/invoices/new/page.tsx
      (portal)/
        portal/layout.tsx        Client portal shell (role guard)
        portal/page.tsx          Client dashboard
        portal/documents/page.tsx
        portal/invoices/page.tsx
        portal/invoices/[id]/page.tsx
      api/
        leads/route.ts           POST — public lead capture (used by Contact form)
    components/
      ui/                        Buttons, Card, Badge, Table, StatCard, etc.
      site/                      Public site sections (Hero, ServiceTile, TestimonialCard)
      admin/                     Admin-specific components (LeadKanban, CustomerTimeline)
      portal/                    Client-portal-specific components
    lib/
      domain/                    Plain TypeScript types/interfaces (no framework deps)
      data/                      Repository interfaces + in-memory implementations + seed data
      auth/                      Mock session/role context
      vat.ts                     Irish VAT calculation helpers
      format.ts                  Currency/date formatting helpers
```

## 4. Data model (Phase 1 subset)

Defined in `src/lib/domain/`. Only the fields needed to demonstrate Phase 1 flows are modeled; extra PRD fields are noted as comments for future phases rather than omitted silently.

- `Lead`: id, name, companyName, email, phone, serviceInterest[], source, utmCampaign?, consentMarketing, status (`new|contacted|qualified|proposal_sent|won|lost`), assignedOwnerId, createdAt.
- `Customer` (Client/Entity Profile): id, clientCode, legalEntityName, tradingName?, entityType (`ltd|dac|sole_trader|partnership|llp|individual`), croNumber?, taxRefNumber?, vatNumber?, employerPayeNumber?, rboStatus?, relationshipManagerId, riskRating (`low|medium|high`), status (`active|dormant|ceased`), createdAt.
- `Contact`: id, customerId, name, role, email, phone.
- `Quote`: id, quoteNumber, customerId, leadId?, lineItems[], status (`draft|sent|accepted|rejected|expired|converted`), validUntil, createdAt, convertedInvoiceId?.
- `QuoteLineItem`: description, quantity, unitPrice, vatRate (`23|13.5|9|0|exempt|reverse_charge`).
- `Invoice`: id, invoiceNumber, customerId, quoteReference?, lineItems[], status (`draft|sent|paid|overdue|cancelled`), paymentStatus (`pending|partial|paid`), issueDate, dueDate, currency (`EUR` default), createdAt.
- `Payment`: id, invoiceId, date, amount, method, reference.
- `DocumentItem` (mock): id, customerId, fileName, category, taxYear, uploadedAt, status (`pending_scan|clean|quarantined`).
- `ComplianceItem` (dashboard sample data only): id, customerId, obligationType (`VAT3|CT1|Form11|B1|RBO`), dueDate, status (`upcoming|due_soon|overdue|filed|at_risk_missing_document`).

All monetary values are stored as integer **cents** (`amountCents`) to avoid floating point errors; `src/lib/format.ts` converts to display strings.

## 5. Repository pattern (Supabase-ready)

```ts
// src/lib/data/leads.repository.ts
export interface LeadsRepository {
  list(): Promise<Lead[]>;
  getById(id: string): Promise<Lead | null>;
  create(input: NewLeadInput): Promise<Lead>;
  updateStatus(id: string, status: LeadStatus): Promise<Lead>;
}

export const leadsRepository: LeadsRepository = createInMemoryLeadsRepository(seedLeads);
```

Each domain area (`leads`, `customers`, `quotes`, `invoices`, `documents`, `compliance`) gets one repository interface + one in-memory implementation in Phase 1. Route handlers and Server/Client Components depend only on the exported repository instance, never on the in-memory arrays directly. When Supabase is added later:

1. Add `*.supabase.ts` implementing the same interface using `@supabase/supabase-js`.
2. Swap the exported instance behind an env flag (`DATA_BACKEND=memory|supabase`).
3. No calling code should need to change.

## 6. Auth/RBAC stub (Phase 1 only)

No real authentication yet. `src/lib/auth/session.ts` exposes a `useCurrentRole()` client hook backed by React context, defaulted to a role selectable via a dev-only role switcher in the Admin/Client layouts (`Partner/Admin`, `Manager`, `Accountant`, `Service Desk Agent`, `Client`). This lets reviewers see role-appropriate navigation without building real login. It must be clearly labelled as a dev/demo affordance and replaced by Supabase Auth + RBAC in a later phase — do not treat it as a security boundary.

## 7. Irish VAT calculation rules (`src/lib/vat.ts`)

- Standard rates allowed: `23`, `13.5`, `9`, `0`.
- `exempt`: no VAT line, no reclaim.
- `reverse_charge`: VAT amount forced to 0, invoice must render the fixed statutory note: *"VAT to be accounted for by the recipient under the reverse charge mechanism (Intra-EU B2B supply of services)."*
- Invoice/quote totals = sum(lineNet) + sum(lineVat); each line's VAT = round(net × rate / 100) in cents, `reverse_charge`/`exempt` contribute 0 VAT.

## 8. Routing map summary

| Module | Base path | Auth guard role(s) |
|---|---|---|
| Public Website | `/`, `/about`, `/services`, `/services/[slug]`, `/contact`, `/privacy`, `/terms` | none |
| Admin Portal | `/admin/**` | Partner/Admin, Manager, Accountant, Service Desk Agent |
| Client Portal | `/portal/**` | Client |

## 9. Non-goals confirmed for this pass

Per explicit user instruction: **Supabase wiring is deferred.** Everything above is written so that deferral doesn't create rework — only the `lib/data/*` implementations and an env-based backend switch are expected to change later.
