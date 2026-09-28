import Link from "next/link";
import { BookOnlineButton } from "./BookOnlineButton";

interface ContactCTAProps {
  title?: string;
  subtitle?: string;
  description?: string;
  theme?: "light" | "dark";
}

export function ContactCTA({
  title = "Ready to Discuss Your Accounting & Tax Needs?",
  subtitle = "GET IN TOUCH WITH RK & ASSOCIATES",
  description = "Whether you need comprehensive bookkeeping, corporate tax filing, or tailored advisory in Dublin, our team is ready to support your business growth.",
  theme = "light",
}: ContactCTAProps) {
  const isDark = theme === "dark";

  return (
    <section
      className={`relative overflow-hidden py-16 sm:py-20 border-t ${
        isDark
          ? "bg-slate-900 text-white border-slate-800"
          : "bg-slate-50 text-slate-900 border-slate-200"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                {subtitle}
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl">
                {title}
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300">
                {description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-slate-300">
                <a
                  href="tel:+353899660987"
                  className="flex items-center gap-2 font-medium text-emerald-300 hover:text-emerald-200 transition"
                >
                  <span>📞</span> +353 89 966 0987
                </a>
                <a
                  href="mailto:info@rkandassociate.com"
                  className="flex items-center gap-2 hover:text-white transition"
                >
                  <span>✉️</span> info@rkandassociate.com
                </a>
                <span className="hidden sm:inline text-slate-500">&bull;</span>
                <span className="hidden sm:inline text-slate-400">
                  📍 Bracetown Business Park, Dublin
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-500 hover:scale-[1.02] text-center"
              >
                Contact Us &rarr;
              </Link>
              <BookOnlineButton className="inline-flex items-center justify-center rounded-xl border border-slate-600 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 hover:border-slate-400 text-center">
                Schedule Consultation
              </BookOnlineButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
