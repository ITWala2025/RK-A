import Link from "next/link";
import { ContactForm } from "@/components/site/ContactForm";
import { blogPosts } from "@/lib/domain/blog-content";

export const metadata = {
  title: "Accountant, Bookkeeping | RK & Associates",
  description:
    "RK & Associates is dedicated to providing top-notch accountancy services, VAT, payroll, company secretarial, taxation, and advisory tailored for small businesses and individuals in Dublin, Ireland.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Dublin, Ireland &bull; Certified Accountancy &amp; Advisory
            </div>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              RK &amp; Associates
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-300 sm:text-xl font-normal">
              At RK &amp; Associates, we are dedicated to providing top-notch accountancy services
              that add value to your business and contribute to your success. Our team of certified
              accountants are experts in providing a wide range of services including accounting,
              VAT, payroll, company secretarial, taxation, and advisory, tailored to meet the unique
              needs of both small businesses and individuals.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact-us"
                className="rounded-lg bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-500"
              >
                GET IN TOUCH
              </Link>
              <Link
                href="/our-services"
                className="rounded-lg border border-slate-600 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10 hover:border-slate-500"
              >
                OUR SERVICES
              </Link>
              <a
                href="tel:+353899660987"
                className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                TEL: +353 899660987
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              What We Offer
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Comprehensive Accountancy Solutions
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
              Our team offers comprehensive accountancy solutions customized to meet your specific
              business requirements. We strive to provide professional and accurate services that
              ensure your financial records are in good hands.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {/* Card 1 */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                  01
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  Comprehensive Accountancy Solutions
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  From statutory accounts to cloud bookkeeping, we ensure complete accuracy,
                  compliance with Irish GAAP, and seamless year-end financial reporting.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100">
                <Link
                  href="/our-services"
                  className="inline-flex items-center text-sm font-semibold text-emerald-800 hover:text-emerald-700"
                >
                  OUR SERVICES &rarr;
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                  02
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  Financial Management Expertise
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  With our team of financial management experts, you can rest assured that your
                  bookkeeping, reconciliations, and financial reporting needs are well taken care of.
                  We are committed to delivering high-quality services that support your business growth.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100">
                <Link
                  href="/our-services"
                  className="inline-flex items-center text-sm font-semibold text-emerald-800 hover:text-emerald-700"
                >
                  EXPLORE MORE &rarr;
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                  03
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  Strategic Tax Planning
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Effective tax planning is essential for optimizing your financial position. Our team
                  of tax professionals can help you develop strategic tax plans that minimize tax
                  liabilities and maximize your financial resources.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100">
                <Link
                  href="/service-page/tax-consultation"
                  className="inline-flex items-center text-sm font-semibold text-emerald-800 hover:text-emerald-700"
                >
                  BOOK TAX CONSULTATION &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Online Quick Pricing Section */}
      <section className="bg-white py-20 border-y border-slate-200">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Schedule an Appointment
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Book a Consultation Online
              </h2>
              <p className="mt-2 text-base text-slate-600">
                Select a package to schedule a direct session with our senior accountants.
              </p>
            </div>
            <Link
              href="/book-online"
              className="rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
            >
              View Full Booking Schedule &rarr;
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {/* Bookkeeping Service */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between hover:border-emerald-600 transition">
              <div>
                <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  1 hr 30 min
                </span>
                <h3 className="mt-4 text-xl font-bold text-slate-900">Bookkeeping Service</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Efficient bookkeeping for financial stability and audit-ready records.
                </p>
                <div className="mt-6">
                  <span className="text-3xl font-extrabold text-slate-900">US$150</span>
                  <span className="text-xs text-slate-500 ml-1">(150 US dollars)</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200/80">
                <Link
                  href="/service-page/bookkeeping-service"
                  className="block w-full text-center rounded-lg bg-emerald-800 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
                >
                  Book Now
                </Link>
              </div>
            </div>

            {/* Payroll Processing */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between hover:border-emerald-600 transition">
              <div>
                <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  1 hr
                </span>
                <h3 className="mt-4 text-xl font-bold text-slate-900">Payroll Processing</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Streamlined payroll processing for peace of mind and Revenue compliance.
                </p>
                <div className="mt-6">
                  <span className="text-3xl font-extrabold text-slate-900">US$120</span>
                  <span className="text-xs text-slate-500 ml-1">(120 US dollars)</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200/80">
                <Link
                  href="/service-page/payroll-processing"
                  className="block w-full text-center rounded-lg bg-emerald-800 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
                >
                  Book Now
                </Link>
              </div>
            </div>

            {/* Tax Consultation */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between hover:border-emerald-600 transition">
              <div>
                <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  1 hr
                </span>
                <h3 className="mt-4 text-xl font-bold text-slate-900">Tax Consultation</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Expert tax advice tailored to your needs and optimizing your financial situation.
                </p>
                <div className="mt-6">
                  <span className="text-3xl font-extrabold text-slate-900">US$100</span>
                  <span className="text-xs text-slate-500 ml-1">(100 US dollars)</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200/80">
                <Link
                  href="/service-page/tax-consultation"
                  className="block w-full text-center rounded-lg bg-emerald-800 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Experience & Trusted Advisors Section */}
      <section className="bg-slate-900 text-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                ABOUT US
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                With Over a Decade of Experience in the Industry
              </h2>
              <p className="mt-6 text-base leading-relaxed text-slate-300">
                With over a decade of experience in the industry, RK &amp; Associates has the
                knowledge and expertise to ensure professional, accurate, and high-quality accountancy
                services for your business. We are committed to providing personalized solutions that
                serve the unique needs of each client.
              </p>
              <div className="mt-8">
                <Link
                  href="/about-us"
                  className="inline-flex items-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition"
                >
                  LEARN MORE ABOUT US
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-8">
              <h3 className="text-xl font-bold text-emerald-400">Trusted Financial Advisors</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                As trusted financial advisors, we are dedicated to serving the financial needs of
                small businesses, startups, and freelancers. Our proactive approach and attention
                to detail set us apart in delivering exceptional accountancy services.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Certified and experienced chartered accountants
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Tailored solutions for Irish SMEs and Sole Traders
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Dedicated client portal with real-time compliance tracking
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonial */}
      <section className="bg-emerald-900 text-white py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
            CLIENT TESTIMONIALS
          </span>
          <blockquote className="mt-6 text-2xl font-medium italic leading-relaxed sm:text-3xl text-emerald-50">
            &ldquo;I&apos;m incredibly impressed with the professionalism and expertise of RK &amp;
            Associates. Their tailored accountancy solutions have made a significant impact on our
            business growth.&rdquo;
          </blockquote>
          <p className="mt-6 font-semibold text-emerald-200">
            &mdash; Shefali Chawla, <span className="font-normal text-emerald-300">Founder of Consciouse Ltd</span>
          </p>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Knowledge &amp; Insights
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Latest from Our Blog
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-sm font-semibold text-emerald-800 hover:text-emerald-700"
            >
              View All Articles &rarr;
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{post.date}</span>
                    <span>&bull;</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-slate-900 hover:text-emerald-800">
                    <Link href={`/post/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">By {post.author}</span>
                  <Link
                    href={`/post/${post.slug}`}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-700"
                  >
                    Read Article &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-section" className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Get In Touch
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Contact Us
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                We&apos;d love to hear from you! Please reach out with any comments, feedback, or
                inquiries, and our team will respond promptly.
              </p>

              <div className="mt-8 space-y-6 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                    📞
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Phone</p>
                    <a href="tel:+353899660987" className="text-emerald-800 hover:underline">
                      +353 89 966 0987
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                    ✉️
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Email</p>
                    <a href="mailto:info@rkandassociate.com" className="text-emerald-800 hover:underline">
                      info@rkandassociate.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                    📍
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Main Office</p>
                    <p className="text-slate-600">Bracetown Business Park, Clonee, Dublin, D15 YN2P</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Registered: Saint Kevin&apos;s, Dublin 8, D02 XE80, Ireland
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                    🕒
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Working Hours</p>
                    <p className="text-slate-600">Mon - Fri: 8:00 AM - 6:00 PM</p>
                    <p className="text-slate-600">Saturday: 9:00 AM - 1:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Send us a message</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
