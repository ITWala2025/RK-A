"use client";

import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet, ArrowUpRight, ArrowDownLeft, Plus, CheckCircle2,
  Clock, AlertCircle, Calculator, Filter, Euro, ShieldAlert,
  Building2, Trash2, Eye, X, Check
} from 'lucide-react';
import type { Customer } from '../../types/invoice';
import type { CompanyBookkeepingRecord, BookkeepingFinancialSummary } from '../../types/bookkeeping';
import { bookkeepingService } from '../../services/bookkeepingService';
import { formatCurrencyWithSymbol } from '../../utils/currencyConverter';

interface CustomerBookkeepingTabProps {
  customer: Customer;
  onSendToCT1Calculator: (summary: BookkeepingFinancialSummary) => void;
}

export const CustomerBookkeepingTab: React.FC<CustomerBookkeepingTabProps> = ({
  customer,
  onSendToCT1Calculator,
}) => {
  const [records, setRecords] = useState<CompanyBookkeepingRecord[]>([]);
  const [summary, setSummary] = useState<BookkeepingFinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [taxYearFilter, setTaxYearFilter] = useState<number>(2025);
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'income' | 'expense' | 'add_backs'>('ALL');
  const [modalOpen, setModalOpen] = useState(false);

  // Form fields
  const [formType, setFormType] = useState<'income' | 'expense'>('income');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formCategory, setFormCategory] = useState<string>('trading_sales');
  const [formDesc, setFormDesc] = useState('');
  const [formNet, setFormNet] = useState<number>(5000);
  const [formVatRate, setFormVatRate] = useState<number>(23);
  const [formPayee, setFormPayee] = useState('');
  const [formRef, setFormRef] = useState('');
  const [formIsAddBack, setFormIsAddBack] = useState(false);
  const [formIsCapAllow, setFormIsCapAllow] = useState(false);

  useEffect(() => {
    loadData();
  }, [customer.id, taxYearFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [recs, summ] = await Promise.all([
        bookkeepingService.getRecordsByCustomer(customer.id, taxYearFilter),
        bookkeepingService.getFinancialSummary(customer.id, taxYearFilter),
      ]);
      setRecords(recs);
      setSummary(summ);
    } catch (err) {
      console.error('Failed to load bookkeeping records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDesc.trim() || !formPayee.trim()) return;

    await bookkeepingService.createRecord({
      customerId: customer.id,
      customerName: customer.company_name,
      taxYear: taxYearFilter,
      period: `${taxYearFilter}-Annual`,
      transactionType: formType,
      date: formDate,
      category: formCategory as any,
      description: formDesc.trim(),
      amountNet: Number(formNet),
      vatRate: Number(formVatRate),
      vatAmount: Number((formNet * (formVatRate / 100)).toFixed(2)),
      amountGross: Number((formNet * (1 + formVatRate / 100)).toFixed(2)),
      isNonDeductibleAddBack: formIsAddBack,
      isCapitalAllowanceEligible: formIsCapAllow,
      payeeOrCustomer: formPayee.trim(),
      invoiceOrReceiptNumber: formRef.trim() || undefined,
      source: 'admin_entry',
      status: 'approved',
    });

    setModalOpen(false);
    loadData();
  };

  const handleDeleteRecord = async (id: string) => {
    if (confirm('Delete this transaction record?')) {
      await bookkeepingService.deleteRecord(id);
      loadData();
    }
  };

  const handleApproveRecord = async (id: string) => {
    await bookkeepingService.updateRecord(id, { status: 'approved' });
    loadData();
  };

  const filteredRecords = records.filter((r) => {
    if (typeFilter === 'ALL') return true;
    if (typeFilter === 'income') return r.transactionType === 'income';
    if (typeFilter === 'expense') return r.transactionType === 'expense';
    if (typeFilter === 'add_backs') return r.isNonDeductibleAddBack;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
            Client Bookkeeping &amp; General Ledger Records
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Financial transactions recorded via Customer Portal or Practice back-office, analyzed for Irish CT1 tax deduction rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {summary && (
            <button
              onClick={() => onSendToCT1Calculator(summary)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition shadow-xs"
            >
              <Calculator className="w-4 h-4" /> Import to CT1 Calculator
            </button>
          )}
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 transition shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add Transaction
          </button>
        </div>
      </div>

      {/* Tax Year Filter */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold text-gray-700">Financial Tax Year:</span>
        {[2026, 2025, 2024].map((year) => (
          <button
            key={year}
            onClick={() => setTaxYearFilter(year)}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              taxYearFilter === year
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            FY {year}
          </button>
        ))}
      </div>

      {/* Financial Breakdown Scorecard */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Gross Trading Turnover</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg font-bold text-gray-900 mt-1">
              {formatCurrencyWithSymbol(summary.tradingIncomeNet, 'EUR')}
            </div>
            <div className="text-[11px] text-gray-400 mt-1">Excl. VAT</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Allowable Trading Expenses</span>
              <ArrowDownLeft className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-lg font-bold text-gray-900 mt-1">
              {formatCurrencyWithSymbol(summary.allowableTradingExpenses, 'EUR')}
            </div>
            <div className="text-[11px] text-emerald-600 mt-1 font-medium">100% Tax Deductible</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-amber-700">
              <span>Non-Deductible Add-Backs</span>
              <ShieldAlert className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-lg font-bold text-amber-700 mt-1">
              {formatCurrencyWithSymbol(summary.nonDeductibleAddBacks, 'EUR')}
            </div>
            <div className="text-[11px] text-amber-600 mt-1">Entertaining, fines (Added to CT1)</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-purple-700">
              <span>Director Emoluments</span>
              <Euro className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-lg font-bold text-purple-700 mt-1">
              {formatCurrencyWithSymbol(summary.directorRemunerationTotal, 'EUR')}
            </div>
            <div className="text-[11px] text-gray-400 mt-1">Proprietary salaries</div>
          </div>

          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-900">
              <span>Net Accounting Profit</span>
              <Calculator className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-xl font-bold text-emerald-900 mt-1">
              {formatCurrencyWithSymbol(summary.accountingNetProfit, 'EUR')}
            </div>
            <div className="text-[11px] text-emerald-700 mt-1 font-semibold">
              Est. Adjusted: {formatCurrencyWithSymbol(summary.estimatedAdjustedTradingProfit, 'EUR')}
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-200 text-xs">
        <span className="text-gray-400 font-medium px-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter by:
        </span>
        {[
          { id: 'ALL', label: `All Transactions (${records.length})` },
          { id: 'income', label: 'Income & Sales' },
          { id: 'expense', label: 'Expenses' },
          { id: 'add_backs', label: 'Tax Add-Backs (Disallowable)' },
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

      {/* Transactions Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-500">Loading bookkeeping transactions...</div>
      ) : filteredRecords.length === 0 ? (
        <div className="p-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <FileSpreadsheet className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-700">No transactions recorded for FY {taxYearFilter}</p>
          <p className="text-xs text-gray-500 mt-1">
            Client can submit income and expenses from the customer portal, or staff can add them here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-xs">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50 text-left font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Description &amp; Payee</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Net Amount (&euro;)</th>
                <th className="px-4 py-3 text-right">VAT Rate / Amt</th>
                <th className="px-4 py-3 text-right">Gross Total</th>
                <th className="px-4 py-3">Tax Treatment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-gray-50/70 transition">
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600 font-medium">
                    {rec.date}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {rec.transactionType === 'income' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <ArrowUpRight className="w-3 h-3" /> Income
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-700 font-semibold text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        <ArrowDownLeft className="w-3 h-3" /> Expense
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{rec.description}</p>
                    <p className="text-[11px] text-gray-400">
                      {rec.payeeOrCustomer} {rec.invoiceOrReceiptNumber && `• Ref: ${rec.invoiceOrReceiptNumber}`}
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap capitalize text-gray-700">
                    {rec.category.replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">
                    {formatCurrencyWithSymbol(rec.amountNet, 'EUR')}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500 whitespace-nowrap">
                    {rec.vatRate}% ({formatCurrencyWithSymbol(rec.vatAmount, 'EUR')})
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900 whitespace-nowrap">
                    {formatCurrencyWithSymbol(rec.amountGross, 'EUR')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {rec.isNonDeductibleAddBack ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <ShieldAlert className="w-3 h-3" /> CT1 Add-Back
                      </span>
                    ) : rec.isCapitalAllowanceEligible ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                        Capital Allowance
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400">Standard</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {rec.status === 'approved' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-blue-700 font-medium text-[11px]">
                        <Clock className="w-3.5 h-3.5" /> Reconciled
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {rec.status !== 'approved' && (
                        <button
                          onClick={() => handleApproveRecord(rec.id)}
                          className="px-2 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[11px] font-medium"
                          title="Approve transaction"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteRecord(rec.id)}
                        className="p-1 text-gray-400 hover:text-red-700 rounded hover:bg-red-50 transition"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Transaction Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleCreateRecord}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-gray-900">Add Bookkeeping Transaction</h4>
                <p className="text-xs text-gray-500">Client: {customer.company_name}</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Transaction Type</label>
                  <select
                    value={formType}
                    onChange={(e) => {
                      const t = e.target.value as 'income' | 'expense';
                      setFormType(t);
                      if (t === 'income') setFormCategory('trading_sales');
                      else setFormCategory('cost_of_sales');
                    }}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="income">Income (Revenue)</option>
                    <option value="expense">Expense (Cost)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => {
                    setFormCategory(e.target.value);
                    if (e.target.value === 'client_entertainment' || e.target.value === 'fines_penalties') {
                      setFormIsAddBack(true);
                    } else {
                      setFormIsAddBack(false);
                    }
                    if (e.target.value === 'equipment_purchase') {
                      setFormIsCapAllow(true);
                    } else {
                      setFormIsCapAllow(false);
                    }
                  }}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                >
                  {formType === 'income' ? (
                    <>
                      <option value="trading_sales">Trading Sales (Goods/Services)</option>
                      <option value="consulting_services">Consulting / Professional Services</option>
                      <option value="grant_funding">Government / Enterprise Grant</option>
                      <option value="passive_rental">Passive Property Rental (25% CT)</option>
                      <option value="interest_dividends">Interest &amp; Dividends</option>
                    </>
                  ) : (
                    <>
                      <option value="cost_of_sales">Cost of Sales (Inventory/Materials)</option>
                      <option value="director_remuneration">Director Remuneration / Drawings</option>
                      <option value="staff_payroll">Staff Wages &amp; Employer PRSI</option>
                      <option value="rent_rates">Rent &amp; Commercial Rates</option>
                      <option value="utilities_office">Office, Light &amp; Software Subscriptions</option>
                      <option value="professional_legal_fees">Legal, Audit &amp; Accounting Fees</option>
                      <option value="equipment_purchase">Plant, Machinery &amp; Equipment (Capital Allowance)</option>
                      <option value="client_entertainment">Client Entertainment &amp; Hospitality (CT1 Add-Back)</option>
                      <option value="motor_travel">Business Travel &amp; Motor</option>
                      <option value="fines_penalties">Statutory Fines / Penalties (CT1 Add-Back)</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description *</label>
                <input
                  type="text"
                  required
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="e.g. Q1 Seafood Wholesale Supply Invoice"
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Payee / Customer *</label>
                  <input
                    type="text"
                    required
                    value={formPayee}
                    onChange={(e) => setFormPayee(e.target.value)}
                    placeholder="e.g. Musgrave SuperValu"
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Invoice / Receipt Ref</label>
                  <input
                    type="text"
                    value={formRef}
                    onChange={(e) => setFormRef(e.target.value)}
                    placeholder="INV-2025-010"
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Net Amount (&euro;) *</label>
                  <input
                    type="number"
                    required
                    value={formNet}
                    onChange={(e) => setFormNet(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs font-semibold focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Irish VAT Rate</label>
                  <select
                    value={formVatRate}
                    onChange={(e) => setFormVatRate(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value={23}>Standard (23%)</option>
                    <option value={13.5}>Reduced (13.5%)</option>
                    <option value={9}>Second Reduced (9%)</option>
                    <option value={0}>Zero-Rated (0%)</option>
                  </select>
                </div>
              </div>

              {formType === 'expense' && (
                <div className="space-y-1.5 pt-1">
                  <label className="inline-flex items-center gap-2 cursor-pointer font-semibold text-amber-800">
                    <input
                      type="checkbox"
                      checked={formIsAddBack}
                      onChange={(e) => setFormIsAddBack(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-gray-300"
                    />
                    <span>Disallowed for Tax (Irish CT1 Non-Deductible Add-Back)</span>
                  </label>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-3.5 py-1.5 bg-gray-100 text-gray-700 font-semibold text-xs rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-700 text-white font-semibold text-xs rounded-lg hover:bg-emerald-800"
              >
                Record Transaction
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
