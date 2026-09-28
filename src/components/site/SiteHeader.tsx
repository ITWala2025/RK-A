"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/our-services", label: "Our Services" },
  { href: "/book-online", label: "Book Online" },
  { href: "/blog", label: "Blog" },
  { href: "/contact-us", label: "Contact Us" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
      {/* Top Banner with direct phone call */}
      <div className="bg-slate-900 px-6 py-1.5 text-xs text-slate-300">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
            <span>Chartered Accountancy &amp; Tax Solutions &bull; Dublin, Ireland</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+353899660987"
              className="font-medium text-emerald-400 transition hover:text-emerald-300"
            >
              TEL: +353 89 966 0987
            </a>
            <span className="hidden text-slate-600 sm:inline">&bull;</span>
            <a
              href="mailto:info@rkandassociate.com"
              className="hidden text-slate-300 transition hover:text-white sm:inline"
            >
              info@rkandassociate.com
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-800 text-lg font-black tracking-tight text-white shadow-sm transition group-hover:bg-emerald-700">
            RK
          </div>
          <div>
            <span className="block text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-800 transition">
              RK &amp; Associates
            </span>
            <span className="block text-xs font-medium text-slate-500">
              Accountancy &amp; Advisory
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href) ||
                  (link.href === "/about-us" && pathname.startsWith("/about")) ||
                  (link.href === "/our-services" &&
                    (pathname.startsWith("/services") || pathname.startsWith("/service-page"))) ||
                  (link.href === "/contact-us" && pathname.startsWith("/contact"));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition ${
                  isActive
                    ? "text-emerald-800 font-semibold"
                    : "text-slate-600 hover:text-emerald-800"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Actions */}
        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/portal"
            className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition"
          >
            Client Portal
          </Link>
          <Link
            href="/book-online"
            className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            Book Online
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/book-online"
            className="rounded-lg bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            Book
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 shadow-lg lg:hidden">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-700 hover:text-emerald-800"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/portal"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700"
              >
                Client Login / Portal
              </Link>
              <a
                href="tel:+353899660987"
                className="text-center rounded-lg bg-slate-900 py-2 text-sm font-medium text-emerald-400"
              >
                Call: +353 89 966 0987
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
