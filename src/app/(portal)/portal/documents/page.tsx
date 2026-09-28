"use client";

import { useEffect, useState } from "react";
import { useClientSession } from "@/lib/auth/session";
import { documentsRepository } from "@/lib/data/documents.repository";
import type { DocumentCategory, DocumentItem } from "@/lib/domain/types";
import { formatDate } from "@/lib/format";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const CATEGORY_OPTIONS: DocumentCategory[] = [
  "bank_statements",
  "payroll",
  "vat_returns",
  "annual_accounts",
  "tax_returns",
  "company_secretarial",
  "correspondence",
];

const scanTone = { pending_scan: "yellow", clean: "green", quarantined: "red" } as const;

export default function PortalDocumentsPage() {
  const { customerId } = useClientSession();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [fileName, setFileName] = useState("");
  const [category, setCategory] = useState<DocumentCategory>("bank_statements");
  const [taxYear, setTaxYear] = useState(String(new Date().getFullYear()));

  async function refresh() {
    if (!customerId) return;
    const docs = await documentsRepository.listByCustomer(customerId);
    setDocuments(docs);
  }

  useEffect(() => {
    if (!customerId) return;
    let cancelled = false;
    documentsRepository.listByCustomer(customerId).then((docs) => {
      if (!cancelled) setDocuments(docs);
    });
    return () => {
      cancelled = true;
    };
  }, [customerId]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!customerId || !fileName.trim()) return;
    const doc = await documentsRepository.create({ customerId, fileName, category, taxYear });
    await refresh();
    setFileName("");

    // Simulate an async malware scan completing shortly after upload (PRD US-E1).
    setTimeout(async () => {
      await documentsRepository.markScanResult(doc.id, "clean");
      await refresh();
    }, 1500);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
        <p className="mt-1 text-sm text-slate-500">
          Upload source documents for your bookkeeper, and download deliverables from the firm.
        </p>
      </div>

      <Card>
        <CardBody>
          <h2 className="font-semibold text-slate-900">Upload a document</h2>
          <form onSubmit={handleUpload} className="mt-4 flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500">File name</label>
              <input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="e.g. bank-statement-sept.pdf"
                required
                className="mt-1 w-64 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c.replace(/_/g, " ")}
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
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Upload
            </button>
          </form>
          <p className="mt-2 text-xs text-slate-400">
            Simulated malware scan — no real antivirus is wired up in Phase 1.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="text-left text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="py-2">File</th>
                <th className="py-2">Category</th>
                <th className="py-2">Tax Year</th>
                <th className="py-2">Uploaded</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="py-2 text-slate-800">{doc.fileName}</td>
                  <td className="py-2 text-slate-600">{doc.category.replace(/_/g, " ")}</td>
                  <td className="py-2 text-slate-600">{doc.taxYear}</td>
                  <td className="py-2 text-slate-600">{formatDate(doc.uploadedAt)}</td>
                  <td className="py-2">
                    <Badge tone={scanTone[doc.status]}>{doc.status.replace(/_/g, " ")}</Badge>
                  </td>
                </tr>
              ))}
              {documents.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No documents uploaded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
