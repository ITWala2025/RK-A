# test.md — Test Strategy & Checklist

Companion to [PRD.md](PRD.md) §3.1 (Gherkin user stories) and [Design.md](Design.md). Defines how the platform is tested and tracks Phase 1 coverage.

## 1. Tooling (planned)

| Layer | Tool | Notes |
|---|---|---|
| Unit (pure logic) | Vitest | VAT calculation, invoice numbering, repository logic |
| Component | React Testing Library + Vitest | Forms (Contact, Quote builder, Invoice builder), status badges |
| End-to-end | Playwright | Public site smoke tests, lead capture flow, admin quote→invoice flow, client portal document flow |
| Static checks | ESLint, TypeScript `strict` | Run in CI and required before merge |

Test tooling is not yet wired into `web/` in this pass — this document defines the target strategy and the Phase 1 manual verification checklist that stands in until automated tests are added. Do not claim automated coverage that doesn't exist; keep this file honest about what's actually running.

## 2. Test strategy per module

- **Public Website**: server-rendered pages should be tested for correct content, working navigation, and that the Contact form calls the lead-capture API and shows success/error states (bot-protection and real reCAPTCHA are out of scope for Phase 1 — see Design.md non-goals).
- **Admin Portal**: repository-layer unit tests for status transitions (Lead status machine, Quote lifecycle, Invoice lifecycle) are the priority — these encode business rules most likely to regress. UI tests confirm locked/derived fields (e.g., VAT amount on reverse-charge lines) render correctly.
- **Client Portal**: focus on read-path correctness (dashboard aggregation from mock repositories) since there is no real auth/payment yet.

## 3. Mapping PRD Gherkin scenarios → Phase 1 coverage

| PRD Scenario (§3.1) | Phase 1 status | Notes |
|---|---|---|
| US-A1 Successful lead submission | Implemented (manual verify) | POST `/api/leads` creates Lead via repository, status `new` |
| US-A1 Blocked by bot protection | Deferred | reCAPTCHA not integrated in Phase 1 |
| US-A2 Convert qualified lead to quote | Implemented (manual verify) | "Create Quote" from Lead detail prefills customer info |
| US-A3 Client accepts quote via magic link | Deferred | Magic-link acceptance is Phase 2 (needs e-signature/email infra) |
| US-B1 Locked clauses cannot be edited | Deferred | Contract/engagement letter module is Phase 2 |
| US-B2 Client e-signature | Deferred | Phase 2 (e-signature integration) |
| US-C1 Convert accepted quote to invoice | Implemented (manual verify) | VAT carried over; reverse-charge zeroes VAT + prints note |
| US-C2 Online invoice payment | Deferred | Payment gateway is Phase 2 |
| US-D1..D4 (ITSM) | Deferred | Service Desk module is Phase 2 |
| US-E1 Secure document upload | Partially implemented | Mock upload + category/tax-year tagging; malware scan is simulated (`clean` after delay), no real AV integration |
| US-F1..F3 (Compliance notifications) | Deferred (sample data only) | Dashboard shows static sample obligations; no rules engine or notification delivery yet |

## 4. Manual verification checklist for Phase 1 (run before calling a change "done")

- [ ] `npm run build` succeeds in `web/`
- [ ] `npm run lint` succeeds in `web/`
- [ ] Home, About, Services index, at least one Service detail page, Contact, Privacy, Terms all render without console errors
- [ ] Submitting the Contact form creates a Lead visible in Admin → Leads
- [ ] Admin → Leads: can change a lead's status; Admin → Leads → Create Quote pre-fills customer/contact info
- [ ] Admin → Quotes: creating line items with different VAT rates computes correct line VAT and totals; reverse-charge line shows €0 VAT + statutory note
- [ ] Admin → Quotes: "Convert to Invoice" produces a Draft invoice referencing the quote number
- [ ] Admin → Invoices: sequential invoice numbers never repeat across created invoices
- [ ] Admin → Customers: list and a Customer 360 detail page render with financial summary section
- [ ] Client Portal → Dashboard: shows sample deadlines, invoice, and document cards without runtime errors
- [ ] Client Portal → Documents: mock upload adds a document row with `pending_scan` → `clean` status transition
- [ ] Role switcher changes visible navigation between at least two roles

## 5. Out of scope for Phase 1 testing

Security penetration testing, load/performance testing (PRD §4.3 targets), and disaster-recovery drills are Phase 3 activities per the PRD roadmap and are not covered here.
