"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef, type ReactNode } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  ShieldCheck,
  Shield,
  Inbox,
  ArrowLeft,
  Building2,
  Bot,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Receipt,
  TrendingUp,
  Wallet,
  BarChart3,
} from "lucide-react";
import { STAFF_ROLE_LABELS, useAdminSession } from "@/lib/auth/session";
import type { StaffRole } from "@/lib/domain/types";
import { useCompanyContext } from "@/contexts/CompanyContext";
import { useToast } from "@/components/ui/ToastProvider";
import CompanySelector from "@/components/ui/CompanySelector";
import {
  AgentCopilotCenter,
  useAgentCopilot,
  copilotSettingsService,
} from "@/components/admin/AgentCopilotCenter";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isCopilot?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { href: "/admin", label: "Executive Dashboard", icon: LayoutDashboard },
      { href: "/admin/copilot", label: "AI Copilot Center", icon: Bot, isCopilot: true },
    ],
  },
  {
    title: "CRM & Clients",
    items: [
      { href: "/admin/leads", label: "Leads", icon: Users },
      { href: "/admin/customers", label: "Customers (360)", icon: Building2 },
      { href: "/admin/documents", label: "Document Inbox", icon: Inbox },
      { href: "/admin/quotes", label: "Quotes & Proposals", icon: FileText },
      { href: "/admin/contracts", label: "Contracts (CLM)", icon: ShieldCheck },
    ],
  },
  {
    title: "Billing & Treasury",
    items: [
      { href: "/admin/invoices", label: "Invoices & Billing", icon: Receipt },
      { href: "/admin/income", label: "Income Records", icon: TrendingUp },
    ],
  },
  {
    title: "Finance & Cost Control",
    items: [
      { href: "/admin/expenses", label: "Expense Management", icon: Wallet },
      { href: "/admin/finance", label: "Financial Health & P&L", icon: BarChart3 },
    ],
  },
  {
    title: "System & Governance",
    items: [
      { href: "/admin/roles", label: "Roles & Access Control", icon: Shield },
    ],
  },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setRole } = useAdminSession();
  const { companies, selectedCompany, selectCompany } = useCompanyContext();
  const { showWarning } = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAgentCenterOpen, setIsAgentCenterOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAiAgentsEnabled, setIsAiAgentsEnabled] = useState<boolean>(() =>
    copilotSettingsService.isModuleEnabled()
  );

  const { insights, scan } = useAgentCopilot(selectedCompany?.id);
  const hasAutoNotifiedRef = useRef<boolean>(false);

  // Restore sidebar collapsed preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rka_sidebar_collapsed");
      if (saved !== null) {
        setIsSidebarCollapsed(saved === "true");
      }
    } catch {
      // ignore in environments without localStorage
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("rka_sidebar_collapsed", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Keyboard shortcut Ctrl+B / Cmd+B to toggle left side pane
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

  // Sync settings when modified
  useEffect(() => {
    const unsub = copilotSettingsService.subscribe((settings) => {
      setIsAiAgentsEnabled(settings.enabled);
    });
    return unsub;
  }, []);

  // Automatic notification when critical operational anomalies are detected
  useEffect(() => {
    if (insights.length > 0 && !hasAutoNotifiedRef.current) {
      hasAutoNotifiedRef.current = true;
      const criticalCount = insights.filter(
        (i) => i.severity === "critical" || i.severity === "high"
      ).length;
      if (criticalCount > 0) {
        showWarning(
          `Autonomous AI Agent flagged ${criticalCount} priority item${
            criticalCount > 1 ? "s" : ""
          } (tax deadlines / collections / deal expirations). Click AI Agents to review and execute suggested actions.`,
          "Proactive AI Agent Alert"
        );
      }
    }
  }, [insights, showWarning]);

  const activeAlertCount = insights.length;

  return (
    <div className="flex min-h-screen bg-slate-50 w-full overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col justify-between transition-all duration-200 ease-in-out ${
          isSidebarCollapsed ? "w-[68px] p-3" : "w-64 p-4"
        }`}
      >
        <div className="flex-1 overflow-y-auto pr-1">
          {/* Header & Collapse toggle */}
          {isSidebarCollapsed ? (
            <div className="flex flex-col items-center gap-2 pb-2">
              <Link
                href="/admin"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-800 text-white font-black text-xs shadow-xs hover:bg-emerald-900 transition"
                title="RK &amp; Associate Back-Office Admin"
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
            <div className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between gap-2">
                <Link href="/admin" className="text-base font-bold text-emerald-800 flex items-center gap-2 min-w-0">
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
              <p className="mt-1 text-xs text-slate-400 truncate">Chartered Accountants &bull; Admin</p>
            </div>
          )}

          {/* Categorized Nav items */}
          <nav className={`space-y-4 ${isSidebarCollapsed ? "mt-3" : "mt-4"}`}>
            {navSections.map((section, idx) => (
              <div key={section.title}>
                {isSidebarCollapsed ? (
                  idx > 0 && <div className="my-2 border-t border-slate-100" />
                ) : (
                  <p className="px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {section.title}
                  </p>
                )}

                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active =
                      pathname === item.href ||
                      (item.href !== "/admin" && pathname?.startsWith(item.href));

                    if (isSidebarCollapsed) {
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          title={
                            item.isCopilot && activeAlertCount > 0
                              ? `${item.label} (${activeAlertCount} alerts)`
                              : item.label
                          }
                          className={`relative flex items-center justify-center rounded-lg p-2.5 text-sm font-medium transition group ${
                            active
                              ? "bg-emerald-50 text-emerald-800 font-semibold"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <Icon className={`w-5 h-5 shrink-0 ${active ? "text-emerald-700" : "text-slate-400 group-hover:text-slate-600"}`} />
                          {item.isCopilot && activeAlertCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
                            </span>
                          )}
                        </Link>
                      );
                    }

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                          active
                            ? "bg-emerald-50 text-emerald-800 font-semibold"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${active ? "text-emerald-700" : "text-slate-400"}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.isCopilot && activeAlertCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 shrink-0">
                            {activeAlertCount}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-200 pt-3 mt-3 shrink-0">
          {isSidebarCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => setIsAgentCenterOpen(true)}
                title="Copilot Slide-Over"
                aria-label="Copilot Slide-Over"
                className="relative flex items-center justify-center p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition"
              >
                <Bot className="w-5 h-5 text-indigo-600" />
                {activeAlertCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                )}
              </button>
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
            <div className="space-y-2">
              <button
                onClick={() => setIsAgentCenterOpen(true)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition"
              >
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-600" />
                  <span>Copilot Center</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {activeAlertCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                      {activeAlertCount}
                    </span>
                  )}
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                </div>
              </button>
              <Link
                href="/"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition px-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to public site
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer Backdrop & Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white p-5 shadow-2xl flex flex-col justify-between z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="font-bold text-emerald-800 text-base">RK &amp; Associate</span>
                  <p className="text-[11px] text-slate-400">Admin Practice Portal</p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categorized Nav items in Mobile Drawer */}
              <nav className="mt-4 space-y-4">
                {navSections.map((section) => (
                  <div key={section.title}>
                    <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      {section.title}
                    </p>
                    <div className="space-y-0.5">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const active =
                          pathname === item.href ||
                          (item.href !== "/admin" && pathname?.startsWith(item.href));

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition ${
                              active
                                ? "bg-emerald-50 text-emerald-800 font-semibold"
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className={`w-4 h-4 ${active ? "text-emerald-700" : "text-slate-400"}`} />
                              <span>{item.label}</span>
                            </div>
                            {item.isCopilot && activeAlertCount > 0 && (
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                                {activeAlertCount}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            <div className="border-t border-slate-200 pt-4 mt-4 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAgentCenterOpen(true);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition"
              >
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-600" />
                  <span>Launch AI Copilot</span>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              </button>

              <label className="block text-xs text-slate-500">
                Viewing as:
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as StaffRole)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs bg-white"
                >
                  {Object.entries(STAFF_ROLE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to public site
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
        {/* Top Header */}
        <header className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 py-3 sm:py-3.5 gap-3">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Left Pane Toggle shortcut button */}
            <button
              onClick={toggleSidebar}
              className="hidden md:flex p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
              title={isSidebarCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
              aria-label="Toggle navigation sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-700 hidden sm:block">
                Practice Back-Office &mdash; CRM, Commercial Ops &amp; Financial Treasury Hub
              </p>
              <span className="font-bold text-emerald-800 text-sm sm:hidden">RK &amp; Associate</span>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Multi-tenant company selector */}
            {companies.length > 0 && (
              <div className="hidden lg:block">
                <CompanySelector
                  companies={companies}
                  selectedId={selectedCompany?.id ?? null}
                  onChange={selectCompany}
                />
              </div>
            )}

            {/* Autonomous AI Agents Trigger Button */}
            {isAiAgentsEnabled ? (
              <button
                onClick={() => setIsAgentCenterOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all"
                title="Open Autonomous AI Agents Center"
              >
                <Bot className="w-4 h-4" />
                <span className="hidden sm:inline">AI Agents</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                {activeAlertCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-white text-indigo-700">
                    {activeAlertCount}
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={() => setIsAgentCenterOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all border border-slate-200"
                title="Autonomous AI Agents Module disabled for this client (Unpaid). Click to review entitlement."
              >
                <Bot className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">AI Agents</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-200 text-slate-600">
                  OFF
                </span>
              </button>
            )}

            {/* Role Switcher */}
            <label className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-slate-500 hidden sm:inline">Role:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as StaffRole)}
                className="rounded-lg border border-slate-300 px-2 py-1 sm:py-1.5 text-xs sm:text-sm bg-white"
              >
                {Object.entries(STAFF_ROLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-6 w-full max-w-full overflow-x-auto min-w-0">
          {children}
        </main>
      </div>

      {/* Autonomous AI Agents Slide-over Drawer */}
      <AgentCopilotCenter
        isOpen={isAgentCenterOpen}
        onClose={() => setIsAgentCenterOpen(false)}
        companyId={selectedCompany?.id}
        onNavigateToEntity={(entityType: string) => {
          setIsAgentCenterOpen(false);
          if (entityType === "invoice") router.push("/admin/invoices");
          else if (entityType === "income") router.push("/admin/income");
          else if (entityType === "expense") router.push("/admin/expenses");
          else if (entityType === "finance") router.push("/admin/finance");
          else if (entityType === "quote") router.push("/admin/quotes");
          else if (entityType === "contract") router.push("/admin/contracts");
          else if (entityType === "customer" || entityType === "customer-360")
            router.push("/admin/customers");
          else if (entityType === "roles") router.push("/admin/roles");
        }}
      />
    </div>
  );
}
