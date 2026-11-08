"use client";

import React, { useState, useEffect, Suspense } from "react";

export const dynamic = "force-dynamic";
import Link from "next/link";
import {
  Inbox,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Clock,
  UserCheck,
  UserPlus,
  RefreshCw,
  Eye,
  Download,
  ShieldCheck,
  MessageSquare,
  Mail,
  Globe,
  Building2,
  Send,
  Plus,
  ChevronRight,
  Shield,
  FileCheck,
} from "lucide-react";
import { documentService } from "@/services/documentService";
import { invoiceService } from "@/services/invoiceService";
import type {
  CanonicalDocument,
  DocumentStatus,
  SourceChannel,
  DocumentCategoryType,
  DocumentAuditEvent,
} from "@/types/document";
import type { Customer } from "@/types/invoice";
import { useToast } from "@/components/ui/ToastProvider";

const STATUS_TABS: { id: DocumentStatus | "all"; label: string }[] = [
  { id: "all", label: "All Documents" },
  { id: "requires_review", label: "Requires Review" },
  { id: "ready", label: "Ready" },
  { id: "verified", label: "Verified" },
  { id: "received", label: "Received" },
  { id: "processing", label: "Processing" },
  { id: "rejected", label: "Rejected" },
  { id: "failed", label: "Failed" },
];

export default function AdminDocumentInboxPage() {
  const { showSuccess, showError, showInfo } = useToast();

  const [documents, setDocuments] = useState<CanonicalDocument[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<DocumentStatus | "all">("all");
  const [channelFilter, setChannelFilter] = useState<SourceChannel | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    requiresReview: 0,
    ready: 0,
    rejected: 0,
    byChannel: { portal: 0, email: 0, whatsapp: 0, admin: 0 },
  });

  // Assign Customer Modal
  const [assignModalDoc, setAssignModalDoc] = useState<CanonicalDocument | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [assignNotes, setAssignNotes] = useState("");
  const [assigning, setAssigning] = useState(false);

  // Review / Reject Modal
  const [rejectModalDoc, setRejectModalDoc] = useState<CanonicalDocument | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Audit Trail Modal
  const [auditDoc, setAuditDoc] = useState<CanonicalDocument | null>(null);
  const [auditTrail, setAuditTrail] = useState<DocumentAuditEvent[]>([]);

  // Simulation Modal
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [simChannel, setSimChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [simSender, setSimSender] = useState("+353871234567");
  const [simFileName, setSimFileName] = useState("Tax_Clearance_2026.pdf");
  const [simCategory, setSimCategory] = useState<DocumentCategoryType>("tax_returns");
  const [simTaxYear, setSimTaxYear] = useState("2026");
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeStatus, channelFilter, searchQuery]);

  async function loadData() {
    setLoading(true);
    try {
      const [docs, custList, docStats] = await Promise.all([
        documentService.listDocuments({
          status: activeStatus,
          channel: channelFilter,
          search: searchQuery,
        }),
        invoiceService.getCustomers({}, 1, 500).then((r) => r.data),
        documentService.getStats(),
      ]);
      setDocuments(docs);
      setCustomers(custList);
      setStats(docStats);
    } catch (err) {
      console.error("Failed to load documents", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAssignSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!assignModalDoc || !selectedCustomerId) return;
    setAssigning(true);
    try {
      await documentService.assignCustomer(
        assignModalDoc.id,
        selectedCustomerId,
        "Aoife Ryan (Partner)",
        assignNotes
      );
      showSuccess("Document assigned to customer successfully.");
      setAssignModalDoc(null);
      setSelectedCustomerId("");
      setAssignNotes("");
      await loadData();
    } catch (err: any) {
      showError(err?.message || "Failed to assign document");
    } finally {
      setAssigning(false);
    }
  }

  async function handleQuickVerify(doc: CanonicalDocument) {
    try {
      await documentService.verifyDocument(doc.id, "Aoife Ryan (Partner)");
      showSuccess(`Verified "${doc.document_name}"`);
      await loadData();
    } catch (err: any) {
      showError(err?.message || "Verification failed");
    }
  }

  async function handleRejectSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rejectModalDoc || !rejectReason.trim()) return;
    try {
      await documentService.rejectDocument(
        rejectModalDoc.id,
        rejectReason.trim(),
        "Aoife Ryan (Partner)"
      );
      showSuccess("Document rejected.");
      setRejectModalDoc(null);
      setRejectReason("");
      await loadData();
    } catch (err: any) {
      showError(err?.message || "Failed to reject document");
    }
  }

  function handleOpenAudit(doc: CanonicalDocument) {
    setAuditDoc(doc);
    const trail = documentService.getAuditTrail(doc.id);
    setAuditTrail(trail);
  }

  async function handleRunSimulation(e: React.FormEvent) {
    e.preventDefault();
    setSimulating(true);
    try {
      const newDoc = await documentService.ingestDocument({
        file: {
          name: simFileName.trim(),
          size: Math.floor(Math.random() * 450000) + 65000,
          mime_type: simFileName.endsWith(".pdf") ? "application/pdf" : "image/jpeg",
        },
        source_channel: simChannel,
        sender_identity: simSender.trim(),
        document_type: simCategory,
        tax_year: simTaxYear,
        source_id: `sim-${Date.now()}`,
      });

      if (newDoc.customer_id) {
        showSuccess(
          `Simulated document ingested! Deterministically matched to customer: ${newDoc.customer_name}`
        );
      } else {
        showInfo(
          `Simulated document ingested! No matching client found. Routed to Requires Review Inbox.`
        );
      }
      setSimulatorOpen(false);
      await loadData();
    } catch (err: any) {
      showError(err?.message || "Simulation failed");
    } finally {
      setSimulating(false);
    }
  }

  function getChannelBadge(channel: SourceChannel) {
    switch (channel) {
      case "whatsapp":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
          </span>
        );
      case "email":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            <Mail className="w-3.5 h-3.5" /> Email
          </span>
        );
      case "portal":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-300">
            <Globe className="w-3.5 h-3.5" /> Client Portal
          </span>
        );
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
            <Building2 className="w-3.5 h-3.5" /> Practice Back-Office
          </span>
        );
    }
  }

  function getStatusBadge(status: DocumentStatus) {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300">
            <CheckCircle className="w-3 h-3" /> Verified
          </span>
        );
      case "ready":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-300">
            <FileCheck className="w-3 h-3" /> Ready
          </span>
        );
      case "requires_review":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3 h-3" /> Requires Review
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-300">
            <Clock className="w-3 h-3 animate-spin" /> Processing
          </span>
        );
      case "received":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
            Received
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Inbox className="w-7 h-7 text-emerald-700" />
            Document Ingestion Inbox
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Centralized multi-channel document intake (Portal, Inbound Email &amp; WhatsApp Business Platform) with deterministic client identity matching &amp; audit logging.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSimulatorOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition"
          >
            <Send className="w-4 h-4" />
            Simulate Ingestion
          </button>
          <button
            onClick={loadData}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition"
            title="Refresh documents"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Ingested</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{stats.total}</p>
          <p className="mt-1 text-xs text-slate-400">
            WA: {stats.byChannel.whatsapp} • Email: {stats.byChannel.email} • Portal: {stats.byChannel.portal}
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs">
          <p className="text-xs font-medium text-amber-700 uppercase tracking-wider">Requires Review</p>
          <p className="mt-1 text-2xl font-bold text-amber-900">{stats.requiresReview}</p>
          <p className="mt-1 text-xs text-amber-600">Unmatched sender or quality flag</p>
        </div>
        <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-4 shadow-xs">
          <p className="text-xs font-medium text-sky-700 uppercase tracking-wider">Ready for Review</p>
          <p className="mt-1 text-2xl font-bold text-sky-900">{stats.ready}</p>
          <p className="mt-1 text-xs text-sky-600">Matched to client record</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50/50 p-4 shadow-xs">
          <p className="text-xs font-medium text-green-700 uppercase tracking-wider">Verified</p>
          <p className="mt-1 text-2xl font-bold text-green-900">{stats.verified}</p>
          <p className="mt-1 text-xs text-green-600">Practice staff verified</p>
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 pb-3 overflow-x-auto">
          {STATUS_TABS.map((tab) => {
            const isActive = activeStatus === tab.id;
            const count =
              tab.id === "all"
                ? stats.total
                : tab.id === "requires_review"
                ? stats.requiresReview
                : tab.id === "verified"
                ? stats.verified
                : tab.id === "ready"
                ? stats.ready
                : tab.id === "rejected"
                ? stats.rejected
                : undefined;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveStatus(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
                {count !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                      isActive
                        ? "bg-emerald-800 text-white"
                        : tab.id === "requires_review" && stats.requiresReview > 0
                        ? "bg-amber-100 text-amber-800 font-bold"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Channel & Search Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Channel:</span>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value as any)}
              className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-700 bg-white"
            >
              <option value="all">All Channels</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
              <option value="portal">Customer Portal</option>
              <option value="admin">Practice Back-Office</option>
            </select>
          </div>

          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search file name, customer, sender..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <table className="min-w-full divide-y divide-slate-200 text-xs">
          <thead className="bg-slate-50 text-left font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Document</th>
              <th className="px-4 py-3">Client (360)</th>
              <th className="px-4 py-3">Source Channel</th>
              <th className="px-4 py-3">Received Date</th>
              <th className="px-4 py-3">Security &amp; Integrity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                {/* Document Name & Type */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{doc.document_name}</p>
                      <p className="text-[11px] text-slate-500 capitalize">
                        {doc.document_type.replace(/_/g, " ")} • Tax Year {doc.tax_year || "2026"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Customer */}
                <td className="px-4 py-3">
                  {doc.customer_id ? (
                    <div>
                      <Link
                        href={`/admin/customers/${doc.customer_id}?tab=documents`}
                        className="font-medium text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        {doc.customer_name || doc.customer_id}
                      </Link>
                      <p className="text-[10px] font-mono text-slate-400">{doc.customer_id}</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-semibold">Unmatched Sender</span>
                    </div>
                  )}
                </td>

                {/* Source Channel */}
                <td className="px-4 py-3">
                  <div>
                    {getChannelBadge(doc.source_channel)}
                    {doc.sender_identity && (
                      <p className="mt-1 text-[11px] font-mono text-slate-500 truncate max-w-[150px]">
                        {doc.sender_identity}
                      </p>
                    )}
                  </div>
                </td>

                {/* Received Date */}
                <td className="px-4 py-3 text-slate-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(doc.uploaded_at).toLocaleDateString("en-IE")}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(doc.uploaded_at).toLocaleTimeString("en-IE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </td>

                {/* Security Scan */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-medium text-[11px]">Clean</span>
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]" title={doc.checksum}>
                    SHA-256: {doc.checksum.substring(0, 10)}...
                  </p>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <div>
                    {getStatusBadge(doc.status)}
                    {doc.verified_by && (
                      <p className="mt-0.5 text-[10px] text-slate-400">by {doc.verified_by}</p>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* If unmatched, show Assign button */}
                    {!doc.customer_id && (
                      <button
                        onClick={() => {
                          setAssignModalDoc(doc);
                          setSelectedCustomerId("");
                          setAssignNotes("");
                        }}
                        className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1"
                        title="Assign customer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        Assign
                      </button>
                    )}

                    {/* Verify button */}
                    {doc.status !== "verified" && doc.customer_id && (
                      <button
                        onClick={() => handleQuickVerify(doc)}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1"
                        title="Verify document"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Verify
                      </button>
                    )}

                    {/* Reject button */}
                    {doc.status !== "rejected" && (
                      <button
                        onClick={() => {
                          setRejectModalDoc(doc);
                          setRejectReason("");
                        }}
                        className="px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 text-xs transition"
                        title="Reject document"
                      >
                        Reject
                      </button>
                    )}

                    {/* Audit trail */}
                    <button
                      onClick={() => handleOpenAudit(doc)}
                      className="px-2 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs transition"
                      title="View audit trail"
                    >
                      Audit
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {documents.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                  <Inbox className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  No documents found matching the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Assign Customer Modal */}
      {assignModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-700" />
              Assign Document to Client
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Link unmatched document <strong className="text-slate-800">{assignModalDoc.document_name}</strong> received via {assignModalDoc.source_channel.toUpperCase()} ({assignModalDoc.sender_identity}) to a registered client.
            </p>

            <form onSubmit={handleAssignSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Select Customer *</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs bg-white"
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company_name || c.contact_person} ({c.customer_code || c.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Review Note / Justification</label>
                <textarea
                  rows={2}
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                  placeholder="e.g. Sender confirmed via telephone query on 08 Nov 2026."
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModalDoc(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assigning}
                  className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-xs font-semibold text-white shadow-sm"
                >
                  {assigning ? "Assigning..." : "Confirm Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              Reject Document
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Provide an audit reason for rejecting {rejectModalDoc.document_name}.
            </p>

            <form onSubmit={handleRejectSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Rejection Reason *</label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  required
                  placeholder="e.g. Incomplete statement pages, illegible scan, or incorrect period."
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalDoc(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-semibold text-white shadow-sm"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit Trail Modal */}
      {auditDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-700" />
                  Audit Trail &mdash; {auditDoc.document_name}
                </h3>
                <p className="text-xs text-slate-500">ID: {auditDoc.id}</p>
              </div>
              <button
                onClick={() => setAuditDoc(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                &times;
              </button>
            </div>

            <div className="mt-4 max-h-80 overflow-y-auto space-y-3 pr-2">
              {auditTrail.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span className="capitalize">{event.event_type.replace(/_/g, " ")}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {new Date(event.timestamp).toLocaleString("en-IE")}
                    </span>
                  </div>
                  <p className="text-slate-600">{event.details}</p>
                  <p className="text-[11px] text-slate-400">
                    Actor: {event.actor_name} ({event.actor_role})
                  </p>
                </div>
              ))}
              {auditTrail.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">No audit events recorded.</p>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setAuditDoc(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ingestion Simulator Modal */}
      {simulatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-700" />
              Multi-Channel Ingestion Simulator
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Test WhatsApp Business Platform or Inbound Email ingestion with live deterministic customer identity matching.
            </p>

            <form onSubmit={handleRunSimulation} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Source Channel *</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSimChannel("whatsapp");
                      setSimSender("+353871234567");
                      setSimFileName("ROS_VAT3_Return_Sept.pdf");
                    }}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                      simChannel === "whatsapp"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-slate-300 text-slate-600"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" /> WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSimChannel("email");
                      setSimSender("accounts@emeraldcoastalfoods.ie");
                      setSimFileName("Bank_Statements_Oct2026.pdf");
                    }}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                      simChannel === "email"
                        ? "border-blue-600 bg-blue-50 text-blue-800"
                        : "border-slate-300 text-slate-600"
                    }`}
                  >
                    <Mail className="w-4 h-4" /> Inbound Email
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  {simChannel === "whatsapp" ? "Sender Phone Number (E.164)" : "Sender Email Address"} *
                </label>
                <input
                  type="text"
                  value={simSender}
                  onChange={(e) => setSimSender(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Tip: Use <span className="font-mono text-emerald-700">+353871234567</span> or <span className="font-mono text-emerald-700">accounts@emeraldcoastalfoods.ie</span> for auto-match, or an unknown sender to test the unmatched queue.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Document Name *</label>
                  <input
                    type="text"
                    value={simFileName}
                    onChange={(e) => setSimFileName(e.target.value)}
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Category</label>
                  <select
                    value={simCategory}
                    onChange={(e) => setSimCategory(e.target.value as any)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs bg-white"
                  >
                    <option value="bank_statements">Bank Statements</option>
                    <option value="payroll">Payroll</option>
                    <option value="vat_returns">VAT Returns</option>
                    <option value="annual_accounts">Annual Accounts</option>
                    <option value="tax_returns">Tax Returns</option>
                    <option value="company_secretarial">Company Secretarial</option>
                    <option value="id_verification">ID Verification</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSimulatorOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={simulating}
                  className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-xs font-semibold text-white shadow-sm flex items-center gap-1.5"
                >
                  {simulating ? "Ingesting..." : "Simulate Ingestion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
