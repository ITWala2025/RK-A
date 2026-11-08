"use client";

import React, { useState, useEffect } from 'react';
import {
  FileText, Plus, Calculator, CheckCircle2, Clock, AlertCircle,
  FileCheck, Download, Eye, ExternalLink, Filter, Euro, ShieldCheck, X
} from 'lucide-react';
import { irishTaxService } from '../../services/irishTaxService';
import type { IrishTaxReturn, IrishTaxReturnType, IrishTaxReturnStatus } from '../../types/irishTax';
import type { Customer } from '../../types/invoice';
import { formatCurrencyWithSymbol } from '../../utils/currencyConverter';

interface CustomerTaxReturnsTabProps {
  customer: Customer;
  onOpenCalculator: (mode?: 'CT1' | 'FORM_11') => void;
}

export const CustomerTaxReturnsTab: React.FC<CustomerTaxReturnsTabProps> = ({
  customer,
  onOpenCalculator,
}) => {
  const [returns, setReturns] = useState<IrishTaxReturn[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'ALL' | IrishTaxReturnType>('ALL');
  const [selectedReturn, setSelectedReturn] = useState<IrishTaxReturn | null>(null);
  const [statusUpdateModal, setStatusUpdateModal] = useState<IrishTaxReturn | null>(null);
  const [newStatus, setNewStatus] = useState<IrishTaxReturnStatus>('acknowledged');
  const [newRosRef, setNewRosRef] = useState('');

  useEffect(() => {
    loadReturns();
  }, [customer.id]);

  const loadReturns = async () => {
    try {
      setLoading(true);
      const data = await irishTaxService.getTaxReturnsByCustomer(customer.id);
      setReturns(data);
    } catch (err) {
      console.error('Failed to load Irish tax returns:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusUpdateModal) return;
    await irishTaxService.updateTaxReturnStatus(statusUpdateModal.id, newStatus, newRosRef.trim() || undefined);
    setStatusUpdateModal(null);
    loadReturns();
  };

  const filteredReturns = returns.filter((r) => {
    if (typeFilter === 'ALL') return true;
    return r.returnType === typeFilter;
  });

  // KPI Computations
  const totalAssessed = returns.reduce((acc, r) => acc + (r.netTaxPayable || 0), 0);
  const totalPaid = returns
    .filter((r) => r.status === 'paid' || r.status === 'acknowledged')
    .reduce((acc, r) => acc + (r.preliminaryTaxPaid || 0) + (r.status === 'paid' ? Math.max(0, r.balanceDueOrRefund) : 0), 0);
  const balanceOutstanding = returns
    .filter((r) => r.status !== 'paid' && r.balanceDueOrRefund > 0)
    .reduce((acc, r) => acc + r.balanceDueOrRefund, 0);
  const acknowledgedCount = returns.filter((r) => r.status === 'acknowledged').length;

  const getStatusBadge = (status: IrishTaxReturnStatus) => {
    switch (status) {
      case 'acknowledged':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged ROS
          </span>
        );
      case 'submitted_ros':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3.5 h-3.5" /> Transmitted ROS
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
            <CheckCircle2 className="w-3.5 h-3.5" /> Cleared &amp; Paid
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

  const getTypeLabel = (type: IrishTaxReturnType) => {
    switch (type) {
      case 'CT1':
        return { label: 'Corporation Tax (CT1)', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'FORM_11':
        return { label: 'Self-Assessment (Form 11)', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'FORM_12':
        return { label: 'PAYE Return (Form 12)', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
      case 'CGT':
        return { label: 'Capital Gains (CG1)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'CAT':
        return { label: 'Capital Acquisitions (IT38)', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'PRELIMINARY_TAX':
        return { label: 'Preliminary Tax', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      default:
        return { label: type, color: 'bg-gray-50 text-gray-700 border-gray-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-700" />
            Irish Tax Returns &amp; ROS Filings
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Annual CT1, Income Tax (Form 11/12), Preliminary Tax payments, and Revenue Assessments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenCalculator('CT1')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition shadow-xs"
          >
            <Calculator className="w-4 h-4" /> Open Tax Calculator
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-xs font-medium text-gray-500">Total Tax Assessed (EUR)</span>
          <div className="text-xl font-bold text-gray-900 mt-1">
            {formatCurrencyWithSymbol(totalAssessed, 'EUR')}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">{returns.length} return(s) on file</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-xs font-medium text-emerald-600">Paid to Revenue</span>
          <div className="text-xl font-bold text-emerald-700 mt-1">
            {formatCurrencyWithSymbol(totalPaid, 'EUR')}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">Includes Preliminary Tax</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-xs font-medium text-amber-600">Balance Due to Revenue</span>
          <div className="text-xl font-bold text-amber-700 mt-1">
            {formatCurrencyWithSymbol(balanceOutstanding, 'EUR')}
          </div>
          <div className="text-[11px] text-amber-600 mt-1">
            {balanceOutstanding > 0 ? 'Pending settlement' : 'Fully balanced'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-xs font-medium text-indigo-600">ROS Acknowledged</span>
          <div className="text-xl font-bold text-indigo-700 mt-1">
            {acknowledgedCount}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">Official Revenue Notices received</div>
        </div>
      </div>

      {/* Subcategory Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-200 text-xs">
        <span className="text-gray-400 font-medium px-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter by:
        </span>
        {[
          { id: 'ALL', label: 'All Returns' },
          { id: 'CT1', label: 'Corporation Tax (CT1)' },
          { id: 'FORM_11', label: 'Income Tax (Form 11)' },
          { id: 'FORM_12', label: 'PAYE (Form 12)' },
          { id: 'PRELIMINARY_TAX', label: 'Preliminary Tax' },
          { id: 'CGT', label: 'CGT' },
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

      {/* Returns Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-500">Loading Irish tax returns...</div>
      ) : filteredReturns.length === 0 ? (
        <div className="p-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-700">No tax returns found for this category</p>
          <p className="text-xs text-gray-500 mt-1">
            Use the Tax Calculator to compute and generate an official CT1 or Form 11 filing record.
          </p>
          <button
            onClick={() => onOpenCalculator('CT1')}
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white text-xs font-medium rounded-lg hover:bg-emerald-800 transition"
          >
            <Calculator className="w-3.5 h-3.5" /> Launch Calculator
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-xs">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50 text-left font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Tax Year / Period</th>
                <th className="px-4 py-3">Return Type</th>
                <th className="px-4 py-3">ROS Acknowledgment</th>
                <th className="px-4 py-3 text-right">Taxable Profit / Income</th>
                <th className="px-4 py-3 text-right">Net Tax Payable</th>
                <th className="px-4 py-3 text-right">Prelim Paid</th>
                <th className="px-4 py-3 text-right">Balance Due / (Refund)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReturns.map((ret) => {
                const typeInfo = getTypeLabel(ret.returnType);
                return (
                  <tr key={ret.id} className="hover:bg-gray-50/70 transition">
                    <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                      {ret.taxYear}
                      <span className="block text-[10px] text-gray-400 font-normal">
                        Due: {ret.dueDate}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-gray-600 whitespace-nowrap">
                      {ret.rosAcknowledgmentNumber || (
                        <span className="text-gray-400 italic">Not submitted yet</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900 whitespace-nowrap">
                      {formatCurrencyWithSymbol(ret.taxableProfitOrIncome, 'EUR')}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">
                      {formatCurrencyWithSymbol(ret.netTaxPayable, 'EUR')}
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-700 whitespace-nowrap">
                      {formatCurrencyWithSymbol(ret.preliminaryTaxPaid, 'EUR')}
                    </td>
                    <td className="px-4 py-3 text-right font-bold whitespace-nowrap">
                      {ret.balanceDueOrRefund > 0 ? (
                        <span className="text-amber-700">
                          {formatCurrencyWithSymbol(ret.balanceDueOrRefund, 'EUR')}
                        </span>
                      ) : ret.balanceDueOrRefund < 0 ? (
                        <span className="text-emerald-700">
                          ({formatCurrencyWithSymbol(Math.abs(ret.balanceDueOrRefund), 'EUR')})
                        </span>
                      ) : (
                        <span className="text-gray-400">&euro;0.00</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(ret.status)}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedReturn(ret)}
                          className="p-1 rounded text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                          title="View Tax Computation Breakdown"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setStatusUpdateModal(ret);
                            setNewStatus(ret.status);
                            setNewRosRef(ret.rosAcknowledgmentNumber || '');
                          }}
                          className="px-2 py-1 rounded text-[11px] font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tax Computation Details Modal */}
      {selectedReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  Tax Computation Statement &mdash; {selectedReturn.taxYear}
                </h4>
                <p className="text-xs text-gray-500">
                  {getTypeLabel(selectedReturn.returnType).label} &bull; Client: {customer.company_name}
                </p>
              </div>
              <button
                onClick={() => setSelectedReturn(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-gray-600">Tax Reference Number (TRN):</span>
                <span className="font-semibold text-gray-900">{customer.vat_number || 'IE9876543A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-gray-600">CRO Company Number:</span>
                <span className="font-semibold text-gray-900">{customer.cro_number || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-gray-600">ROS Acknowledgment Ref:</span>
                <span className="font-mono font-semibold text-emerald-700">
                  {selectedReturn.rosAcknowledgmentNumber || 'Pending Transmission'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-gray-600">Taxable Profit / Income:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrencyWithSymbol(selectedReturn.taxableProfitOrIncome, 'EUR')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-gray-600">Gross Calculated Tax:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrencyWithSymbol(selectedReturn.grossTaxCalculated, 'EUR')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-gray-600">Tax Reliefs &amp; Credits:</span>
                <span className="font-semibold text-emerald-700">
                  -{formatCurrencyWithSymbol(selectedReturn.taxCreditsAndReliefs, 'EUR')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-gray-600">Net Tax Payable:</span>
                <span className="font-bold text-gray-900">
                  {formatCurrencyWithSymbol(selectedReturn.netTaxPayable, 'EUR')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-gray-600">Preliminary Tax Offset:</span>
                <span className="font-semibold text-emerald-700">
                  -{formatCurrencyWithSymbol(selectedReturn.preliminaryTaxPaid, 'EUR')}
                </span>
              </div>
              <div className="flex justify-between py-1.5 font-bold text-sm bg-white p-2.5 rounded-lg border border-slate-200">
                <span>Final Balance Due / (Refund):</span>
                <span className={selectedReturn.balanceDueOrRefund > 0 ? 'text-amber-700' : 'text-emerald-700'}>
                  {selectedReturn.balanceDueOrRefund > 0
                    ? formatCurrencyWithSymbol(selectedReturn.balanceDueOrRefund, 'EUR')
                    : `(${formatCurrencyWithSymbol(Math.abs(selectedReturn.balanceDueOrRefund), 'EUR')})`}
                </span>
              </div>
            </div>

            {selectedReturn.notes && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800">
                <strong>Accountant Notes:</strong> {selectedReturn.notes}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedReturn(null)}
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
                Update Status &mdash; {statusUpdateModal.taxYear} ({statusUpdateModal.returnType})
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
                  onChange={(e) => setNewStatus(e.target.value as IrishTaxReturnStatus)}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="draft">Draft (Computation in progress)</option>
                  <option value="ready_to_file">Ready to File (Partner Approved)</option>
                  <option value="submitted_ros">Submitted ROS (Transmitted)</option>
                  <option value="acknowledged">Acknowledged (Revenue Notice Received)</option>
                  <option value="paid">Paid &amp; Cleared</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  ROS Acknowledgment Number (optional)
                </label>
                <input
                  type="text"
                  value={newRosRef}
                  onChange={(e) => setNewRosRef(e.target.value)}
                  placeholder="e.g. ROS-CT1-2025-992144"
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

