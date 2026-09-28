"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { STAFF_ROLE_LABELS, useAdminSession } from "@/lib/auth/session";
import type { StaffRole } from "@/lib/domain/types";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/customers", label: "Customers (360)" },
  { href: "/admin/quotes", label: "Quotes" },
  { href: "/admin/invoices", label: "Invoices" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { role, setRole } = useAdminSession();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-6 md:block">
        <Link href="/admin" className="text-lg font-bold text-emerald-800">
          RK &amp; Associate
        </Link>
        <p className="mt-1 text-xs text-slate-400">Admin Portal</p>
        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
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
          <p className="text-sm text-slate-500">
            Practice back-office &mdash; CRM, Commercial Ops &amp; Service Desk (Phase 1 preview)
          </p>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Viewing as:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as StaffRole)}
              className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
            >
              {Object.entries(STAFF_ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
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
