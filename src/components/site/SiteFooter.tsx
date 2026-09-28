import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-base font-bold text-white">
                RK
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                RK &amp; Associates
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Dedicated to providing top-notch accountancy services, strategic tax planning,
              and expert business advisory tailored for small businesses, startups, and freelancers.
            </p>
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Contact Directly
              </p>
              <a
                href="tel:+353899660987"
                className="mt-1 block text-sm font-medium text-white hover:text-emerald-400 transition"
              >
                +353 89 966 0987
              </a>
              <a
                href="mailto:info@rkandassociate.com"
                className="block text-sm text-slate-400 hover:text-white transition"
              >
                info@rkandassociate.com
              </a>
            </div>
          </div>

          {/* Our Services */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white">
              Our Services
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/service-page/bookkeeping-service" className="hover:text-emerald-400 transition">
                  Bookkeeping Service ($150)
                </Link>
              </li>
              <li>
                <Link href="/service-page/payroll-processing" className="hover:text-emerald-400 transition">
                  Payroll Processing ($120)
                </Link>
              </li>
              <li>
                <Link href="/service-page/tax-consultation" className="hover:text-emerald-400 transition">
                  Tax Consultation ($100)
                </Link>
              </li>
              <li>
                <Link href="/our-services" className="hover:text-emerald-400 transition">
                  Financial Reconciliation
                </Link>
              </li>
              <li>
                <Link href="/our-services" className="hover:text-emerald-400 transition">
                  Personalized Consultation
                </Link>
              </li>
              <li>
                <Link href="/book-online" className="font-medium text-emerald-400 hover:text-emerald-300 transition">
                  Book Online &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Blog */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white">
              Company &amp; Insights
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/about-us" className="hover:text-emerald-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/our-services" className="hover:text-emerald-400 transition">
                  All Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-emerald-400 transition">
                  Blog &amp; Knowledge Hub
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-emerald-400 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-emerald-400 transition">
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Offices & Working Hours */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white">
              Office Locations
            </p>
            <div className="mt-4 text-xs leading-relaxed text-slate-400 space-y-3">
              <div>
                <span className="font-semibold text-slate-200">Main Office:</span>
                <p>Bracetown Business Park, Clonee, Dublin, D15 YN2P</p>
              </div>
              <div>
                <span className="font-semibold text-slate-200">Registered Office:</span>
                <p>Saint Kevin&apos;s, Dublin 8, D02 XE80, Ireland</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="font-semibold text-slate-200">Working Hours:</span>
                <p>Mon &ndash; Fri: 8:00 AM &ndash; 6:00 PM</p>
                <p>Saturday: 9:00 AM &ndash; 1:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Powered by RK &amp; Associates. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-400 transition">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
