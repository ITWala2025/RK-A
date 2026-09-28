import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-slate-700">
      <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
      <p className="mt-4 text-sm text-slate-500">Last updated: 28 September 2026</p>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Data Controller</h2>
        <p>
          RK &amp; Associate Ireland is the data controller for personal data collected through
          this website and our client-facing platform.
          {" "}
          <em>
            [Data Protection Officer contact to be confirmed — see PRD Open Question 3 / memory.md]
          </em>
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Legal Basis for Processing</h2>
        <p>
          We process personal data on the basis of contract performance (delivering engaged
          services), legitimate interest (responding to enquiries), consent (marketing
          communications), and legal obligation (Revenue and CRO reporting requirements).
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Categories of Data Processed</h2>
        <p>
          Contact details, entity identifiers (CRO number, Tax Reference Number, VAT number),
          financial and payroll data, and — where relevant to a client engagement — PPS numbers,
          which we treat as special-category sensitive data with restricted access.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Data Retention</h2>
        <p>
          Tax and accounting records are retained for six years in line with Section 886 TCA 1997.
          Other personal data is retained only as long as necessary for the purpose collected.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Your Rights</h2>
        <p>
          You have the right to access, rectify, erase, port, or object to processing of your
          personal data. Contact us to exercise these rights; we will respond within the statutory
          timeframe.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Sub-processors &amp; Data Breaches</h2>
        <p>
          We use vetted sub-processors for hosting, payments, and e-signature services, each bound
          by a Data Processing Agreement. In the event of a personal data breach, we will notify
          the Data Protection Commission within 72 hours where required.
        </p>
      </section>
    </div>
  );
}
