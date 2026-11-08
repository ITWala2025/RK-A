"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, type ReactNode } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  DollarSign,
  Folder,
  FileText,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useClientSession } from "@/lib/auth/session";

const navItems = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/directors", label: "Directors & Officers", icon: Users },
  { href: "/portal/finances", label: "Income & Expenses", icon: DollarSign },
  { href: "/portal/documents", label: "Documents", icon: Folder },
  { href: "/portal/invoices", label: "Invoices", icon: FileText },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Restore sidebar collapsed preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rka_portal_sidebar_collapsed");
      if (saved !== null) {
        setIsSidebarCollapsed(saved === "true");
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("rka_portal_sidebar_collapsed", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Keyboard shortcut Ctrl+B / Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.tagName === "SELECT" ||
            target.isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 w-full overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col justify-between transition-all duration-200 ease-in-out ${isSidebarCollapsed ? "w-[68px] p-3" : "w-64 p-5"
          }`}
      >
        <div>
          {/* Header & Toggle */}
          {isSidebarCollapsed ? (
            <div className="flex flex-col items-center gap-2 pb-2">
              <Link
                href="/portal"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-800 text-white font-black text-xs shadow-xs hover:bg-emerald-900 transition"
                title="RK &amp; Associate Client Portal"
              >
                RK
              </Link>
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                title="Expand left side pane (Ctrl+B)"
                aria-label="Expand left side pane"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between gap-2">
                <Link href="/portal" className="text-base font-bold text-emerald-800 flex items-center gap-2 min-w-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-800 text-white font-black text-xs">
                    RK
                  </span>
                  <span className="truncate">RK &amp; Associate</span>
                </Link>
                <button
                  onClick={toggleSidebar}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition shrink-0"
                  title="Collapse left side pane (Ctrl+B)"
                  aria-label="Collapse left side pane"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-400 truncate">Client Portal</p>
            </div>
          )}

          {/* Navigation */}
          <nav className={`space-y-1 ${isSidebarCollapsed ? "mt-4" : "mt-6"}`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== "/portal" && pathname?.startsWith(item.href));

              if (isSidebarCollapsed) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.label}
                    className={`flex items-center justify-center rounded-lg p-2.5 text-sm font-medium transition group ${active
                        ? "bg-emerald-50 text-emerald-800 font-semibold"
                        : "text-slate-600 hover:bg-slate-100"
                      }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${active ? "text-emerald-700" : "text-slate-400 group-hover:text-slate-600"}`} />
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${active ? "bg-emerald-50 text-emerald-800 font-semibold" : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? "text-emerald-700" : "text-slate-400"}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-4">
          {isSidebarCollapsed ? (
            <div className="flex flex-col items-center">
              <Link
                href="/"
                title="Back to public site"
                aria-label="Back to public site"
                className="flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition">
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" /> Back to public site
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white p-5 shadow-2xl flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="font-bold text-emerald-800 text-base">RK &amp; Associate</span>
                  <p className="text-[11px] text-slate-400">Client Portal</p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-5 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href || (item.href !== "/portal" && pathname?.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${active
                          ? "bg-emerald-50 text-emerald-800 font-semibold"
                          : "text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? "text-emerald-700" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to public site
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
        <header className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 py-3 sm:py-4 gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={toggleSidebar}
              className="hidden md:inline-flex p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition items-center justify-center shrink-0"
              title={isSidebarCollapsed ? "Expand left side pane (Ctrl+B)" : "Collapse left side pane (Ctrl+B)"}
              aria-label={isSidebarCollapsed ? "Expand left side pane" : "Collapse left side pane"}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-slate-700" />
              ) : (
                <PanelLeftClose className="w-4 h-4 text-slate-700" />
              )}
            </button>

            <p className="text-sm text-slate-500 hidden sm:block">Client self-service portal</p>
          </div>

          <label className="flex items-center gap-2 text-xs sm:text-sm ml-auto">
            <span className="text-slate-500 hidden sm:inline">Signed in as:</span>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="rounded-lg border border-slate-300 px-2 py-1 sm:py-1.5 text-xs sm:text-sm bg-white"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.legalEntityName}
                </option>
              ))}
            </select>
          </label>
        </header>
        <main className="flex-1 p-3 sm:p-6 w-full max-w-full overflow-x-auto min-w-0">{children}</main>
      </div>
    </div>
  );
}
