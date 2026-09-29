import Link from "next/link";
import { servicePages } from "@/lib/domain/services-content";
import { ContactCTA } from "@/components/site/ContactCTA";
import { BookOnlineButton } from "@/components/site/BookOnlineButton";
import { HeroSection } from "@/components/site/HeroSection";

export const metadata = {
  title: "Our Services | Chartered Accountancy & Tax Advisory",
  description:
    "Explore RK & Associates services: Accounting and Bookkeeping (€150), Taxation and Advisory (€100), Financial Reconciliation (€120), and Personalized Consultations (€100) in Dublin, Ireland.",
};

export default function ServicesPage() {
  const bookablePackages = servicePages.filter((s) => s.price);

  return (
    <div className="flex flex-col bg-white">
      {/* 1. HERO SECTION */}
      <HeroSection
        imageSrc="/images/services-tech.jpg"
        imageAlt="Cloud Accounting & Tax Analytics Workspace — RK & Associates"
        badge="Institutional Grade Accountancy Solutions"
        headline="Practice Areas & Tailored Advisory Services"
        subheadline="Comprehensive accountancy, statutory Revenue compliance, and strategic financial governance tailored for Irish SMEs, founders, and growing corporate entities."
        ctas={[
          { label: "Open Booking →", isBooking: true, variant: "primary" },
          { label: "Request Custom Quote", href: "/contact", variant: "ghost" },
        ]}
      />

      {/* 2. FEATURED DIRECT CONSULTATION PACKAGES (Euro €) */}
      <section className="bg-slate-900 text-white py-20 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                DIRECT CONSULTATION BOOKING
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-white">
                Featured Fixed-Fee Packages
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Schedule a 1-on-1 session with our senior chartered accountants. Instant online confirmation.
              </p>
            </div>
            <BookOnlineButton className="inline-flex items-center text-sm font-bold text-emerald-400 hover:text-emerald-300 transition">
              Open Booking Calendar Modal &rarr;
            </BookOnlineButton>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {bookablePackages.slice(0, 3).map((pkg) => (
              <div
                key={pkg.slug}
                className="rounded-3xl border border-slate-800 bg-slate-950/80 p-7 flex flex-col justify-between hover:border-emerald-500 transition duration-300 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                      {pkg.duration}
                    </span>
                    <span className="text-2xl font-black text-emerald-400">{pkg.price}</span>
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-white">{pkg.title}</h3>
                  <p className="mt-2 text-xs text-slate-400 font-medium">{pkg.tagline}</p>
                  <p className="mt-3 text-xs leading-relaxed text-slate-300 line-clamp-3">
                    {pkg.summary}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800/80 flex gap-3">
                  <BookOnlineButton
                    serviceSlug={pkg.slug}
                    className="flex-1 text-center rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-500 transition shadow"
                  >
                    Book Session
                  </BookOnlineButton>
                  <Link
                    href={`/service-page/${pkg.slug}`}
                    className="rounded-xl border border-slate-700 px-4 py-3 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition flex items-center justify-center"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. COMPLETE PRACTICE AREAS (from live site https://www.rkandassociate.com/our-services) */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Full Spectrum Solutions
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              All Practice Areas &amp; Advisory Services
            </h2>
            <p className="mt-3 text-base text-slate-600">
              From day-to-day transaction recording to strategic Corporation Tax structuring,
              we ensure total accuracy and strict compliance with Irish statutory law.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {servicePages.map((service) => (
              <div
                key={service.slug}
                className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:border-emerald-600 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>
                    {service.price && (
                      <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-900">
                        {service.price}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs font-semibold text-emerald-700">{service.tagline}</p>
                  <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-600">
                    {service.summary}
                  </p>

                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Deliverables &amp; Inclusions:
                    </p>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-xs text-slate-600">
                      {service.deliverables.slice(0, 4).map((d) => (
                        <li key={d} className="flex items-start gap-2">
                          <span className="text-emerald-700 font-bold shrink-0">✓</span>
                          <span className="line-clamp-2">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/service-page/${service.slug}`}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-600 transition"
                    >
                      View Details &rarr;
                    </Link>
                    {service.price && (
                      <BookOnlineButton
                        serviceSlug={service.slug}
                        className="text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition"
                      >
                        Book Now
                      </BookOnlineButton>
                    )}
                  </div>
                  <Link
                    href={`/contact?service=${encodeURIComponent(service.title)}`}
                    className="text-xs font-medium text-slate-500 hover:text-slate-900"
                  >
                    Inquire &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WORKFLOW / HOW WE ENGAGE */}
      <section className="bg-white py-24 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Structured Engagement
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              How We Deliver Enterprise Accounting
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-4">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-2xl font-black text-emerald-800">01</span>
              <h3 className="text-base font-bold text-slate-900">Initial Diagnostic</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review of your current ledgers, Revenue tax history, CRO filings, and corporate structure.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-2xl font-black text-emerald-800">02</span>
              <h3 className="text-base font-bold text-slate-900">Cloud Integration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connecting direct bank feeds, point-of-sale systems, and automated invoice portals.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-2xl font-black text-emerald-800">03</span>
              <h3 className="text-base font-bold text-slate-900">Active Reconciliation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Weekly/monthly reconciliations, payroll runs, and bi-monthly VAT3 submissions to Revenue.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-2xl font-black text-emerald-800">04</span>
              <h3 className="text-base font-bold text-slate-900">Year-End &amp; Tax</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full statutory financial statements, Form B1 CRO filing, and Corporation Tax (CT1) returns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. REUSABLE CONTACT CTA */}
      <ContactCTA
        title="Need a Customized Accountancy &amp; Tax Package?"
        subtitle="CONTACT OUR DUBLIN TEAM"
        description="Let's tailor an ongoing monthly retainer or project-based advisory plan specifically for your enterprise."
      />
    </div>
  );
}
