import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | RK & Associates",
  description:
    "Get in touch with RK & Associates for professional accountancy, VAT, payroll, taxation, and advisory services in Dublin, Ireland.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;

  return (
    <div className="flex flex-col">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            RK &amp; Associates
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            GET IN TOUCH
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            If you need professional accountancy services, don&apos;t hesitate to get in touch with
            RK &amp; Associates. Whether you have questions about accounting, VAT, payroll, company
            secretarial, taxation, or advisory, our team is here to help.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Details & Working Hours */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Contact Information
              </span>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Let&apos;s Discuss Your Financial Needs
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Reach out to us by email, phone, or visit our office to discuss your financial
                management needs. Our team will respond promptly.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 text-lg">
                    📞
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Direct Telephone</h3>
                    <a
                      href="tel:+353899660987"
                      className="mt-1 block text-base font-semibold text-emerald-800 hover:underline"
                    >
                      +353 89 966 0987
                    </a>
                    <span className="text-xs text-slate-500">Available Mon-Sat for inquiries</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 text-lg">
                    ✉️
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Email Address</h3>
                    <a
                      href="mailto:info@rkandassociate.com"
                      className="mt-1 block text-base font-semibold text-emerald-800 hover:underline"
                    >
                      info@rkandassociate.com
                    </a>
                    <span className="text-xs text-slate-500">
                      We respond within 1 business day
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 text-lg">
                    📍
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Office Locations</h3>
                    <div className="mt-2 text-sm text-slate-700 space-y-2">
                      <div>
                        <p className="font-semibold text-slate-900">Main Office:</p>
                        <p className="text-slate-600">
                          Bracetown Business Park, Clonee, Dublin, D15 YN2P
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-200">
                        <p className="font-semibold text-slate-900">Registered Office:</p>
                        <p className="text-slate-600">
                          Saint Kevin&apos;s, Dublin 8, D02 XE80, Ireland
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 text-lg">
                    🕒
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Working Hours</h3>
                    <div className="mt-1 text-sm text-slate-700">
                      <p>
                        <span className="font-medium text-slate-900">Mon &ndash; Fri:</span> 8:00 AM
                        &ndash; 6:00 PM
                      </p>
                      <p>
                        <span className="font-medium text-slate-900">Saturday:</span> 9:00 AM
                        &ndash; 1:00 PM
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-8 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Send a Message
                </span>
                <h3 className="mt-1 text-xl font-bold text-slate-900 mb-6">
                  We’d love to hear from you!
                </h3>
                <ContactForm initialService={service} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
