import Link from "next/link";
import { blogPosts } from "@/lib/domain/blog-content";
import { servicePages } from "@/lib/domain/services-content";
import { ContactCTA } from "@/components/site/ContactCTA";
import { HeroSection } from "@/components/site/HeroSection";
import { BookOnlineButton } from "@/components/site/BookOnlineButton";

export const metadata = {
  title: "RK & Associates | Chartered Accountants & Tax Advisory Dublin",
  description:
    "Top-tier Irish chartered accountancy services, strategic tax planning, VAT, payroll, company secretarial, and CRO compliance in Dublin, Ireland.",
};

export default function HomePage() {
  const featuredServices = servicePages.slice(0, 4);

  return (
    <div className="flex flex-col bg-white">
      {/* 1. HERO SECTION */}
      <HeroSection
        imageSrc="/images/hero-dublin.jpg"
        imageAlt="Dublin Financial District — RK & Associates"
        badge="Dublin, Ireland · Chartered Accountancy & Strategic Advisory"
        headline="Precision Financial Governance & Strategic Irish Tax Advisory"
        subheadline="RK & Associates delivers institutional-grade chartered accountancy, corporate compliance, and proactive tax architecture tailored for Irish enterprises, high-growth startups, and international subsidiaries."
        ctas={[
          { label: "Get in Touch →", href: "/contact", variant: "primary" },
          { label: "Book Consultation", isBooking: true, variant: "secondary" },
          { label: "View Practice Areas", href: "/services", variant: "ghost" },
        ]}
        stats={[
          { value: "10+", label: "Years In Practice" },
          { value: "100%", label: "Statutory Accuracy" },
          { value: "€0", label: "Penalty Guarantee" },
          { value: "< 24h", label: "Partner Response" },
        ]}
      />

      {/* 3. WHAT WE OFFER — CORE PRACTICE AREAS (Euro €) */}
      <section className="bg-slate-50 py-24 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full">
                Practice Areas &amp; Solutions
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Comprehensive Accountancy Solutions
              </h2>
              <p className="mt-3 text-base text-slate-600 max-w-2xl">
                Customized for Irish SMEs, expanding corporations, startups, and high-net-worth
                individuals seeking institutional financial governance.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center text-sm font-bold text-emerald-800 hover:text-emerald-700 transition"
            >
              Explore All Solutions &rarr;
            </Link>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featuredServices.map((service, idx) => (
              <div
                key={service.slug}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-emerald-600 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 font-extrabold text-sm border border-emerald-200">
                      0{idx + 1}
                    </span>
                    {service.price && (
                      <span className="rounded-full bg-emerald-100/70 px-3 py-1 text-xs font-bold text-emerald-900">
                        {service.price}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-3">
                    {service.summary}
                  </p>

                  <ul className="mt-6 space-y-2 border-t border-slate-100 pt-5 text-xs text-slate-600">
                    {service.deliverables.slice(0, 3).map((d) => (
                      <li key={d} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span className="line-clamp-1">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/service-page/${service.slug}`}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-600 transition"
                  >
                    Learn More &rarr;
                  </Link>
                  {service.price && (
                    <BookOnlineButton
                      serviceSlug={service.slug}
                      className="text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition shadow-xs"
                    >
                      Book
                    </BookOnlineButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STRATEGIC ADVISORY & EXPERTISE SECTION */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950 px-3.5 py-1 rounded-full border border-emerald-800">
                OVER A DECADE OF EXCELLENCE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Trusted Financial Leadership Across Irish Commerce
              </h2>
              <p className="text-base leading-relaxed text-slate-300">
                With over a decade of hands-on industry expertise, RK &amp; Associates provides the
                depth, precision, and foresight required to navigate Ireland&apos;s complex
                statutory and regulatory environment.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                    ✓
                  </div>
                  <p className="text-sm text-slate-300">
                    <strong className="text-white">Proactive Tax Strategies:</strong> Corporation Tax
                    (CT1), 12.5% statutory rate optimization, and cross-border intra-EU VAT handling.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                    ✓
                  </div>
                  <p className="text-sm text-slate-300">
                    <strong className="text-white">Companies Registration Office (CRO):</strong> Annual
                    Returns (Form B1), RBO beneficial ownership filings, and audit exemption defense.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                    ✓
                  </div>
                  <p className="text-sm text-slate-300">
                    <strong className="text-white">Dedicated Client Portal:</strong> Real-time financial
                    visibility, automated receipt handling, and instant invoice management.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/about"
                  className="rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-500"
                >
                  LEARN MORE ABOUT US
                </Link>
                <BookOnlineButton className="rounded-xl border border-slate-700 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10">
                  BOOK STRATEGY SESSION
                </BookOnlineButton>
              </div>
            </div>

            {/* Right Card / Graphic */}
            <div className="rounded-3xl border border-slate-800 bg-slate-800/60 p-8 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-700 pb-5">
                <div>
                  <h3 className="text-lg font-bold text-white">Why Businesses Choose RK &amp; A</h3>
                  <p className="text-xs text-slate-400">Irish Regulatory Standards &bull; GAAP Compliance</p>
                </div>
                <span className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Certified
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80">
                  <h4 className="text-sm font-bold text-emerald-300">Tailored SME &amp; Corporate Packages</h4>
                  <p className="mt-1 text-xs text-slate-400">
                    Transparent fixed-fee structure in Euros (€) with no hidden surprises.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80">
                  <h4 className="text-sm font-bold text-emerald-300">Direct Senior Partner Access</h4>
                  <p className="mt-1 text-xs text-slate-400">
                    Work directly with chartered accountants who understand your business model.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80">
                  <h4 className="text-sm font-bold text-emerald-300">Multi-Entity Cloud Integration</h4>
                  <p className="mt-1 text-xs text-slate-400">
                    Seamless sync across Xero, QuickBooks, Big Red Cloud, and Sage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CLIENT TESTIMONIALS */}
      <section className="bg-emerald-950 text-white py-20 relative overflow-hidden border-b border-emerald-900">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 bg-emerald-900/80 px-3.5 py-1 rounded-full border border-emerald-700">
            VERIFIED CLIENT TESTIMONIAL
          </span>
          <blockquote className="mt-8 text-2xl sm:text-3xl font-medium italic leading-relaxed text-emerald-50">
            &ldquo;I&apos;m incredibly impressed with the professionalism and expertise of RK &amp;
            Associates. Their tailored accountancy solutions and proactive tax planning have made a
            significant impact on our business growth in Dublin.&rdquo;
          </blockquote>
          <div className="mt-8 flex flex-col items-center justify-center">
            <p className="text-base font-bold text-white">Shefali Chawla</p>
            <p className="text-xs font-medium text-emerald-300">Founder &amp; CEO, Consciouse Ltd</p>
          </div>
        </div>
      </section>

      {/* 6. RECENT INSIGHTS / BLOG */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Knowledge &amp; Insights
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Latest Regulatory &amp; Tax Updates
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-sm font-bold text-emerald-800 hover:text-emerald-700 transition"
            >
              View All Articles &rarr;
            </Link>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:shadow-lg hover:border-emerald-600"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <span>{post.date}</span>
                    <span>&bull;</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 hover:text-emerald-800 transition">
                    <Link href={`/post/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">By {post.author}</span>
                  <Link
                    href={`/post/${post.slug}`}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-700"
                  >
                    Read &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. REUSABLE ENTERPRISE CONTACT CTA */}
      <ContactCTA
        title="Ready to Elevate Your Financial Management?"
        subtitle="CONTACT RK & ASSOCIATES"
        description="Whether you need comprehensive bookkeeping, corporate tax filing, or tailored advisory in Dublin, our team is ready to support your business."
      />
    </div>
  );
}
