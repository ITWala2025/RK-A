import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/domain/blog-content";
import { servicePages } from "@/lib/domain/services-content";
import { ContactCTA } from "@/components/site/ContactCTA";
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
      {/* 1. HERO SECTION (Enterprise Grade with Dublin Financial District Image) */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* Background glow & subtle grid */}
        <div className="absolute inset-0 radial-glow pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Dublin, Ireland &bull; Certified Accountancy &amp; Strategic Advisory</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Precision Accounting &amp; Strategic Tax Advisory
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
                At RK &amp; Associates, we deliver top-tier accountancy services that safeguard
                financial health, optimize Irish tax liabilities, and power sustainable growth for
                enterprises, startups, and sole traders across Ireland.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="rounded-xl bg-emerald-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-950/50 transition hover:bg-emerald-500 hover:scale-[1.02]"
                >
                  GET IN TOUCH &rarr;
                </Link>
                <BookOnlineButton className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-7 py-4 text-sm font-bold text-emerald-300 backdrop-blur transition hover:bg-emerald-500/20 hover:border-emerald-400">
                  BOOK CONSULTATION
                </BookOnlineButton>
                <Link
                  href="/services"
                  className="rounded-xl border border-slate-700 bg-white/5 px-6 py-4 text-sm font-semibold text-slate-300 backdrop-blur transition hover:bg-white/10 hover:text-white"
                >
                  VIEW SERVICES
                </Link>
              </div>

              {/* Direct call & Trust indicators */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <a
                  href="tel:+353899660987"
                  className="flex items-center gap-2 font-bold text-emerald-400 hover:text-emerald-300 transition"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    📞
                  </span>
                  +353 89 966 0987
                </a>
                <span className="text-slate-600">&bull;</span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="text-emerald-400 font-bold">✓</span> Revenue Ireland &amp; CRO Compliant
                </span>
                <span className="text-slate-600 hidden sm:inline">&bull;</span>
                <span className="text-slate-400 hidden sm:inline">
                  Bracetown Park, Dublin &amp; Saint Kevin&apos;s, D08
                </span>
              </div>
            </div>

            {/* Right Image Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900 group">
                <Image
                  src="/images/hero-dublin.jpg"
                  alt="RK & Associates Boardroom in Dublin Financial District"
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover transition duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                {/* Floating Glass Stats Card 1 */}
                <div className="absolute bottom-4 left-4 right-4 glass-panel rounded-2xl p-4 text-xs text-white border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-emerald-400 font-bold block text-sm">€2.4M+</span>
                    <span className="text-slate-300 text-[11px]">Tax &amp; Compliance Managed</span>
                  </div>
                  <div className="text-right border-l border-slate-700 pl-4">
                    <span className="text-white font-bold block text-sm">100%</span>
                    <span className="text-slate-300 text-[11px]">Audit Exemption Safety</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ENTERPRISE VALUE & STATS BAR */}
      <section className="bg-slate-900 border-y border-slate-800 text-white py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-slate-800">
            <div className="px-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">10+</div>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 font-medium">
                Years Industry Experience
              </p>
            </div>
            <div className="px-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-white">100%</div>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 font-medium">
                Revenue &amp; CRO Filing Accuracy
              </p>
            </div>
            <div className="px-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">€0</div>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 font-medium">
                Penalty Guarantee for Tracked Accounts
              </p>
            </div>
            <div className="px-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-white">24-48h</div>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 font-medium">
                Rapid SLA Turnaround
              </p>
            </div>
          </div>
        </div>
      </section>

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
