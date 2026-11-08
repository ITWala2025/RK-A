"use client";

import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet, Plus, Calculator, CheckCircle2, Clock, AlertCircle,
  Download, Eye, Filter, Euro, ShieldCheck, X, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';
import { irishTaxService } from '../../services/irishTaxService';
import type { IrishVATReturn, IrishVATReturnType, IrishVATReturnStatus } from '../../types/irishTax';
import type { Customer } from '../../types/invoice';
import { formatCurrencyWithSymbol } from '../../utils/currencyConverter';

interface CustomerVatReturnsTabProps {
  customer: Customer;
  onOpenCalculator: () => void;
}

export const CustomerVatReturnsTab: React.FC<CustomerVatReturnsTabProps> = ({
  customer,
  onOpenCalculator,
}) => {
  const [returns, setReturns] = useState<IrishVATReturn[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'ALL' | IrishVATReturnType>('ALL');
  const [selectedVat, setSelectedVat] = useState<IrishVATReturn | null>(null);
  const [statusUpdateModal, setStatusUpdateModal] = useState<IrishVATReturn | null>(null);
  const [newStatus, setNewStatus] = useState<IrishVATReturnStatus>('acknowledged');
  const [newNoticeRef, setNewNoticeRef] = useState('');

  useEffect(() => {
    loadReturns();
  }, [customer.id]);

  const loadReturns = async () => {
    try {
      setLoading(true);
      const data = await irishTaxService.getVatReturnsByCustomer(customer.id);
      setReturns(data);
    } catch (err) {
      console.error('Failed to load Irish VAT returns:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusUpdateModal) return;
    await irishTaxService.updateVatReturnStatus(statusUpdateModal.id, newStatus, newNoticeRef.trim() || undefined);
    setStatusUpdateModal(null);
    loadReturns();
  };

  const filteredReturns = returns.filter((r) => {
    if (typeFilter === 'ALL') return true;
    return r.returnType === typeFilter;
  });

  // KPIs
  const totalT1 = returns.reduce((acc, r) => acc + (r.boxT1_VatOnSales || 0), 0);
  const totalT2 = returns.reduce((acc, r) => acc + (r.boxT2_VatOnPurchases || 0), 0);
  const totalNetPayable = returns.reduce((acc, r) => acc + (r.boxT3_NetPayable || 0), 0);
  const totalNetRefund = returns.reduce((acc, r) => acc + (r.boxT4_NetRepayable || 0), 0);

  const getStatusBadge = (status: IrishVATReturnStatus) => {
    switch (status) {
      case 'acknowledged':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Filed &amp; Confirmed
          </span>
        );
      case 'submitted_ros':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3.5 h-3.5" /> ROS Transmitted
          </span>
        );
      case 'ready_to_file':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5" /> Ready to File
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Direct Debit Paid
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
            Irish VAT Returns (VAT3 &amp; RTD)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Bi-monthly Revenue Commissioners VAT3 returns, Annual Return of Trading Details (RTD), and VIES declarations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCalculator}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition shadow-xs"
          >
            <Calculator className="w-4 h-4" /> Calculate &amp; Prepare VAT3
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-gray-500">
            <span>Box T1: Sales Output VAT</span>
            <ArrowUpRight className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-gray-900 mt-1">
            {formatCurrencyWithSymbol(totalT1, 'EUR')}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">Total VAT collected on supplies</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-emerald-600">
            <span>Box T2: Purchases Input VAT</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-700 mt-1">
            {formatCurrencyWithSymbol(totalT2, 'EUR')}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">Deductible input expenses</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-amber-600">
            <span>Box T3: Net VAT Payable</span>
            <Euro className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-amber-700 mt-1">
            {formatCurrencyWithSymbol(totalNetPayable, 'EUR')}
          </div>
          <div className="text-[11px] text-amber-600 mt-1">Due to Revenue Commissioners</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-indigo-600">
            <span>Box T4: Net Repayable</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-bold text-indigo-700 mt-1">
            {formatCurrencyWithSymbol(totalNetRefund, 'EUR')}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">Refund claimable from Revenue</div>
        </div>
      </div>

      {/* Subcategory Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-200 text-xs">
        <span className="text-gray-400 font-medium px-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Category:
        </span>
        {[
          { id: 'ALL', label: 'All VAT Returns' },
          { id: 'VAT3', label: 'Bi-Monthly (VAT3)' },
          { id: 'RTD', label: 'Annual RTD' },
          { id: 'MOSS_OSS', label: 'One Stop Shop (OSS)' },
          { id: 'VIES', label: 'Intra-EU (VIES)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTypeFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
              typeFilter === tab.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-500">Loading VAT returns...</div>
      ) : filteredReturns.length === 0 ? (
        <div className="p-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <FileSpreadsheet className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-700">No VAT returns on file for this category</p>
          <p className="text-xs text-gray-500 mt-1">
            Prepare and file a new VAT3 bi-monthly return using the VAT Calculator.
          </p>
          <button
            onClick={onOpenCalculator}
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white text-xs font-medium rounded-lg hover:bg-emerald-800 transition"
          >
            <Calculator className="w-3.5 h-3.5" /> Launch VAT Calculator
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-xs">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50 text-left font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Return Period</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">ROS Notice Ref</th>
                <th className="px-4 py-3 text-right">Box T1 (Sales VAT)</th>
                <th className="px-4 py-3 text-right">Box T2 (Purchases VAT)</th>
                <th className="px-4 py-3 text-right">Box T3 / T4 (Net)</th>
                <th className="px-4 py-3 text-right">Intra-EU (E1/E2)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReturns.map((vat) => (
                <tr key={vat.id} className="hover:bg-gray-50/70 transition">
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                    {vat.period}
                    <span className="block text-[10px] text-gray-400 font-normal">
                      Due: {vat.dueDate}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {vat.returnType}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-gray-600 whitespace-nowrap">
                    {vat.rosNoticeNumber || (
                      <span className="text-gray-400 italic">Unfiled Draft</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900 whitespace-nowrap">
                    {formatCurrencyWithSymbol(vat.boxT1_VatOnSales, 'EUR')}
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-700 whitespace-nowrap">
                    {formatCurrencyWithSymbol(vat.boxT2_VatOnPurchases, 'EUR')}
                  </td>
                  <td className="px-4 py-3 text-right font-bold whitespace-nowrap">
                    {vat.boxT3_NetPayable > 0 ? (
                      <span className="text-amber-700">
                        {formatCurrencyWithSymbol(vat.boxT3_NetPayable, 'EUR')} Due (T3)
                      </span>
                    ) : vat.boxT4_NetRepayable > 0 ? (
                      <span className="text-emerald-700">
                        ({formatCurrencyWithSymbol(vat.boxT4_NetRepayable, 'EUR')}) Refund (T4)
                      </span>
                    ) : (
                      <span className="text-gray-400">&euro;0.00</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600 whitespace-nowrap">
                    {vat.boxE1_IntraEuSupplies > 0 || vat.boxE2_IntraEuAcquisitions > 0 ? (
                      <span className="text-[11px]">
                        E1: {formatCurrencyWithSymbol(vat.boxE1_IntraEuSupplies, 'EUR')}
                      </span>
                    ) : (
                      <span className="text-gray-300">&mdash;</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(vat.status)}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedVat(vat)}
                        className="p-1 rounded text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                        title="View VAT3 Breakdown"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setStatusUpdateModal(vat);
                          setNewStatus(vat.status);
                          setNewNoticeRef(vat.rosNoticeNumber || '');
                        }}
                        className="px-2 py-1 rounded text-[11px] font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VAT3 Modal Breakdown */}
      {selectedVat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  Official VAT3 Statutory Return Box Summary
                </h4>
                <p className="text-xs text-gray-500">
                  Period: {selectedVat.period} &bull; VAT No: {customer.vat_number || 'IE9876543A'}
                </p>
              </div>
              <button
                onClick={() => setSelectedVat(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono">
              <div className="flex justify-between py-1 border-b border-slate-200 font-sans">
                <span className="font-semibold text-gray-700">Box T1 &mdash; VAT on Sales:</span>
                <span className="font-bold text-gray-900">
                  {formatCurrencyWithSymbol(selectedVat.boxT1_VatOnSales, 'EUR')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 font-sans">
                <span className="font-semibold text-emerald-700">Box T2 &mdash; VAT on Purchases:</span>
                <span className="font-bold text-emerald-700">
                  {formatCurrencyWithSymbol(selectedVat.boxT2_VatOnPurchases, 'EUR')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 font-sans">
                <span className="font-semibold text-amber-700">Box T3 &mdash; Net VAT Payable:</span>
                <span className="font-bold text-amber-700">
                  {formatCurrencyWithSymbol(selectedVat.boxT3_NetPayable, 'EUR')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 font-sans">
                <span className="font-semibold text-indigo-700">Box T4 &mdash; Net VAT Repayable:</span>
                <span className="font-bold text-indigo-700">
                  {formatCurrencyWithSymbol(selectedVat.boxT4_NetRepayable, 'EUR')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 font-sans">
                <span className="text-gray-600">Box E1 &mdash; Intra-EU Supplies (Goods/Services):</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrencyWithSymbol(selectedVat.boxE1_IntraEuSupplies, 'EUR')}
                </span>
              </div>
              <div className="flex justify-between py-1 font-sans">
                <span className="text-gray-600">Box E2 &mdash; Intra-EU Acquisitions (Reverse Charge):</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrencyWithSymbol(selectedVat.boxE2_IntraEuAcquisitions, 'EUR')}
                </span>
              </div>
            </div>

            {selectedVat.notes && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800">
                <strong>Accountant Notes:</strong> {selectedVat.notes}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedVat(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold text-xs rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {statusUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleUpdateStatus}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="text-sm font-bold text-gray-900">
                Update Status &mdash; {statusUpdateModal.period} ({statusUpdateModal.returnType})
              </h4>
              <button
                type="button"
                onClick={() => setStatusUpdateModal(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Filing Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as IrishVATReturnStatus)}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="draft">Draft (Preparing)</option>
                  <option value="ready_to_file">Ready to File (Partner Approved)</option>
                  <option value="submitted_ros">Submitted to ROS (Transmitted)</option>
                  <option value="acknowledged">Acknowledged (Revenue Notice Received)</option>
                  <option value="paid">Direct Debit Paid</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  ROS Notice Number (optional)
                </label>
                <input
                  type="text"
                  value={newNoticeRef}
                  onChange={(e) => setNewNoticeRef(e.target.value)}
                  placeholder="e.g. ROS-VAT3-2026-P01-9921"
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs font-mono focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStatusUpdateModal(null)}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

