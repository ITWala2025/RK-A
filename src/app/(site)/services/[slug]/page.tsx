import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getServiceBySlug, servicePages } from "@/lib/domain/services-content";
import { ContactCTA } from "@/components/site/ContactCTA";
import { BookOnlineButton } from "@/components/site/BookOnlineButton";

export function generateStaticParams() {
  const slugs: { slug: string }[] = [];
  for (const service of servicePages) {
    slugs.push({ slug: service.slug });
    if (service.aliases) {
      for (const alias of service.aliases) {
        slugs.push({ slug: alias });
      }
    }
  }
  return slugs;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  return {
    title: service ? `${service.title} | RK & Associates` : "Service | RK & Associates",
    description: service?.summary,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <div className="flex flex-col">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-emerald-400 transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/services" className="hover:text-emerald-400 transition">
              Services
            </Link>
            <span>/</span>
            <span className="text-emerald-400 font-medium">{service.title}</span>
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {service.title}
              </h1>
              <p className="mt-2 text-emerald-300 font-medium">{service.tagline}</p>
            </div>
            {service.price && (
              <div className="flex items-center gap-4 rounded-xl border border-emerald-500/30 bg-emerald-950/80 px-6 py-4 backdrop-blur">
                <div>
                  <span className="block text-xs text-slate-400 uppercase tracking-wider">Fee</span>
                  <span className="text-2xl font-bold text-white">{service.price}</span>
                </div>
                {service.duration && (
                  <div className="border-l border-slate-700 pl-4">
                    <span className="block text-xs text-slate-400 uppercase tracking-wider">
                      Duration
                    </span>
                    <span className="text-sm font-semibold text-emerald-300">
                      {service.duration}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Details */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-slate-900">Service Description</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">{service.summary}</p>

              {/* What's included */}
              <div className="mt-10">
                <h3 className="text-lg font-bold text-slate-900">Key Deliverables &amp; Scope</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {service.deliverables.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-sm text-slate-700"
                    >
                      <span className="text-emerald-700 font-bold shrink-0">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features / Highlights */}
              {service.features && service.features.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-lg font-bold text-slate-900">Service Highlights</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {service.features.map((feat) => (
                      <div
                        key={feat}
                        className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 text-sm font-medium text-emerald-950"
                      >
                        <span className="text-emerald-600 font-bold">★</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs */}
              {service.faq && service.faq.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h3>
                  <div className="mt-4 space-y-4">
                    {service.faq.map((item) => (
                      <div
                        key={item.question}
                        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                      >
                        <p className="font-semibold text-slate-900">{item.question}</p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Booking & Contact */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900">Book Online Modal</h3>
                  <p className="mt-2 text-xs text-slate-600">
                    Schedule a direct consultation session with our certified professionals.
                  </p>

                  <div className="mt-5 space-y-3 text-xs text-slate-600 border-t border-slate-200 pt-4">
                    {service.duration && (
                      <div className="flex justify-between">
                        <span className="font-medium text-slate-500">Duration:</span>
                        <span className="font-semibold text-slate-900">{service.duration}</span>
                      </div>
                    )}
                    {service.price && (
                      <div className="flex justify-between">
                        <span className="font-medium text-slate-500">Price:</span>
                        <span className="font-bold text-emerald-800">{service.price}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-500">Location:</span>
                      <span className="text-right text-slate-900">Dublin 8 / Remote</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <BookOnlineButton
                      serviceSlug={service.slug}
                      className="block w-full rounded-lg bg-emerald-800 py-3 text-center text-sm font-semibold text-white shadow hover:bg-emerald-700 transition"
                    >
                      Open Booking Modal &rarr;
                    </BookOnlineButton>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-xs text-slate-600 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm mb-2">Office Details</h4>
                  <p>📍 Saint Kevin&apos;s, Dublin 8, D02 XE80, Ireland</p>
                  <p>
                    📞{" "}
                    <a href="tel:+353899660987" className="text-emerald-800 hover:underline">
                      +353 89 966 0987
                    </a>
                  </p>
                  <p>
                    ✉️{" "}
                    <a href="mailto:info@rkandassociate.com" className="text-emerald-800 hover:underline">
                      info@rkandassociate.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <ContactCTA
        title={`Questions Regarding ${service.title}?`}
        subtitle="CONTACT US"
        description="Reach out to our certified accountants to discuss your specific requirements or arrange a personalized package."
      />
    </div>
  );
}
