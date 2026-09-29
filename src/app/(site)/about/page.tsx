import Link from "next/link";
import { ContactCTA } from "@/components/site/ContactCTA";
import { BookOnlineButton } from "@/components/site/BookOnlineButton";
import { HeroSection } from "@/components/site/HeroSection";

export const metadata = {
  title: "About Us | RK & Associates",
  description:
    "Learn about RK & Associates, our certified chartered accountants, client partnerships, and decade-long commitment to Irish business success in Dublin.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-white">
      {/* 1. HERO SECTION */}
      <HeroSection
        imageSrc="/images/about-team.jpg"
        imageAlt="RK & Associates Advisory Team — Dublin"
        badge="About RK & Associates · Dublin, Ireland"
        headline="Dedicated to Irish Financial Excellence & Growth"
        subheadline="For over a decade, RK & Associates has partnered with Irish SMEs, growing corporations, and innovative founders to build robust financial foundations and achieve sustainable growth."
        ctas={[
          { label: "Book a Consultation →", isBooking: true, variant: "primary" },
          { label: "Explore Practice Areas", href: "/services", variant: "ghost" },
        ]}
      />

      {/* 2. OUR STORY & PHILOSOPHY */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                OUR BACKGROUND
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                A Modern Approach to Enterprise Accountancy
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600">
                <p>
                  RK &amp; Associates was founded with a singular purpose: to replace rigid, reactive
                  accounting with agile, proactive financial management that creates genuine
                  commercial value.
                </p>
                <p>
                  Our team combines deep expertise in Irish GAAP, statutory Revenue regulations,
                  and Companies Registration Office (CRO) compliance with state-of-the-art cloud
                  accounting technologies.
                </p>
                <p>
                  We believe that great accountancy isn&apos;t just about filing tax returns at year-end;
                  it is about providing founders, directors, and finance executives with continuous
                  clarity, proactive cash flow strategies, and complete peace of mind.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                <div>
                  <h4 className="font-extrabold text-2xl text-emerald-800">100%</h4>
                  <p className="text-xs text-slate-500 mt-1">Audit Exemption Compliance Rate</p>
                </div>
                <div>
                  <h4 className="font-extrabold text-2xl text-slate-900">Dublin 8 &amp; D15</h4>
                  <p className="text-xs text-slate-500 mt-1">Twin Strategic Office Hubs</p>
                </div>
              </div>
            </div>

            {/* Strategic Pillars Box */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-8 sm:p-10 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-4">
                Our Core Operating Pillars
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                    01
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Proactive Compliance &amp; Tax</h4>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      We monitor statutory deadlines (CT1, VAT3, Form B1) in advance, ensuring no
                      penalties or loss of audit exemption status.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                    02
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Transparent Euro Pricing</h4>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      Predictable fixed-fee packages with zero hidden hourly surcharges, allowing
                      accurate budgeting for growing businesses.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                    03
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Dedicated Client Relationship Manager</h4>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      Direct phone and email contact with senior chartered professionals who know your
                      business inside and out.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXECUTIVE TESTIMONIAL BANNER */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            CLIENT PARTNERSHIP
          </span>
          <blockquote className="mt-6 text-2xl sm:text-3xl font-medium italic text-slate-100 leading-relaxed">
            &ldquo;Their attention to detail and swift turnaround on our statutory accounts and VAT
            filings have made RK &amp; Associates an indispensable asset to our executive team.&rdquo;
          </blockquote>
          <p className="mt-6 text-sm font-bold text-emerald-400">
            &mdash; Founder, Irish Digital &amp; Tech Solutions
          </p>
        </div>
      </section>

      {/* 4. REUSABLE CONTACT CTA */}
      <ContactCTA
        title="Connect With Our Senior Chartered Advisors"
        subtitle="SCHEDULE A STRATEGY SESSION"
        description="We’d love to discuss how our tailored accountancy solutions can add immediate value to your Irish business."
      />
    </div>
  );
}
