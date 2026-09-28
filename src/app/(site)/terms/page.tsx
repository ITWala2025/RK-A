import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-slate-700">
      <h1 className="text-3xl font-bold text-slate-900">Terms &amp; Conditions</h1>
      <p className="mt-4 text-sm text-slate-500">Last updated: 28 September 2026</p>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Website Use</h2>
        <p>
          This website provides general information about RK &amp; Associate Ireland&apos;s
          services. Content is for informational purposes only and does not constitute
          professional advice without a signed engagement.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">No Advice Without Engagement</h2>
        <p>
          Nothing on this website should be relied upon as accounting, tax, or legal advice.
          Formal advice is only provided under a signed Engagement Letter, which separately
          governs the terms of any client-service relationship.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Intellectual Property</h2>
        <p>
          All content on this website is the property of RK &amp; Associate Ireland unless
          otherwise stated, and may not be reproduced without permission.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Liability</h2>
        <p>
          To the extent permitted by law, RK &amp; Associate Ireland accepts no liability for
          decisions made in reliance on general website content.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Governing Law &amp; Complaints</h2>
        <p>
          These terms are governed by the laws of Ireland. Complaints regarding our professional
          services should be raised through our internal complaints-handling procedure, available
          on request, in line with Chartered Accountants Ireland regulations.
        </p>
      </section>
    </div>
  );
}
