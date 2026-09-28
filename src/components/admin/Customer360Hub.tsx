"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Customer,
  Quote,
  Invoice,
  ComplianceItem,
  StaffMember,
  Lead,
} from "@/lib/domain/types";
import { calculateTotals } from "@/lib/vat";
import { formatCents, formatDate, daysUntil } from "@/lib/format";

type TabType =
  | "overview"
  | "contacts"
  | "quotes"
  | "invoices"
  | "leads"
  | "compliance"
  | "timeline";

interface Customer360HubProps {
  customer: Customer;
  allCustomers: Customer[];
  quotes: Quote[];
  invoices: Invoice[];
  complianceItems: ComplianceItem[];
  staff: StaffMember[];
  leads: Lead[];
}

export function Customer360Hub({
  customer,
  allCustomers,
  quotes,
  invoices,
  complianceItems,
  staff,
  leads,
}: Customer360HubProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Temporary extra contact state for demonstration
  const [extraContacts, setExtraContacts] = useState<
    { name: string; role: string; email: string; phone: string; isPrimary?: boolean }[]
  >([]);
  const [newContact, setNewContact] = useState({
    name: "",
    role: "Director",
    email: "",
    phone: "",
  });

  const relationshipManager = staff.find((s) => s.id === customer.relationshipManagerId);

  // Financial calculations
  const totalInvoiced = invoices.reduce(
    (sum, i) => sum + calculateTotals(i.lineItems).totalCents,
    0
  );
  const totalCollected = invoices.reduce(
    (sum, i) => sum + i.payments.reduce((s, p) => s + p.amountCents, 0),
    0
  );
  const outstanding = totalInvoiced - totalCollected;

  const paidInvoicesCount = invoices.filter((i) => i.status === "paid").length;
  const overdueInvoices = invoices.filter((i) => i.status === "overdue");
  const overdueBalance = overdueInvoices.reduce(
    (sum, i) =>
      sum +
      (calculateTotals(i.lineItems).totalCents -
        i.payments.reduce((s, p) => s + p.amountCents, 0)),
    0
  );

  const openQuotes = quotes.filter((q) => q.status === "sent" || q.status === "draft");
  const openPipelineValue = openQuotes.reduce(
    (sum, q) => sum + calculateTotals(q.lineItems).totalCents,
    0
  );

  // Activity timeline
  type TimelineEntry = {
    id: string;
    date: string;
    title: string;
    description?: string;
    type: "quote" | "invoice" | "payment" | "compliance";
    status?: string;
  };

  const timeline: TimelineEntry[] = [
    ...quotes.map((q) => ({
      id: `q-${q.id}`,
      date: q.createdAt,
      title: `Quote ${q.quoteNumber} issued`,
      description: `${q.lineItems.length} line items &bull; Total ${formatCents(calculateTotals(q.lineItems).totalCents)}`,
      type: "quote" as const,
      status: q.status,
    })),
    ...invoices.map((i) => ({
      id: `i-${i.id}`,
      date: i.createdAt,
      title: `Invoice ${i.invoiceNumber} created`,
      description: `Due ${formatDate(i.dueDate)} &bull; ${formatCents(calculateTotals(i.lineItems).totalCents)}`,
      type: "invoice" as const,
      status: i.status,
    })),
    ...invoices.flatMap((i) =>
      i.payments.map((p) => ({
        id: `p-${p.id}`,
        date: p.date,
        title: `Payment received for ${i.invoiceNumber}`,
        description: `${formatCents(p.amountCents)} via ${p.method.replace("_", " ")} (Ref: ${p.reference})`,
        type: "payment" as const,
        status: "paid",
      }))
    ),
    ...complianceItems.map((c) => ({
      id: `c-${c.id}`,
      date: c.dueDate,
      title: `Statutory filing: ${c.obligationType}`,
      description: `CRO / Revenue obligation &bull; Status: ${c.status.replace(/_/g, " ")}`,
      type: "compliance" as const,
      status: c.status,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Handle switching customer from dropdown
  function handleSelectCustomer(id: string) {
    if (id) {
      router.push(`/admin/customers/${id}`);
    }
  }

  function handleAddContact(e: React.FormEvent) {
    e.preventDefault();
    if (!newContact.name) return;
    setExtraContacts([...extraContacts, { ...newContact, isPrimary: false }]);
    setNewContact({ name: "", role: "Finance Officer", email: "", phone: "" });
    setContactModalOpen(false);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Top Header & Customer Selector Bar (Matching Customer360Hub layout) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-white font-bold text-sm">
              360°
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Customer 360° Hub
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Admin CRM View
            </span>
            <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded-md border border-slate-300">
              Currency: EUR (€) (Irish Entity &bull; Dublin)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Overarching picture connecting Leads, Quotes, Invoices, Compliance / CRO Tracker, and Activity Timeline.
          </p>
        </div>

        {/* Customer Selector Dropdown */}
        <div className="w-full md:w-80">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Select Customer
          </label>
          <div className="relative">
            <select
              value={customer.id}
              onChange={(e) => handleSelectCustomer(e.target.value)}
              aria-label="Select Customer"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-900 shadow-sm focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            >
              {allCustomers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.legalEntityName} ({c.clientCode})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Customer Banner Summary Card */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 rounded-2xl shadow-md p-6 text-white border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-md font-mono">
                {customer.clientCode}
              </span>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold px-3 py-1 rounded-md uppercase">
                {customer.entityType.replace(/_/g, " ")}
              </span>
              <span className="bg-slate-700/60 text-slate-200 border border-slate-600 text-xs font-semibold px-3 py-1 rounded-md">
                🇮🇪 Ireland (IE)
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  customer.status === "active"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}
              >
                {customer.status === "active" ? "Active Customer" : "Inactive"}
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
              {customer.legalEntityName}
            </h2>
            {customer.tradingName && (
              <p className="text-xs text-emerald-300 font-medium">
                Trading as: {customer.tradingName}
              </p>
            )}

            <div className="flex items-center gap-6 text-xs text-slate-300 flex-wrap pt-1">
              <div className="flex items-center gap-1.5 bg-blue-500/20 text-blue-200 border border-blue-500/30 px-2.5 py-1 rounded-md">
                <span>👤 RM:</span>
                <strong className="text-white">
                  {relationshipManager?.name ?? "Unassigned"}
                </strong>
              </div>
              <div className="flex items-center gap-1.5">
                <span>📍</span>
                <span>Dublin, Ireland</span>
              </div>
              {customer.taxRefNumber && (
                <div className="flex items-center gap-1.5">
                  <span>📄 Tax Ref:</span>
                  <span className="font-mono text-white">{customer.taxRefNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Toolbar Shortcuts */}
          <div className="flex flex-wrap items-center gap-2.5 lg:justify-end">
            <button
              type="button"
              onClick={() => setContactModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 border border-white/10 backdrop-blur"
            >
              <span>👥</span> Manage Contacts
            </button>
            <Link
              href={`/admin/quotes/new?customerId=${customer.id}`}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 border border-white/10 backdrop-blur"
            >
              <span>📄</span> Create Quote
            </Link>
            <Link
              href={`/admin/invoices/new?customerId=${customer.id}`}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5"
            >
              <span>➕</span> Create Invoice
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Executive KPI Scorecards Grid (6 Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Lifetime Revenue</span>
            <span className="text-blue-600 font-bold">€</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            {formatCents(totalInvoiced)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {invoices.length} invoices issued
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Collected Revenue</span>
            <span className="text-emerald-600">✓</span>
          </div>
          <div className="text-xl font-extrabold text-emerald-700">
            {formatCents(totalCollected)}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">
            {paidInvoicesCount} fully paid
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Outstanding Balance</span>
            <span className="text-amber-500 font-bold">!</span>
          </div>
          <div className="text-xl font-extrabold text-amber-700">
            {formatCents(outstanding)}
          </div>
          <div className="text-[11px] text-red-600 mt-1 font-semibold">
            {overdueBalance > 0
              ? `${formatCents(overdueBalance)} overdue`
              : "Zero overdue"}
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Open Pipeline</span>
            <span className="text-purple-600">📈</span>
          </div>
          <div className="text-xl font-extrabold text-purple-700">
            {formatCents(openPipelineValue)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {openQuotes.length} pending quotes
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Compliance Items</span>
            <span className="text-indigo-600">⚖️</span>
          </div>
          <div className="text-xl font-extrabold text-indigo-700">
            {complianceItems.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {complianceItems.filter((c) => c.status === "due_soon" || c.status === "overdue").length} attention required
          </div>
        </div>

        {/* Metric 6 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Risk &amp; CRO</span>
            <span className="text-teal-600">🛡️</span>
          </div>
          <div className="text-xl font-extrabold capitalize text-teal-800">
            {customer.riskRating}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 capitalize">
            RBO: {customer.rboStatus?.replace(/_/g, " ") ?? "N/A"}
          </div>
        </div>
      </div>

      {/* 4. Tab Navigation & Content Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tab Headers */}
        <div className="border-b border-slate-200 bg-slate-50 px-4 pt-3 flex items-center gap-1 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: "🏢" },
            {
              id: "contacts",
              label: `Contacts (${1 + extraContacts.length})`,
              icon: "👥",
            },
            { id: "quotes", label: `Quotes (${quotes.length})`, icon: "📄" },
            {
              id: "invoices",
              label: `Invoices & Payments (${invoices.length})`,
              icon: "💶",
            },
            { id: "leads", label: `Leads (${leads.length})`, icon: "🎯" },
            {
              id: "compliance",
              label: `Compliance / CRO (${complianceItems.length})`,
              icon: "⚖️",
            },
            {
              id: "timeline",
              label: `Activity Timeline (${timeline.length})`,
              icon: "⏱️",
            },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 whitespace-nowrap ${
                  isActive
                    ? "border-emerald-600 text-emerald-800 bg-white shadow-xs"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Panels */}
        <div className="p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card A: Company & Tax Details */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <span>🏢</span> Company &amp; Statutory Details
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-500">Legal Entity Name:</span>
                    <div className="font-bold text-slate-900 text-sm">
                      {customer.legalEntityName}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-500">CRO Number:</span>
                      <div className="font-semibold text-slate-800">
                        {customer.croNumber ?? "N/A (Sole Trader)"}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Tax Reference:</span>
                      <div className="font-semibold text-slate-800 font-mono">
                        {customer.taxRefNumber ?? "—"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-500">VAT Registration:</span>
                      <div className="font-semibold text-slate-800 font-mono">
                        {customer.vatNumber ?? "Not registered"}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Employer PAYE:</span>
                      <div className="font-semibold text-slate-800 font-mono">
                        {customer.employerPayeNumber ?? "—"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-500">RBO Beneficial Ownership:</span>
                      <div className="font-semibold text-slate-800 capitalize">
                        {customer.rboStatus?.replace(/_/g, " ") ?? "Not required"}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Payment Terms:</span>
                      <div className="font-semibold text-slate-800">30 Days (Standard)</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-500 block mb-1">Registered Address:</span>
                    <div className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <div>Saint Kevin&apos;s, Dublin 8</div>
                      <div>D02 XE80, Ireland</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card B: Primary Contact Person */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>👥</span> Primary Contact Person
                  </h3>
                  <button
                    type="button"
                    onClick={() => setContactModalOpen(true)}
                    className="text-xs text-emerald-800 font-semibold hover:underline"
                  >
                    + Add Contact
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-start gap-3">
                    <div className="w-9 h-9 bg-emerald-700 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {customer.legalEntityName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        {customer.entityType === "individual"
                          ? customer.legalEntityName
                          : "Primary Executive Officer"}
                      </div>
                      <div className="text-emerald-800 font-medium">
                        {customer.entityType === "individual" ? "Principal" : "Managing Director"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2 text-slate-700">
                      <span>✉️</span>
                      <span className="font-medium">contact@{customer.clientCode.toLowerCase()}.ie</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <span>📞</span>
                      <span>+353 1 896 4000</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <span>📍</span>
                      <span>Dublin, Ireland</span>
                    </div>
                  </div>

                  {extraContacts.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <p className="text-[11px] font-bold uppercase text-slate-500">
                        Additional Contacts:
                      </p>
                      {extraContacts.map((c, i) => (
                        <div key={i} className="p-2 bg-slate-50 rounded border border-slate-200">
                          <span className="font-bold text-slate-900">{c.name}</span> &bull;{" "}
                          <span className="text-slate-600">{c.role}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card C: Activity Log Preview */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>⏱️</span> Recent Activities
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("timeline")}
                    className="text-xs text-emerald-800 font-semibold hover:underline"
                  >
                    View All ({timeline.length})
                  </button>
                </div>

                {timeline.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    No recent activities recorded.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {timeline.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-start gap-2.5 text-xs">
                        <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-800">{item.title}</div>
                          {item.description && (
                            <div
                              className="text-slate-500 text-[11px]"
                              dangerouslySetInnerHTML={{ __html: item.description }}
                            />
                          )}
                          <div className="text-[10px] text-slate-400">
                            {formatDate(item.date)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CONTACTS */}
          {activeTab === "contacts" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Associated Customer Contacts ({1 + extraContacts.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setContactModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition"
                >
                  + Add Contact
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Primary contact */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        {customer.entityType === "individual"
                          ? customer.legalEntityName
                          : "Primary Executive Officer"}
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                          Primary
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">Managing Director</div>
                    </div>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                      Executive
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div>✉️ contact@{customer.clientCode.toLowerCase()}.ie</div>
                    <div>📞 +353 1 896 4000</div>
                  </div>
                </div>

                {/* Additional contacts */}
                {extraContacts.map((c, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{c.name}</div>
                        <div className="text-xs text-slate-500">{c.role}</div>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      {c.email && <div>✉️ {c.email}</div>}
                      {c.phone && <div>📞 {c.phone}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: QUOTES */}
          {activeTab === "quotes" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Customer Quotes ({quotes.length})
                </h3>
                <Link
                  href={`/admin/quotes/new?customerId=${customer.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition"
                >
                  + Create Quote
                </Link>
              </div>

              {quotes.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                  No quotes generated for this customer yet.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Quote #</th>
                        <th className="px-4 py-3">Line Items</th>
                        <th className="px-4 py-3">Total Value (€)</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Valid Until</th>
                        <th className="px-4 py-3">Created</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {quotes.map((q) => {
                        const totals = calculateTotals(q.lineItems);
                        return (
                          <tr key={q.id} className="hover:bg-slate-50 transition">
                            <td className="px-4 py-3 font-bold text-slate-900">{q.quoteNumber}</td>
                            <td className="px-4 py-3 text-slate-600">{q.lineItems.length} items</td>
                            <td className="px-4 py-3 font-extrabold text-emerald-800">
                              {formatCents(totals.totalCents)}
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
                                {q.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-500">{formatDate(q.validUntil)}</td>
                            <td className="px-4 py-3 text-slate-500">{formatDate(q.createdAt)}</td>
                            <td className="px-4 py-3 text-right">
                              <Link
                                href={`/admin/quotes/${q.id}`}
                                className="text-emerald-700 hover:underline font-semibold"
                              >
                                View &rarr;
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: INVOICES & PAYMENTS */}
          {activeTab === "invoices" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Invoices &amp; Billing History ({invoices.length})
                </h3>
                <Link
                  href={`/admin/invoices/new?customerId=${customer.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition"
                >
                  + Create Invoice
                </Link>
              </div>

              {invoices.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                  No invoices issued for this customer yet.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Invoice #</th>
                        <th className="px-4 py-3">Issue Date</th>
                        <th className="px-4 py-3">Due Date</th>
                        <th className="px-4 py-3">Net</th>
                        <th className="px-4 py-3">VAT</th>
                        <th className="px-4 py-3">Total (€)</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {invoices.map((inv) => {
                        const totals = calculateTotals(inv.lineItems);
                        return (
                          <tr key={inv.id} className="hover:bg-slate-50 transition">
                            <td className="px-4 py-3 font-bold text-slate-900">{inv.invoiceNumber}</td>
                            <td className="px-4 py-3 text-slate-600">{formatDate(inv.issueDate)}</td>
                            <td className="px-4 py-3 text-slate-600">{formatDate(inv.dueDate)}</td>
                            <td className="px-4 py-3 text-slate-600">{formatCents(totals.netCents)}</td>
                            <td className="px-4 py-3 text-slate-600">{formatCents(totals.vatCents)}</td>
                            <td className="px-4 py-3 font-extrabold text-slate-900">
                              {formatCents(totals.totalCents)}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  inv.status === "paid"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : inv.status === "overdue"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {inv.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Link
                                href={`/admin/invoices/${inv.id}`}
                                className="text-emerald-700 hover:underline font-semibold"
                              >
                                View &rarr;
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Recorded Payment Transactions */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Recorded Payment Transactions
                </h4>
                {invoices.flatMap((i) => i.payments).length === 0 ? (
                  <p className="text-xs text-slate-500">No payment transactions recorded.</p>
                ) : (
                  <div className="space-y-2">
                    {invoices.flatMap((i) =>
                      i.payments.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900">
                              {formatCents(p.amountCents)}
                            </span>{" "}
                            &bull; via <span className="capitalize">{p.method.replace("_", " ")}</span>
                            <span className="text-slate-500 ml-2 font-mono">(Ref: {p.reference})</span>
                          </div>
                          <span className="text-slate-500">{formatDate(p.date)}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: LEADS */}
          {activeTab === "leads" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  CRM Leads Associated ({leads.length})
                </h3>
                <Link
                  href="/admin/leads"
                  className="text-xs text-emerald-800 font-semibold hover:underline"
                >
                  Manage All Leads &rarr;
                </Link>
              </div>

              {leads.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                  No matching leads recorded for this customer.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Lead Name</th>
                        <th className="px-4 py-3">Company</th>
                        <th className="px-4 py-3">Service Interest</th>
                        <th className="px-4 py-3">Source</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {leads.map((l) => (
                        <tr key={l.id} className="hover:bg-slate-50 transition">
                          <td className="px-4 py-3 font-bold text-slate-900">{l.name}</td>
                          <td className="px-4 py-3 text-slate-600">{l.companyName || "—"}</td>
                          <td className="px-4 py-3 text-slate-600">
                            {l.serviceInterest.join(", ")}
                          </td>
                          <td className="px-4 py-3 text-slate-500 capitalize">{l.source}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
                              {l.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-500">{formatDate(l.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: COMPLIANCE / CRO */}
          {activeTab === "compliance" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Statutory Compliance &amp; CRO Tracker ({complianceItems.length})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Companies Registration Office (CRO) and Irish Revenue filing obligations.
                  </p>
                </div>
              </div>

              {complianceItems.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                  No upcoming compliance obligations on file.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Obligation Type</th>
                        <th className="px-4 py-3">Agency</th>
                        <th className="px-4 py-3">Due Date</th>
                        <th className="px-4 py-3">Days Remaining</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {complianceItems.map((item) => {
                        const days = daysUntil(item.dueDate);
                        return (
                          <tr key={item.id} className="hover:bg-slate-50 transition">
                            <td className="px-4 py-3 font-bold text-slate-900">
                              {item.obligationType === "B1"
                                ? "Form B1 (Annual Return)"
                                : item.obligationType === "CT1"
                                ? "Corporation Tax (CT1)"
                                : item.obligationType === "VAT3"
                                ? "Bi-Monthly VAT3 Return"
                                : item.obligationType === "Form11"
                                ? "Income Tax (Form 11)"
                                : item.obligationType}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {item.obligationType === "B1" || item.obligationType === "RBO"
                                ? "CRO"
                                : "Revenue Ireland"}
                            </td>
                            <td className="px-4 py-3 text-slate-600">{formatDate(item.dueDate)}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`font-semibold ${
                                  days < 0
                                    ? "text-red-600"
                                    : days <= 14
                                    ? "text-amber-600"
                                    : "text-slate-600"
                                }`}
                              >
                                {days < 0 ? `${Math.abs(days)}d overdue` : `${days} days`}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  item.status === "filed"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : item.status === "overdue" || item.status === "at_risk_missing_document"
                                    ? "bg-red-100 text-red-800"
                                    : item.status === "due_soon"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-slate-100 text-slate-800"
                                }`}
                              >
                                {item.status.replace(/_/g, " ")}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: TIMELINE */}
          {activeTab === "timeline" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Unified Chronological Activity Feed ({timeline.length})
              </h3>

              {timeline.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                  No activity recorded yet.
                </div>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {timeline.map((entry) => (
                    <div key={entry.id} className="relative group">
                      <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-600 shadow-xs" />
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 transition group-hover:border-emerald-600 group-hover:bg-white">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{entry.title}</span>
                          <span className="text-[11px] text-slate-500">{formatDate(entry.date)}</span>
                        </div>
                        {entry.description && (
                          <p
                            className="mt-1 text-xs text-slate-600"
                            dangerouslySetInnerHTML={{ __html: entry.description }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      {contactModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Customer Contact</h3>
              <button
                type="button"
                onClick={() => setContactModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddContact} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Job Title / Role</label>
                <input
                  type="text"
                  value={newContact.role}
                  onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setContactModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-800 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
