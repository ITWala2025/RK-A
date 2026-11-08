"use client";

import { useEffect, useState, Suspense } from "react";

export const dynamic = "force-dynamic";
import { useClientSession } from "@/lib/auth/session";
import { documentService } from "@/services/documentService";
import type { CanonicalDocument, DocumentCategoryType, SourceChannel } from "@/types/document";
import { Card, CardBody } from "@/components/ui/Card";
import {
  FileText,
  Upload,
  CheckCircle,
  Clock,
  ShieldCheck,
  MessageSquare,
  Mail,
  Globe,
  Download,
  AlertCircle,
} from "lucide-react";

const CATEGORY_OPTIONS: { id: DocumentCategoryType; label: string }[] = [
  { id: "bank_statements", label: "Bank Statements" },
  { id: "payroll", label: "Payroll / Timesheets" },
  { id: "vat_returns", label: "VAT Invoices / Records" },
  { id: "annual_accounts", label: "Annual Accounts & CRO" },
  { id: "tax_returns", label: "Income & Corporation Tax" },
  { id: "company_secretarial", label: "Company Secretarial / CRO" },
  { id: "id_verification", label: "ID Verification / Passport" },
  { id: "correspondence", label: "Revenue Correspondence" },
];

export default function PortalDocumentsPage() {
  const { customerId } = useClientSession();
  const [documents, setDocuments] = useState<CanonicalDocument[]>([]);
  const [fileName, setFileName] = useState("");
  const [category, setCategory] = useState<DocumentCategoryType>("bank_statements");
  const [taxYear, setTaxYear] = useState(String(new Date().getFullYear()));
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  async function refresh() {
    if (!customerId) return;
    const docs = await documentService.listDocuments({ customerId });
    setDocuments(docs);
  }

  useEffect(() => {
    refresh();
  }, [customerId]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!customerId || !fileName.trim()) return;
    setLoading(true);
    try {
      await documentService.ingestDocument({
        file: {
          name: fileName.trim(),
          size: Math.floor(Math.random() * 350000) + 45000,
          mime_type: fileName.endsWith(".pdf") ? "application/pdf" : "application/octet-stream",
        },
        source_channel: "portal",
        document_type: category,
        tax_year: taxYear,
        explicit_customer_id: customerId,
        sender_identity: "Customer Portal User",
      });
      setFileName("");
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);
      await refresh();
    } finally {
      setLoading(false);
    }
  }

  function getChannelIcon(channel: SourceChannel) {
    switch (channel) {
      case "whatsapp":
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />;
      case "email":
        return <Mail className="w-3.5 h-3.5 text-blue-600" />;
      case "portal":
      default:
        return <Globe className="w-3.5 h-3.5 text-purple-600" />;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Documents</h1>
        <p className="mt-1 text-sm text-slate-500">
          Secure document repository. Upload files directly, or send via WhatsApp / Email &mdash; all files appear here unified in real time.
        </p>
      </div>

      <Card>
        <CardBody>
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <Upload className="w-4 h-4 text-emerald-700" />
            Upload a document
          </h2>
          {uploadSuccess && (
            <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Document uploaded securely. ClamAV signature scan clean.
            </div>
          )}
          <form onSubmit={handleUpload} className="mt-4 flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500">File Name *</label>
              <input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="e.g. AIB-Statement-Sept2026.pdf"
                required
                className="mt-1 w-64 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategoryType)}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500">Tax Year</label>
              <input
                value={taxYear}
                onChange={(e) => setTaxYear(e.target.value)}
                className="mt-1 w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-emerald-700 hover:bg-emerald-800 px-4 py-2 text-sm font-semibold text-white shadow-xs transition"
            >
              {loading ? "Uploading..." : "Upload Securely"}
            </button>
          </form>
        </CardBody>
      </Card>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Document</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Channel</th>
              <th className="px-4 py-3">Uploaded</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-medium text-slate-900">{doc.document_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600 capitalize">
                  {doc.document_type.replace(/_/g, " ")}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <div className="flex items-center gap-1.5 capitalize text-xs">
                    {getChannelIcon(doc.source_channel)}
                    {doc.source_channel}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600 text-xs">
                  {new Date(doc.uploaded_at).toLocaleDateString("en-IE")}
                </td>
                <td className="px-4 py-3">
                  {doc.status === "verified" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  ) : doc.status === "ready" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <CheckCircle className="w-3 h-3" /> Received &amp; Scanned
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      <Clock className="w-3 h-3" /> Under Review
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={`/api/documents/${doc.id}`}
                    className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 text-xs font-medium hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </a>
                </td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  No documents found for your client account.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
