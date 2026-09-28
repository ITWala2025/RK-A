"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useClientSession } from "@/lib/auth/session";

const navItems = [
  { href: "/portal", label: "Dashboard" },
  { href: "/portal/documents", label: "Documents" },
  { href: "/portal/invoices", label: "Invoices" },
];

export function PortalShell({
  children,
  customers,
}: {
  children: ReactNode;
  customers: { id: string; legalEntityName: string }[];
}) {
  const pathname = usePathname();
  const { customerId, setCustomerId } = useClientSession();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-6 md:block">
        <Link href="/portal" className="text-lg font-bold text-emerald-800">
          RK &amp; Associate
        </Link>
        <p className="mt-1 text-xs text-slate-400">Client Portal</p>
        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/portal" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                  active ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-10 border-t border-slate-200 pt-4">
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-600">
            &larr; Back to public site
          </Link>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <p className="text-sm text-slate-500">Client self-service (Phase 1 preview)</p>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Signed in as:</span>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.legalEntityName}
                </option>
              ))}
            </select>
          </label>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
