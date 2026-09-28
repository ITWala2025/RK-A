"use client";

import { useState, type FormEvent } from "react";

const SERVICE_OPTIONS = [
  "Bookkeeping Service",
  "Payroll Processing",
  "Tax Consultation & Planning",
  "Financial Reconciliation",
  "Company Secretarial & VAT",
  "Personalized Advisory",
];

export function ContactForm({ initialService }: { initialService?: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>(
    initialService ? [initialService] : []
  );

  function toggleService(service: string) {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = new FormData(event.currentTarget);
    const firstName = String(form.get("firstName") ?? "").trim();
    const lastName = String(form.get("lastName") ?? "").trim();
    const fullName = `${firstName} ${lastName}`.trim() || firstName || "Website Inquiry";

    const payload = {
      name: fullName,
      companyName: String(form.get("companyName") ?? "") || undefined,
      email: String(form.get("email") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      message: String(form.get("message") ?? "").trim(),
      serviceInterest: selectedServices,
      consentMarketing: form.get("consent") === "on",
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit form. Please try again.");
      }

      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "We could not submit your request. Please email us at info@rkandassociate.com directly."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 text-xl font-bold text-emerald-950">Thank You!</h3>
        <p className="mt-2 text-sm text-emerald-800">
          Your message has been received. Our team at RK &amp; Associates will respond promptly to
          discuss your financial and accounting requirements.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href="tel:+353899660987"
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition"
          >
            Call Us Directly: +353 89 966 0987
          </a>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 transition"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {errorMessage}
        </div>
      )}

      {/* Name fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-semibold text-slate-800">
            First name <span className="text-emerald-700">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            placeholder="John"
            className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm shadow-sm transition focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-semibold text-slate-800">
            Last name <span className="text-emerald-700">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            placeholder="Doe"
            className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm shadow-sm transition focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* Email & Phone */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-800">
            Email <span className="text-emerald-700">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="john@example.com"
            className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm shadow-sm transition focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-slate-800">
            Phone <span className="text-emerald-700">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="+353 89 966 0987"
            className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm shadow-sm transition focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* Company Name */}
      <div>
        <label htmlFor="companyName" className="block text-sm font-semibold text-slate-800">
          Company Name <span className="text-xs font-normal text-slate-500">(Optional)</span>
        </label>
        <input
          id="companyName"
          name="companyName"
          type="text"
          placeholder="Acme Ltd / Sole Trader"
          className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm shadow-sm transition focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {/* Service interest tags */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          Services You Are Interested In
        </label>
        <div className="flex flex-wrap gap-2">
          {SERVICE_OPTIONS.map((srv) => {
            const isSelected = selectedServices.includes(srv);
            return (
              <button
                key={srv}
                type="button"
                onClick={() => toggleService(srv)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  isSelected
                    ? "bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-800"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {isSelected ? "✓ " : "+ "}
                {srv}
              </button>
            );
          })}
        </div>
      </div>

      {/* Long answer / Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-slate-800">
          Long answer / How can we help you? <span className="text-emerald-700">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="Please describe your business requirements, accounting needs, or questions..."
          className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm shadow-sm transition focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {/* Consent */}
      <div className="flex items-start gap-2.5 text-xs text-slate-600">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          defaultChecked
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
        />
        <label htmlFor="consent">
          I agree that RK &amp; Associates may contact me regarding my inquiry in accordance with the
          privacy policy.
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-lg bg-emerald-800 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting Inquiry..." : "Submit"}
      </button>
    </form>
  );
}
