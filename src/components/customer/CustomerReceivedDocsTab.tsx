"use client";

import React, { useState } from 'react';
import {
  Folder, Upload, Shield, Check, MessageSquare, Download, FileText,
  FileCheck, XCircle, Clock, Filter, Eye, ShieldCheck, Mail, Smartphone,
  Laptop, AlertTriangle, X, CheckCircle2
} from 'lucide-react';
import type {
  CanonicalDocument,
  DocumentCategoryType,
  SourceChannel,
  DocumentAuditEvent,
} from '../../types/document';
import type { Customer } from '../../types/invoice';
import { documentService } from '../../services/documentService';

interface CustomerReceivedDocsTabProps {
  customer: Customer;
  documents: CanonicalDocument[];
  onRefresh: () => void;
}

export const CustomerReceivedDocsTab: React.FC<CustomerReceivedDocsTabProps> = ({
  customer,
  documents,
  onRefresh,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | DocumentCategoryType>('ALL');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadCategory, setUploadCategory] = useState<DocumentCategoryType>('bank_statements');
  const [uploadChannel, setUploadChannel] = useState<SourceChannel>('portal');
  const [uploadTaxYear, setUploadTaxYear] = useState('2026');
  const [auditDoc, setAuditDoc] = useState<CanonicalDocument | null>(null);
  const [auditEvents, setAuditEvents] = useState<DocumentAuditEvent[]>([]);

  const handleVerify = async (docId: string) => {
    await documentService.verifyDocument(docId, 'Aoife Ryan (Partner)');
    onRefresh();
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName.trim() || !customer.id) return;
    await documentService.ingestDocument({
      file: {
        name: uploadName.trim(),
        size: Math.floor(Math.random() * 450000) + 50000,
        mime_type: uploadName.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream',
      },
      source_channel: uploadChannel,
      document_type: uploadCategory,
      tax_year: uploadTaxYear,
      explicit_customer_id: customer.id,
      sender_identity: customer.email || 'Practice Client Portal',
    });
    setUploadModalOpen(false);
    setUploadName('');
    onRefresh();
  };

  const handleOpenAudit = (doc: CanonicalDocument) => {
    setAuditDoc(doc);
    const trail = documentService.getAuditTrail(doc.id);
    setAuditEvents(trail);
  };

  const filteredDocs = documents.filter((doc) => {
    if (categoryFilter === 'ALL') return true;
    return doc.document_type === categoryFilter;
  });

  // KPIs
  const verifiedCount = documents.filter((d) => d.status === 'verified').length;
  const cleanScanCount = documents.filter((d) => d.security_scan_status === 'clean').length;
  const whatsappCount = documents.filter((d) => d.source_channel === 'whatsapp').length;
  const emailCount = documents.filter((d) => d.source_channel === 'email').length;

  const getChannelBadge = (channel: SourceChannel) => {
    switch (channel) {
      case 'whatsapp':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Smartphone className="w-3 h-3 text-emerald-700" /> WhatsApp
          </span>
        );
      case 'email':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-800 border border-blue-200">
            <Mail className="w-3 h-3 text-blue-700" /> Inbound Email
          </span>
        );
      case 'portal':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-purple-100 text-purple-800 border border-purple-200">
            <Laptop className="w-3 h-3 text-purple-700" /> Client Portal
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-800 border border-gray-200">
            Back-Office Admin
          </span>
        );
    }
  };

  const getScanBadge = (scan: string) => {
    if (scan === 'clean') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3 h-3 text-emerald-600" /> ClamAV Clean
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
        <AlertTriangle className="w-3 h-3 text-red-600" /> Quarantined
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Folder className="w-5 h-5 text-emerald-700" />
            Customer Received Documents Vault ({documents.length})
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Client source records, statements, receipts, payroll exports &amp; secretarial documents received via Portal, Email &amp; WhatsApp.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition shadow-xs"
          >
            <Upload className="w-4 h-4" /> Upload Document to Vault
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-xs font-medium text-gray-500">Total Received Documents</span>
          <div className="text-xl font-bold text-gray-900 mt-1">{documents.length}</div>
          <div className="text-[11px] text-gray-400 mt-1">Stored with SHA-256 integrity</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-xs font-medium text-emerald-600">Practice Verified</span>
          <div className="text-xl font-bold text-emerald-700 mt-1">{verifiedCount}</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">Reconciled by Practice Staff</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-xs font-medium text-indigo-600">Antivirus Clean</span>
          <div className="text-xl font-bold text-indigo-700 mt-1">{cleanScanCount}</div>
          <div className="text-[11px] text-gray-400 mt-1">Zero malware threats detected</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-xs font-medium text-purple-600">Channels Received</span>
          <div className="text-xl font-bold text-purple-700 mt-1">
            {whatsappCount} WA &bull; {emailCount} Email
          </div>
          <div className="text-[11px] text-gray-400 mt-1">Multi-channel ingestion intake</div>
        </div>
      </div>

      {/* Categorized Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-200 text-xs">
        <span className="text-gray-400 font-medium px-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Category:
        </span>
        {[
          { id: 'ALL', label: 'All Documents' },
          { id: 'bank_statements', label: 'Bank Statements' },
          { id: 'vat_returns', label: 'Sales & Expense Invoices' },
          { id: 'payroll', label: 'Payroll & RPNs' },
          { id: 'annual_accounts', label: 'Annual Accounts / B1' },
          { id: 'tax_returns', label: 'Revenue & Tax Docs' },
          { id: 'company_secretarial', label: 'Company Secretarial' },
          { id: 'id_verification', label: 'AML / KYC Proofs' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${categoryFilter === tab.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Documents Table */}
      {filteredDocs.length === 0 ? (
        <div className="p-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <Folder className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-700">No documents in this category</p>
          <p className="text-xs text-gray-500 mt-1">
            Upload client files or receive them automatically via email or WhatsApp Business.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-xs">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50 text-left font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Document Name &amp; Tax Year</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Source Channel</th>
                <th className="px-4 py-3">Received Date</th>
                <th className="px-4 py-3">Antivirus &amp; Integrity</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50/70 transition">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{doc.document_name}</p>
                        <p className="text-[11px] text-gray-400">
                          Tax Year {doc.tax_year || '2026'} &bull; {(doc.file_size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="capitalize text-gray-700 font-medium">
                      {doc.document_type.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {getChannelBadge(doc.source_channel)}
                    {doc.sender_identity && (
                      <span className="block text-[10px] text-gray-400 mt-0.5 truncate max-w-[120px]">
                        {doc.sender_identity}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {new Date(doc.uploaded_at).toLocaleDateString('en-IE', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {getScanBadge(doc.security_scan_status)}
                    <span className="block font-mono text-[9px] text-gray-400 mt-0.5 truncate max-w-[120px]">
                      {doc.checksum.slice(0, 16)}...
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {doc.status === 'verified' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-700 font-medium text-[11px]">
                        <Clock className="w-3.5 h-3.5" /> Ready for Review
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {doc.status !== 'verified' && (
                        <button
                          onClick={() => handleVerify(doc.id)}
                          className="px-2 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-medium rounded text-[11px] transition"
                        >
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenAudit(doc)}
                        className="p-1 rounded text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                        title="Audit Log"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                      <a
                        href={doc.download_url || '#'}
                        className="p-1 rounded text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Document Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleUploadSubmit}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-gray-900">Upload Customer Document</h4>
                <p className="text-xs text-gray-500">Client: {customer.company_name}</p>
              </div>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Document File Name</label>
                <input
                  type="text"
                  required
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. Bank_Statement_AIB_Q1_2026.pdf"
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Document Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as DocumentCategoryType)}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="bank_statements">Bank Statements &amp; Reconciliations</option>
                  <option value="vat_returns">Sales Invoices &amp; Expense Receipts</option>
                  <option value="payroll">Payroll Summaries &amp; ERR RPNs</option>
                  <option value="annual_accounts">Annual Accounts &amp; CRO Form B1</option>
                  <option value="tax_returns">Tax Assessments &amp; Revenue Certs</option>
                  <option value="company_secretarial">Company Secretarial &amp; Registers</option>
                  <option value="id_verification">AML / KYC Proof of Identity</option>
                  <option value="correspondence">Client Correspondence</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Intake Channel</label>
                  <select
                    value={uploadChannel}
                    onChange={(e) => setUploadChannel(e.target.value as SourceChannel)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="portal">Client Portal</option>
                    <option value="email">Inbound Email</option>
                    <option value="whatsapp">WhatsApp Business</option>
                    <option value="admin">Back-Office Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tax Year</label>
                  <input
                    type="text"
                    value={uploadTaxYear}
                    onChange={(e) => setUploadTaxYear(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800"
              >
                Ingest &amp; Verify
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Audit Trail Modal */}
      {auditDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  Immutable Document Audit Trail
                </h4>
                <p className="text-xs text-gray-500 font-mono">{auditDoc.document_name}</p>
              </div>
              <button
                onClick={() => setAuditDoc(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {auditEvents.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No audit events recorded.</p>
              ) : (
                auditEvents.map((evt) => (
                  <div key={evt.id} className="text-xs p-3 rounded-lg bg-gray-50 border border-gray-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 capitalize">
                        {evt.event_type.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(evt.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {evt.actor_name && (
                      <p className="text-[11px] text-gray-600">
                        Actor: {evt.actor_name} {evt.actor_role && `(${evt.actor_role})`}
                      </p>
                    )}
                    {evt.details && <p className="text-[11px] text-gray-500">{evt.details}</p>}
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setAuditDoc(null)}
                className="px-4 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
