import type { Metadata } from "next";
import Link from "next/link";
import { servicePages } from "@/lib/domain/services-content";
import { ContactForm } from "@/components/site/ContactForm";

export const metadata: Metadata = {
  title: "Our Services | RK & Associates",
  description:
    "Explore RK & Associates services: Accounting, Bookkeeping, Taxation, Payroll, Financial Reconciliation, and Personalized Consultations in Dublin, Ireland.",
};

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            RK &amp; Associates
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            OUR SERVICES
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            Comprehensive accountancy, tax, and advisory solutions customized to meet your specific
            business requirements.
          </p>
        </div>
      </section>

      {/* Featured Bookable Packages */}
      <section className="bg-emerald-950 text-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Direct Appointment Booking
              </span>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Featured Bookable Packages
              </h2>
            </div>
            <Link
              href="/book-online"
              className="inline-flex items-center text-sm font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Go to Booking Calendar &rarr;
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {/* Bookkeeping Service */}
            <div className="rounded-2xl border border-emerald-800 bg-slate-900/90 p-6 flex flex-col justify-between hover:border-emerald-500 transition">
              <div>
                <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                  1 hr 30 min
                </span>
                <h3 className="mt-4 text-xl font-bold text-white">Bookkeeping Service</h3>
                <p className="mt-2 text-xs text-slate-400 font-medium">Efficient bookkeeping for financial stability</p>
                <p className="mt-3 text-sm text-slate-300">
                  Secure your financial records with our professional bookkeeping service. From organizing transactions to preparing financial statements.
                </p>
                <div className="mt-6">
                  <span className="text-3xl font-extrabold text-emerald-400">US$150</span>
                  <span className="text-xs text-slate-400 ml-1">/ session</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-800">
                <Link
                  href="/service-page/bookkeeping-service"
                  className="block w-full text-center rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition"
                >
                  Book Bookkeeping
                </Link>
              </div>
            </div>

            {/* Payroll Processing */}
            <div className="rounded-2xl border border-emerald-800 bg-slate-900/90 p-6 flex flex-col justify-between hover:border-emerald-500 transition">
              <div>
                <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                  1 hr
                </span>
                <h3 className="mt-4 text-xl font-bold text-white">Payroll Processing</h3>
                <p className="mt-2 text-xs text-slate-400 font-medium">Streamlined payroll processing for peace of mind</p>
                <p className="mt-3 text-sm text-slate-300">
                  Outsource your payroll processing to us for hassle-free payroll management, timely payments, and complete Revenue compliance.
                </p>
                <div className="mt-6">
                  <span className="text-3xl font-extrabold text-emerald-400">US$120</span>
                  <span className="text-xs text-slate-400 ml-1">/ session</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-800">
                <Link
                  href="/service-page/payroll-processing"
                  className="block w-full text-center rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition"
                >
                  Book Payroll
                </Link>
              </div>
            </div>

            {/* Tax Consultation */}
            <div className="rounded-2xl border border-emerald-800 bg-slate-900/90 p-6 flex flex-col justify-between hover:border-emerald-500 transition">
              <div>
                <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                  1 hr
                </span>
                <h3 className="mt-4 text-xl font-bold text-white">Tax Consultation</h3>
                <p className="mt-2 text-xs text-slate-400 font-medium">Expert tax advice tailored to your needs</p>
                <p className="mt-3 text-sm text-slate-300">
                  Get personalized advice and guidance on tax planning, compliance, and optimizing your corporate or personal financial situation.
                </p>
                <div className="mt-6">
                  <span className="text-3xl font-extrabold text-emerald-400">US$100</span>
                  <span className="text-xs text-slate-400 ml-1">/ session</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-800">
                <Link
                  href="/service-page/tax-consultation"
                  className="block w-full text-center rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition"
                >
                  Book Tax Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Services Grid */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Complete Capabilities
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              All Practice Areas &amp; Solutions
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
              Every service is delivered with professional rigor, attention to detail, and a focus
              on long-term financial health.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {servicePages.map((service) => (
              <div
                key={service.slug}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-emerald-600 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>
                    {service.price && (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                        {service.price}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs font-medium text-emerald-700">{service.tagline}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.summary}</p>

                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                      What&apos;s Included:
                    </p>
                    <ul className="mt-3 space-y-2 text-xs text-slate-600">
                      {service.deliverables.slice(0, 4).map((d) => (
                        <li key={d} className="flex items-start gap-2">
                          <span className="text-emerald-700 font-bold">✓</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/service-page/${service.slug}`}
                    className="text-sm font-semibold text-emerald-800 hover:text-emerald-700"
                  >
                    View Details &amp; Book &rarr;
                  </Link>
                  <Link
                    href={`/contact?service=${encodeURIComponent(service.title)}`}
                    className="text-xs font-medium text-slate-500 hover:text-slate-800"
                  >
                    Inquire &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">Request Custom Service Proposal</h2>
            <p className="mt-2 text-sm text-slate-600">
              Need a bundled solution for ongoing accounting, payroll, and tax? Send us your
              requirements.
            </p>
          </div>
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
