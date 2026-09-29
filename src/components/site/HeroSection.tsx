import Image from "next/image";
import Link from "next/link";
import { BookOnlineButton } from "@/components/site/BookOnlineButton";

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroCTA {
  label: string;
  href?: string;
  isBooking?: boolean;
  variant?: "primary" | "secondary" | "ghost";
}

interface HeroSectionProps {
  /** Eyebrow badge text (e.g. "DUBLIN, IRELAND • CHARTERED ADVISORY") */
  badge?: string;
  /** Main h1 headline */
  headline: string;
  /** Sub-headline paragraph */
  subheadline: string;
  /** Up to 3 CTA buttons */
  ctas?: HeroCTA[];
  /** Stats shown bare below CTAs */
  stats?: HeroStat[];
  /** Background image path (public/images/) */
  imageSrc: string;
  imageAlt: string;
  /** Optional: extra gradient direction/colours override */
  gradientClass?: string;
}

export function HeroSection({
  badge,
  headline,
  subheadline,
  ctas = [],
  stats = [],
  imageSrc,
  imageAlt,
  gradientClass,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      {/* ── Full-bleed Background Image ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-cover object-center"
        />
        {/* Multi-layer gradient scrim for cinematic depth */}
        <div
          className={
            gradientClass ??
            "absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/70 to-slate-950/95"
          }
        />
        {/* Left-to-right dark bleed for large screens */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/60" />
        {/* Radial emerald glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(16,185,129,0.18),transparent)]" />
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 lg:py-32 text-center flex flex-col items-center gap-8">

        {/* Badge */}
        {badge && (
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-1.5 text-[11px] font-bold tracking-widest text-emerald-300 backdrop-blur-md uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {badge}
          </span>
        )}

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl">
          {headline}
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
          {subheadline}
        </p>

        {/* CTA Buttons */}
        {ctas.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4">
            {ctas.map((cta, i) => {
              if (cta.isBooking) {
                return (
                  <BookOnlineButton
                    key={i}
                    className={ctaClass(cta.variant ?? (i === 0 ? "primary" : "secondary"))}
                  >
                    {cta.label}
                  </BookOnlineButton>
                );
              }
              if (cta.href) {
                return (
                  <Link key={i} href={cta.href} className={ctaClass(cta.variant ?? (i === 0 ? "primary" : "secondary"))}>
                    {cta.label}
                  </Link>
                );
              }
              return null;
            })}
          </div>
        )}

        {/* ── Stats — bare, no container ── */}
        {stats.length > 0 && (
          <div className="mt-4 pt-8 border-t border-white/10 w-full grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-8">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${i % 2 === 0 ? "text-emerald-400" : "text-white"}`}>
                  {stat.value}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center leading-tight">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ctaClass(variant: "primary" | "secondary" | "ghost") {
  switch (variant) {
    case "primary":
      return "rounded-xl bg-emerald-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/60 transition hover:bg-emerald-500 hover:scale-[1.01]";
    case "secondary":
      return "rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-7 py-3.5 text-sm font-bold text-emerald-300 backdrop-blur-md transition hover:bg-emerald-500/20 hover:border-emerald-400";
    case "ghost":
    default:
      return "rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-md transition hover:bg-white/10 hover:text-white";
  }
}
