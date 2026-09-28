import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/site/ContactForm";

export const metadata: Metadata = {
  title: "About Us | RK & Associates",
  description:
    "Learn about RK & Associates, our expertise, why businesses choose us, and our commitment to financial success across Ireland.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            RK &amp; Associates
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            ABOUT RK &amp; ASSOCIATES
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            Dedicated to offering top-notch financial management solutions and building trusted
            client partnerships.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Our Story
              </span>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Our Expertise &amp; Background
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                RK &amp; Associates is a leading accountancy service provider, dedicated to offering
                top-notch financial management solutions. Our team of experts is committed to
                delivering high-quality services tailored to meet the unique needs of each client.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                We take pride in our professionalism and the trust we build with our clients. This is
                where our proactive approach and attention to detail set us apart in delivering
                exceptional accountancy, tax, payroll, and corporate compliance services.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
              <h3 className="text-xl font-bold text-slate-900">Professional Financial Advisors</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                At RK &amp; Associates, we are passionate about delivering exceptional financial
                advisory services that empower our clients to make informed decisions. Our experienced
                advisors are here to guide you through the complexities of financial management,
                ensuring your peace of mind and success.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/book-online"
                  className="rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
                >
                  Book a Consultation
                </Link>
                <Link
                  href="/our-services"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Explore Services
                </Link>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mt-20">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Why Choose Us
              </span>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Committed to Your Financial Success
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
                We are dedicated to staying ahead of industry trends and changes, ensuring that our
                clients always receive the most relevant and effective financial solutions.
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                  ✓
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  Proactive &amp; Forward-Looking
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Our proactive approach sets us apart, giving you the confidence to navigate the
                  financial landscape with ease. We don&apos;t just look backward at past numbers &mdash;
                  we help you anticipate tax liabilities, regulatory changes, and cash flow requirements.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                  ★
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  Tailored Solutions for Your Business
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  With in-depth knowledge and a deep understanding of diverse business needs, we
                  offer comprehensive financial services that are customized to serve the specific
                  requirements of small businesses, startups, and freelancers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-emerald-900 py-16 text-white text-center">
        <div className="mx-auto max-w-4xl px-6">
          <blockquote className="text-xl font-medium italic text-emerald-50 sm:text-2xl">
            &ldquo;I&apos;m incredibly impressed with the professionalism and expertise of RK &amp;
            Associates. Their tailored accountancy solutions have made a significant impact on our
            business growth.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm font-semibold text-emerald-200">
            &mdash; Shefali Chawla, Founder of Consciouse Ltd
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">Contact Us</h2>
            <p className="mt-2 text-sm text-slate-600">
              We&apos;d love to hear from you! Please reach out with any comments or feedback.
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
