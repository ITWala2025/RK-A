"use client";

import { useEffect, useState } from "react";
import { useClientSession } from "@/lib/auth/session";
import { bookkeepingService } from "@/services/bookkeepingService";
import type { CompanyBookkeepingRecord, BookkeepingFinancialSummary } from "@/types/bookkeeping";
import { Card, CardBody } from "@/components/ui/Card";
import {
  FileSpreadsheet, ArrowUpRight, ArrowDownLeft, Plus,
  CheckCircle2, Clock, Filter, Trash2, X, Euro, ShieldCheck
} from "lucide-react";
import { formatCurrencyWithSymbol } from "@/utils/currencyConverter";

export default function PortalFinancesPage() {
  const { customerId } = useClientSession();
  const [records, setRecords] = useState<CompanyBookkeepingRecord[]>([]);
  const [summary, setSummary] = useState<BookkeepingFinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [taxYearFilter, setTaxYearFilter] = useState<number>(2025);
  const [typeFilter, setTypeFilter] = useState<"ALL" | "income" | "expense">("ALL");
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [formType, setFormType] = useState<"income" | "expense">("income");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formCategory, setFormCategory] = useState("trading_sales");
  const [formDesc, setFormDesc] = useState("");
  const [formNet, setFormNet] = useState<number>(2500);
  const [formVatRate, setFormVatRate] = useState<number>(23);
  const [formPayee, setFormPayee] = useState("");
  const [formRef, setFormRef] = useState("");

  useEffect(() => {
    if (!customerId) return;
    loadData();
  }, [customerId, taxYearFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [recs, summ] = await Promise.all([
        bookkeepingService.getRecordsByCustomer(customerId, taxYearFilter),
        bookkeepingService.getFinancialSummary(customerId, taxYearFilter),
      ]);
      setRecords(recs);
      setSummary(summ);
    } catch (err) {
      console.error("Failed to load company finances in portal:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDesc.trim() || !formPayee.trim() || !customerId) return;

    await bookkeepingService.createRecord({
      customerId,
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
      isNonDeductibleAddBack: formCategory === "client_entertainment" || formCategory === "fines_penalties",
      isCapitalAllowanceEligible: formCategory === "equipment_purchase",
      payeeOrCustomer: formPayee.trim(),
      invoiceOrReceiptNumber: formRef.trim() || undefined,
      source: "portal_entry",
      status: "submitted",
    });

    setModalOpen(false);
    setFormDesc("");
    setFormPayee("");
    setFormRef("");
    loadData();
  };

  const handleDeleteRecord = async (id: string) => {
    if (confirm("Delete this transaction?")) {
      await bookkeepingService.deleteRecord(id);
      loadData();
    }
  };

  const filteredRecords = records.filter((r) => {
    if (typeFilter === "ALL") return true;
    return r.transactionType === typeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-800" />
            Company Income &amp; Expenses Bookkeeping
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Submit your sales invoices, operating expenses, and receipts so RK &amp; Associate accountants can prepare your annual CT1 and VAT3 returns.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-900 transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Income / Expense
        </button>
      </div>

      {/* Tax Year Filter */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold text-slate-700">Financial Tax Year:</span>
        {[2026, 2025, 2024].map((year) => (
          <button
            key={year}
            onClick={() => setTaxYearFilter(year)}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              taxYearFilter === year
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            FY {year}
          </button>
        ))}
      </div>

      {/* Financial Scorecard */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Recorded Income (Net)</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {formatCurrencyWithSymbol(summary.totalIncomeNet, "EUR")}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Excludes output VAT</div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Recorded Expenses (Net)</span>
                <ArrowDownLeft className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {formatCurrencyWithSymbol(summary.totalExpensesNet, "EUR")}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Operating costs &amp; payroll</div>
            </CardBody>
          </Card>

          <Card className="bg-emerald-50/60 border-emerald-200">
            <CardBody>
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-900">
                <span>Estimated Net Profit</span>
                <Euro className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="text-xl font-bold text-emerald-900 mt-1">
                {formatCurrencyWithSymbol(summary.accountingNetProfit, "EUR")}
              </div>
              <div className="text-[11px] text-emerald-700 mt-1 font-medium">
                Used by accountants for CT1
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 text-xs">
        <span className="text-slate-400 font-medium px-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {[
          { id: "ALL", label: `All Transactions (${records.length})` },
          { id: "income", label: "Income & Sales" },
          { id: "expense", label: "Expenses" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTypeFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
              typeFilter === tab.id
                ? "bg-emerald-800 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      {loading ? (
        <div className="p-12 text-center text-sm text-slate-400">Loading company finances...</div>
      ) : filteredRecords.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-center py-10 text-slate-500 space-y-3">
              <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-700">No transactions recorded for FY {taxYearFilter}</p>
              <p className="text-xs text-slate-400">
                Click "Add Income / Expense" above to record your sales and operational costs.
              </p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-left font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Description &amp; Payee</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Net Amount (&euro;)</th>
                <th className="px-4 py-3 text-right">VAT Rate / Amt</th>
                <th className="px-4 py-3 text-right">Gross Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-4 py-3 whitespace-nowrap text-slate-600 font-medium">
                    {rec.date}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {rec.transactionType === "income" ? (
                      <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <ArrowUpRight className="w-3 h-3" /> Income
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-700 font-semibold text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        <ArrowDownLeft className="w-3 h-3" /> Expense
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{rec.description}</p>
                    <p className="text-[11px] text-slate-400">
                      {rec.payeeOrCustomer} {rec.invoiceOrReceiptNumber && `• Ref: ${rec.invoiceOrReceiptNumber}`}
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap capitalize text-slate-700">
                    {rec.category.replace(/_/g, " ")}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900 whitespace-nowrap">
                    {formatCurrencyWithSymbol(rec.amountNet, "EUR")}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500 whitespace-nowrap">
                    {rec.vatRate}% ({formatCurrencyWithSymbol(rec.vatAmount, "EUR")})
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900 whitespace-nowrap">
                    {formatCurrencyWithSymbol(rec.amountGross, "EUR")}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {rec.status === "approved" ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved by Firm
                      </span>
                    ) : rec.status === "reconciled" ? (
                      <span className="inline-flex items-center gap-1 text-blue-700 font-medium text-[11px]">
                        <Clock className="w-3.5 h-3.5" /> Reconciled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-700 font-medium text-[11px]">
                        <Clock className="w-3.5 h-3.5" /> Submitted
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteRecord(rec.id)}
                      className="p-1 text-slate-400 hover:text-red-700 rounded hover:bg-red-50 transition"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Record New Transaction</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transaction Type</label>
                  <select
                    value={formType}
                    onChange={(e) => {
                      const t = e.target.value as "income" | "expense";
                      setFormType(t);
                      if (t === "income") setFormCategory("trading_sales");
                      else setFormCategory("cost_of_sales");
                    }}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="income">Income (Revenue)</option>
                    <option value="expense">Expense (Cost)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                >
                  {formType === "income" ? (
                    <>
                      <option value="trading_sales">Trading Sales (Goods/Services)</option>
                      <option value="consulting_services">Consulting / Professional Services</option>
                      <option value="grant_funding">Enterprise / State Grant Funding</option>
                      <option value="passive_rental">Passive Property Rental (25% CT)</option>
                      <option value="interest_dividends">Interest &amp; Dividends</option>
                    </>
                  ) : (
                    <>
                      <option value="cost_of_sales">Cost of Sales (Wholesale / Raw Catch)</option>
                      <option value="director_remuneration">Director Remuneration / Drawings</option>
                      <option value="staff_payroll">Staff Wages &amp; Employer PRSI</option>
                      <option value="rent_rates">Rent &amp; Commercial Rates</option>
                      <option value="utilities_office">Office, Light &amp; Software Subscriptions</option>
                      <option value="professional_legal_fees">Legal, Audit &amp; Accounting Fees</option>
                      <option value="equipment_purchase">Plant, Machinery &amp; Equipment (Capital Allowance)</option>
                      <option value="client_entertainment">Client Entertainment (Non-deductible CT1 Add-Back)</option>
                      <option value="motor_travel">Business Travel &amp; Motor</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                <input
                  type="text"
                  required
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="e.g. Seafood Supply Contract Invoice"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payee / Customer *</label>
                  <input
                    type="text"
                    required
                    value={formPayee}
                    onChange={(e) => setFormPayee(e.target.value)}
                    placeholder="e.g. SuperValu Ireland"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Invoice / Receipt Ref</label>
                  <input
                    type="text"
                    value={formRef}
                    onChange={(e) => setFormRef(e.target.value)}
                    placeholder="INV-2025-010"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Net Amount (&euro;) *</label>
                  <input
                    type="number"
                    required
                    value={formNet}
                    onChange={(e) => setFormNet(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Irish VAT Rate</label>
                  <select
                    value={formVatRate}
                    onChange={(e) => setFormVatRate(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value={23}>Standard (23%)</option>
                    <option value={13.5}>Reduced (13.5%)</option>
                    <option value={9}>Second Reduced (9%)</option>
                    <option value={0}>Zero-Rated (0%)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-3.5 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-800 text-white font-semibold text-xs rounded-lg hover:bg-emerald-900"
              >
                Submit Transaction
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
