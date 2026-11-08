"use client";

import React, { useState, useEffect } from 'react';
import {
  Calculator, Euro, Building2, User, FileSpreadsheet, CheckCircle2,
  AlertCircle, ArrowRight, ShieldCheck, Save, Sparkles, HelpCircle,
  FileCheck, RefreshCw, Sliders
} from 'lucide-react';
import type { Customer } from '../../types/invoice';
import {
  calculateIrishCorporationTax,
  calculateIrishIncomeTax,
  calculateIrishVAT3,
  type CorporationTaxInputs,
  type IncomeTaxInputs,
  type VAT3Inputs,
} from '../../utils/irishTaxCalculator';
import { irishTaxService } from '../../services/irishTaxService';
import type {
  CorporationTaxCalculationResult,
  IrishIncomeTaxCalculationResult,
  IrishVAT3CalculationResult,
  MaritalStatus,
  IrishTaxReturnStatus,
  IrishVATReturnStatus,
} from '../../types/irishTax';
import { formatCurrencyWithSymbol } from '../../utils/currencyConverter';
import { directorService } from '../../services/directorService';
import { bookkeepingService } from '../../services/bookkeepingService';
import type { CompanyDirector } from '../../types/director';

interface CustomerTaxCalculatorTabProps {
  customer: Customer;
  defaultMode?: 'CT1' | 'FORM_11' | 'VAT3';
  selectedDirector?: CompanyDirector;
  onFilingRecordGenerated?: (type: 'tax' | 'vat') => void;
}

export const CustomerTaxCalculatorTab: React.FC<CustomerTaxCalculatorTabProps> = ({
  customer,
  defaultMode = 'CT1',
  selectedDirector,
  onFilingRecordGenerated,
}) => {
  const [activeMode, setActiveMode] = useState<'CT1' | 'FORM_11' | 'VAT3'>(defaultMode);
  const [savingRecord, setSavingRecord] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Directors state for Form 11 Personal Tax computation
  const [directors, setDirectors] = useState<CompanyDirector[]>([]);
  const [selectedDirectorId, setSelectedDirectorId] = useState<string>(selectedDirector?.id || '');

  // -------------------------------------------------------------------
  // 1. CORPORATION TAX (CT1) STATE
  // -------------------------------------------------------------------
  const [ctTaxYear, setCtTaxYear] = useState<number>(2025);
  const [ctAccountingProfit, setCtAccountingProfit] = useState<number>(185000);
  const [ctAddBacks, setCtAddBacks] = useState<number>(12500); // Depreciation, entertaining
  const [ctCapitalAllowances, setCtCapitalAllowances] = useState<number>(15000); // Plant & machinery wear & tear @ 12.5%
  const [ctPassiveIncome, setCtPassiveIncome] = useState<number>(0);
  const [ctStartupRelief, setCtStartupRelief] = useState<number>(0);
  const [ctRdCredit, setCtRdCredit] = useState<number>(0);
  const [ctPreliminaryPaid, setCtPreliminaryPaid] = useState<number>(18000);

  // Load directors for Form 11
  useEffect(() => {
    directorService.getDirectorsByCustomer(customer.id).then((dirs) => {
      setDirectors(dirs);
      if (selectedDirector) {
        setSelectedDirectorId(selectedDirector.id);
        setItGrossIncome(selectedDirector.annualSalaryOrDrawings || 75000);
        setItAllowableDeductions(selectedDirector.pensionContributions || 10000);
        setItMaritalStatus(selectedDirector.maritalStatus || 'married_one_earner');
      } else if (dirs.length > 0 && !selectedDirectorId) {
        const firstProp = dirs.find((d) => d.directorType === 'proprietary') || dirs[0];
        setSelectedDirectorId(firstProp.id);
        setItGrossIncome(firstProp.annualSalaryOrDrawings || 75000);
        setItAllowableDeductions(firstProp.pensionContributions || 10000);
        setItMaritalStatus(firstProp.maritalStatus || 'married_one_earner');
      }
    });
  }, [customer.id, selectedDirector]);

  const handleSelectDirector = (dirId: string) => {
    setSelectedDirectorId(dirId);
    const dir = directors.find((d) => d.id === dirId);
    if (dir) {
      setItGrossIncome(dir.annualSalaryOrDrawings || 0);
      setItAllowableDeductions(dir.pensionContributions || 0);
      setItMaritalStatus(dir.maritalStatus || 'single');
      setItIsSelfEmployed(dir.directorType === 'proprietary');
    }
  };

  const handleImportFromLedger = async () => {
    try {
      const summ = await bookkeepingService.getFinancialSummary(customer.id, ctTaxYear);
      setCtAccountingProfit(summ.accountingNetProfit);
      setCtAddBacks(summ.nonDeductibleAddBacks);
      setCtCapitalAllowances(Number((summ.capitalAllowancesExpenditure * 0.125).toFixed(2)));
      setCtPassiveIncome(summ.passiveIncomeNet);
      setSuccessMessage(
        `Imported from client bookkeeping: Accounting Profit €${summ.accountingNetProfit.toLocaleString()}, Add-Backs €${summ.nonDeductibleAddBacks.toLocaleString()}, Capital Allowances €${(summ.capitalAllowancesExpenditure * 0.125).toFixed(2)}.`
      );
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error('Failed to import ledger summary:', err);
    }
  };

  const ctResult: CorporationTaxCalculationResult = calculateIrishCorporationTax({
    taxYear: ctTaxYear,
    accountingProfit: ctAccountingProfit,
    nonDeductibleAddBacks: ctAddBacks,
    capitalAllowances: ctCapitalAllowances,
    passiveIncome: ctPassiveIncome,
    smallCompanyRelief_s486C: ctStartupRelief,
    researchAndDevelopmentCredit: ctRdCredit,
    preliminaryTaxPaid: ctPreliminaryPaid,
  });

  // -------------------------------------------------------------------
  // 2. INCOME TAX / SELF-ASSESSMENT (FORM 11) STATE
  // -------------------------------------------------------------------
  const [itTaxYear, setItTaxYear] = useState<number>(2025);
  const [itMaritalStatus, setItMaritalStatus] = useState<MaritalStatus>('single');
  const [itIsSelfEmployed, setItIsSelfEmployed] = useState<boolean>(true);
  const [itGrossIncome, setItGrossIncome] = useState<number>(95000);
  const [itAllowableDeductions, setItAllowableDeductions] = useState<number>(12000); // e.g. Pension RAC/PRSA
  const [itOtherCredits, setItOtherCredits] = useState<number>(0);
  const [itPreliminaryPaid, setItPreliminaryPaid] = useState<number>(22000);

  const itResult: IrishIncomeTaxCalculationResult = calculateIrishIncomeTax({
    taxYear: itTaxYear,
    maritalStatus: itMaritalStatus,
    isSelfEmployedOrDirector: itIsSelfEmployed,
    grossIncome: itGrossIncome,
    allowableDeductions: itAllowableDeductions,
    otherCredits: itOtherCredits,
    preliminaryTaxPaid: itPreliminaryPaid,
  });

  // -------------------------------------------------------------------
  // 3. VAT3 BI-MONTHLY RETURN STATE
  // -------------------------------------------------------------------
  const [vatPeriod, setVatPeriod] = useState<string>('2026-P01 (Jan/Feb)');
  const [vatYear, setVatYear] = useState<number>(2026);
  const [vatSales23, setVatSales23] = useState<number>(75000);
  const [vatSales135, setVatSales135] = useState<number>(0);
  const [vatSalesZero, setVatSalesZero] = useState<number>(15000);
  const [vatPurchases23, setVatPurchases23] = useState<number>(42000);
  const [vatPurchases135, setVatPurchases135] = useState<number>(0);
  const [vatBoxE1, setVatBoxE1] = useState<number>(10000);
  const [vatBoxE2, setVatBoxE2] = useState<number>(0);

  const vatResult: IrishVAT3CalculationResult = calculateIrishVAT3({
    period: vatPeriod,
    year: vatYear,
    salesStandard23Net: vatSales23,
    salesReduced13_5Net: vatSales135,
    salesZeroRatedNet: vatSalesZero,
    purchasesStandard23Net: vatPurchases23,
    purchasesReduced13_5Net: vatPurchases135,
    boxE1_IntraEuSupplies: vatBoxE1,
    boxE2_IntraEuAcquisitions: vatBoxE2,
  });

  // -------------------------------------------------------------------
  // GENERATE RECORD HANDLERS
  // -------------------------------------------------------------------
  const handleSaveCT1Record = async (status: IrishTaxReturnStatus = 'ready_to_file') => {
    try {
      setSavingRecord(true);
      const generatedRosRef = status === 'submitted_ros' || status === 'acknowledged'
        ? `ROS-CT1-${ctTaxYear}-${Math.floor(100000 + Math.random() * 900000)}`
        : undefined;

      await irishTaxService.createTaxReturn({
        customerId: customer.id,
        customerName: customer.company_name,
        taxYear: ctTaxYear,
        returnType: 'CT1',
        dueDate: `${ctTaxYear + 1}-09-23`,
        periodStart: `${ctTaxYear}-01-01`,
        periodEnd: `${ctTaxYear}-12-31`,
        filingDate: generatedRosRef ? new Date().toISOString() : undefined,
        rosAcknowledgmentNumber: generatedRosRef,
        taxableProfitOrIncome: ctResult.adjustedTradingProfit,
        grossTaxCalculated: ctResult.grossCorporationTax,
        taxCreditsAndReliefs: ctResult.smallCompanyRelief_s486C + ctResult.researchAndDevelopmentCredit + ctResult.otherTaxReliefs,
        preliminaryTaxPaid: ctResult.preliminaryTaxPaid,
        netTaxPayable: ctResult.netCorporationTaxBeforePrepayments,
        balanceDueOrRefund: ctResult.balancePayableOrRefund,
        status,
        calculatedBy: 'Practice Tax Specialist',
        notes: `Generated via Irish Tax Engine. Trading CT @ 12.5% on Adjusted Profit of €${ctResult.adjustedTradingProfit.toLocaleString()}.`,
        calculationBreakdown: { ...ctResult },
      });

      setSuccessMessage(`Corporation Tax CT1 record for ${ctTaxYear} successfully saved!`);
      setTimeout(() => setSuccessMessage(null), 4000);
      onFilingRecordGenerated?.('tax');
    } catch (err) {
      console.error('Failed to save CT1 record:', err);
    } finally {
      setSavingRecord(false);
    }
  };

  const handleSaveForm11Record = async (status: IrishTaxReturnStatus = 'ready_to_file') => {
    try {
      setSavingRecord(true);
      const generatedRosRef = status === 'submitted_ros' || status === 'acknowledged'
        ? `ROS-IT11-${itTaxYear}-${Math.floor(100000 + Math.random() * 900000)}`
        : undefined;

      const currentDir = directors.find((d) => d.id === selectedDirectorId);
      const displayName = currentDir 
        ? `${customer.company_name} - Dir: ${currentDir.name} (PPSN: ${currentDir.ppsn})`
        : customer.company_name;

      await irishTaxService.createTaxReturn({
        customerId: customer.id,
        customerName: displayName,
        taxYear: itTaxYear,
        returnType: 'FORM_11',
        dueDate: `${itTaxYear + 1}-11-14`,
        periodStart: `${itTaxYear}-01-01`,
        periodEnd: `${itTaxYear}-12-31`,
        filingDate: generatedRosRef ? new Date().toISOString() : undefined,
        rosAcknowledgmentNumber: generatedRosRef,
        taxableProfitOrIncome: itResult.taxableIncome,
        grossTaxCalculated: itResult.grossIncomeTax,
        taxCreditsAndReliefs: itResult.totalTaxCredits,
        preliminaryTaxPaid: itResult.preliminaryTaxPaid,
        netTaxPayable: itResult.totalTaxLiability,
        balanceDueOrRefund: itResult.balancePayableOrRefund,
        status,
        calculatedBy: 'Practice Tax Specialist',
        notes: `Form 11 Personal Tax Computation for ${currentDir ? currentDir.name : 'Director'} (PPSN: ${currentDir?.ppsn || 'N/A'}). Emoluments €${itResult.grossIncome.toLocaleString()}. IT (€${itResult.netIncomeTax}) + USC (€${itResult.totalUSC}) + PRSI Class S (€${itResult.prsiClassS}).`,
        calculationBreakdown: { ...itResult, directorId: selectedDirectorId, directorName: currentDir?.name, ppsn: currentDir?.ppsn },
      });

      if (currentDir) {
        await directorService.updateDirector(currentDir.id, {
          latestForm11Status: status === 'submitted_ros' ? 'submitted_ros' : status === 'acknowledged' ? 'acknowledged' : 'ready_to_file',
          latestForm11TaxYear: itTaxYear,
        });
      }

      setSuccessMessage(`Form 11 Income Tax filing record for ${currentDir ? currentDir.name : 'Director'} (${itTaxYear}) successfully saved!`);
      setTimeout(() => setSuccessMessage(null), 4000);
      onFilingRecordGenerated?.('tax');
    } catch (err) {
      console.error('Failed to save Form 11 record:', err);
    } finally {
      setSavingRecord(false);
    }
  };

  const handleSaveVAT3Record = async (status: IrishVATReturnStatus = 'ready_to_file') => {
    try {
      setSavingRecord(true);
      const generatedNoticeRef = status === 'submitted_ros' || status === 'acknowledged'
        ? `ROS-VAT3-${vatYear}-${Math.floor(100000 + Math.random() * 900000)}`
        : undefined;

      await irishTaxService.createVatReturn({
        customerId: customer.id,
        customerName: customer.company_name,
        period: vatResult.period,
        year: vatResult.year,
        returnType: 'VAT3',
        dueDate: `${vatResult.year}-03-23`,
        filingDate: generatedNoticeRef ? new Date().toISOString() : undefined,
        rosNoticeNumber: generatedNoticeRef,
        salesStandard23Net: vatResult.salesStandard23Net,
        salesReduced13_5Net: vatResult.salesReduced13_5Net,
        salesSecondReduced9Net: vatResult.salesSecondReduced9Net,
        salesZeroRatedNet: vatResult.salesZeroRatedNet,
        salesExemptNet: vatResult.salesExemptNet,
        boxT1_VatOnSales: vatResult.boxT1_VatOnSales,
        purchasesStandard23Net: vatResult.purchasesStandard23Net,
        purchasesReduced13_5Net: vatResult.purchasesReduced13_5Net,
        boxT2_VatOnPurchases: vatResult.boxT2_VatOnPurchases,
        boxT3_NetPayable: vatResult.boxT3_NetPayable,
        boxT4_NetRepayable: vatResult.boxT4_NetRepayable,
        boxE1_IntraEuSupplies: vatResult.boxE1_IntraEuSupplies,
        boxE2_IntraEuAcquisitions: vatResult.boxE2_IntraEuAcquisitions,
        status,
        filedBy: 'Practice Staff',
        notes: `Prepared via Irish VAT3 Engine. Box T1 €${vatResult.boxT1_VatOnSales} - Box T2 €${vatResult.boxT2_VatOnPurchases}.`,
      });

      setSuccessMessage(`VAT3 statutory record for ${vatResult.period} successfully saved!`);
      setTimeout(() => setSuccessMessage(null), 4000);
      onFilingRecordGenerated?.('vat');
    } catch (err) {
      console.error('Failed to save VAT3 record:', err);
    } finally {
      setSavingRecord(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Context */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-700/80 text-emerald-100 mb-2 border border-emerald-600/50">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              Irish Revenue Commissioners Statutory Engine (TCA 1997 / ROS)
            </div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Calculator className="w-6 h-6 text-emerald-300" />
              Irish Tax &amp; VAT Calculator &mdash; {customer.company_name}
            </h3>
            <p className="text-xs text-emerald-200 mt-1">
              CRO: {customer.cro_number || 'N/A'} &bull; TRN/VAT: {customer.vat_number || 'IE9876543A'} &bull; Auto-computes liabilities and generates ROS filing records.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-emerald-950/60 p-1.5 rounded-xl border border-emerald-700/50">
            <button
              onClick={() => setActiveMode('CT1')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeMode === 'CT1'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              Corporation Tax (CT1)
            </button>
            <button
              onClick={() => setActiveMode('FORM_11')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeMode === 'FORM_11'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              Income Tax (Form 11)
            </button>
            <button
              onClick={() => setActiveMode('VAT3')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeMode === 'VAT3'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              VAT3 Return (Bi-Monthly)
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <span className="text-[11px] text-emerald-700">Check respective tab to view new record</span>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODE 1: CORPORATION TAX (CT1)                                       */}
      {/* =================================================================== */}
      {activeMode === 'CT1' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Column (7 cols) */}
          <div className="lg:col-span-7 space-y-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  CT1 Computation Parameters (Irish 12.5% Trading Regime)
                </h4>
                <span className="text-[11px] text-gray-500">
                  TCA 1997 s21 / s284 Capital Allowances wear &amp; tear
                </span>
              </div>
              <button
                type="button"
                onClick={handleImportFromLedger}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg transition"
                title="Automatically calculate accounting profit, add-backs and capital allowances from client portal records"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Import from Client Bookkeeping
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Tax Accounting Year</label>
                <select
                  value={ctTaxYear}
                  onChange={(e) => setCtTaxYear(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                >
                  <option value={2026}>2026 (Provisional)</option>
                  <option value={2025}>2025 (Current Filing Period)</option>
                  <option value={2024}>2024 (Prior Period)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Accounting Net Profit Before Tax (&euro;)
                </label>
                <input
                  type="number"
                  value={ctAccountingProfit}
                  onChange={(e) => setCtAccountingProfit(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs font-semibold focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Non-Deductible Add-Backs (&euro;)
                  <span className="text-gray-400 font-normal block text-[10px]">Depreciation, client gifts, fines</span>
                </label>
                <input
                  type="number"
                  value={ctAddBacks}
                  onChange={(e) => setCtAddBacks(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Capital Allowances Claimed (&euro;)
                  <span className="text-gray-400 font-normal block text-[10px]">Wear &amp; tear @ 12.5% straight line</span>
                </label>
                <input
                  type="number"
                  value={ctCapitalAllowances}
                  onChange={(e) => setCtCapitalAllowances(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Non-Trading Passive Income (&euro;)
                  <span className="text-gray-400 font-normal block text-[10px]">Rental or overseas interest @ 25%</span>
                </label>
                <input
                  type="number"
                  value={ctPassiveIncome}
                  onChange={(e) => setCtPassiveIncome(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Section 486C Start-up Relief (&euro;)
                  <span className="text-gray-400 font-normal block text-[10px]">Capped at employer PRSI paid</span>
                </label>
                <input
                  type="number"
                  value={ctStartupRelief}
                  onChange={(e) => setCtStartupRelief(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Section 766 R&amp;D Tax Credit (&euro;)
                  <span className="text-gray-400 font-normal block text-[10px]">30% qualifying R&amp;D expenditure</span>
                </label>
                <input
                  type="number"
                  value={ctRdCredit}
                  onChange={(e) => setCtRdCredit(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Preliminary Tax Already Paid (&euro;)
                  <span className="text-gray-400 font-normal block text-[10px]">November ROS preliminary debit</span>
                </label>
                <input
                  type="number"
                  value={ctPreliminaryPaid}
                  onChange={(e) => setCtPreliminaryPaid(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs font-semibold text-emerald-800 focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* Computed Summary Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg border border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                  CT1 Computation Summary
                </span>
                <span className="text-xs text-slate-400 font-mono">ROS Draft</span>
              </div>

              <div className="space-y-2 text-xs font-sans">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300">Accounting Profit:</span>
                  <span className="font-semibold text-white">
                    {formatCurrencyWithSymbol(ctResult.accountingProfit, 'EUR')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300">Adjusted Trading Profit:</span>
                  <span className="font-bold text-white">
                    {formatCurrencyWithSymbol(ctResult.adjustedTradingProfit, 'EUR')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300">Trading CT @ 12.5%:</span>
                  <span className="font-bold text-emerald-400">
                    {formatCurrencyWithSymbol(ctResult.tradingIncomeTax, 'EUR')}
                  </span>
                </div>
                {ctResult.passiveIncome > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-300">Passive CT @ 25.0%:</span>
                    <span className="font-bold text-amber-400">
                      {formatCurrencyWithSymbol(ctResult.passiveIncomeTax, 'EUR')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300">Reliefs &amp; Credits (s486C/R&amp;D):</span>
                  <span className="font-semibold text-emerald-400">
                    -{formatCurrencyWithSymbol(ctResult.smallCompanyRelief_s486C + ctResult.researchAndDevelopmentCredit, 'EUR')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300">Net Corporation Tax Liability:</span>
                  <span className="font-bold text-white">
                    {formatCurrencyWithSymbol(ctResult.netCorporationTaxBeforePrepayments, 'EUR')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300">Preliminary Tax Offset:</span>
                  <span className="font-semibold text-emerald-400">
                    -{formatCurrencyWithSymbol(ctResult.preliminaryTaxPaid, 'EUR')}
                  </span>
                </div>

                {/* Final Net Amount */}
                <div className="pt-3 pb-1">
                  <div className="flex items-center justify-between text-sm font-bold bg-slate-800/80 p-3 rounded-xl border border-slate-600">
                    <span>
                      {ctResult.balancePayableOrRefund >= 0 ? 'Balance Due to Revenue:' : 'Refund Due to Company:'}
                    </span>
                    <span className={ctResult.balancePayableOrRefund >= 0 ? 'text-amber-400 text-base' : 'text-emerald-400 text-base'}>
                      {ctResult.balancePayableOrRefund >= 0
                        ? formatCurrencyWithSymbol(ctResult.balancePayableOrRefund, 'EUR')
                        : `(${formatCurrencyWithSymbol(Math.abs(ctResult.balancePayableOrRefund), 'EUR')})`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  disabled={savingRecord}
                  onClick={() => handleSaveCT1Record('ready_to_file')}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {savingRecord ? 'Generating Record...' : 'Generate & Save CT1 Filing Record'}
                </button>
                <button
                  disabled={savingRecord}
                  onClick={() => handleSaveCT1Record('submitted_ros')}
                  className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Save as Submitted to ROS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODE 2: INCOME TAX / SELF-ASSESSMENT (FORM 11)                      */}
      {/* =================================================================== */}
      {activeMode === 'FORM_11' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Column */}
          <div className="lg:col-span-7 space-y-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-700" />
                Form 11 / Self-Assessed Income Tax Parameters (2025/2026 Budget)
              </h4>
              <span className="text-xs bg-blue-50 text-blue-800 font-medium px-2 py-0.5 rounded border border-blue-200">
                IT + USC + PRSI Class S
              </span>
            </div>

            {/* Director Selector for Company Personal Tax */}
            {directors.length > 0 && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <label className="block font-bold text-gray-800 text-xs">
                  Company Director / Proprietary Officer for Form 11:
                </label>
                <select
                  value={selectedDirectorId}
                  onChange={(e) => handleSelectDirector(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs font-semibold text-emerald-800 focus:ring-1 focus:ring-emerald-700 bg-white"
                >
                  {directors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} &bull; PPSN: {d.ppsn} &bull; {d.shareholdingPercentage}% equity ({d.directorType.toUpperCase()})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-500">
                  Irish proprietary directors (&ge;15% equity) are legally mandated under Revenue Self-Assessment to file Form 11 personal returns.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Tax Year</label>
                <select
                  value={itTaxYear}
                  onChange={(e) => setItTaxYear(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                >
                  <option value={2026}>2026</option>
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Marital Filing Status</label>
                <select
                  value={itMaritalStatus}
                  onChange={(e) => setItMaritalStatus(e.target.value as MaritalStatus)}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="single">Single (&euro;44,000 SRCOP)</option>
                  <option value="married_one_earner">Married (One Earner - &euro;53,000 SRCOP)</option>
                  <option value="married_two_earners">Married (Two Earners - &euro;88,000 SRCOP)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Gross Trading Turnover / Net Profit (&euro;)
                  <span className="text-gray-400 font-normal block text-[10px]">Schedule D Case I/II or director fees</span>
                </label>
                <input
                  type="number"
                  value={itGrossIncome}
                  onChange={(e) => setItGrossIncome(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs font-semibold focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Allowable Deductions / Pension RAC (&euro;)
                  <span className="text-gray-400 font-normal block text-[10px]">Age-banded PRSA/RAC deduction</span>
                </label>
                <input
                  type="number"
                  value={itAllowableDeductions}
                  onChange={(e) => setItAllowableDeductions(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Other Tax Credits (&euro;)
                  <span className="text-gray-400 font-normal block text-[10px]">Rent Tax Credit, Home Carer, etc.</span>
                </label>
                <input
                  type="number"
                  value={itOtherCredits}
                  onChange={(e) => setItOtherCredits(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Preliminary Income Tax Paid (&euro;)
                  <span className="text-gray-400 font-normal block text-[10px]">Prepaid to Revenue</span>
                </label>
                <input
                  type="number"
                  value={itPreliminaryPaid}
                  onChange={(e) => setItPreliminaryPaid(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs font-semibold text-emerald-800 focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-800">
                <input
                  type="checkbox"
                  checked={itIsSelfEmployed}
                  onChange={(e) => setItIsSelfEmployed(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 border-gray-300"
                />
                <span>Subject to PRSI Class S (4.1%) &amp; Earned Income Tax Credit (&euro;2,000)</span>
              </label>
            </div>
          </div>

          {/* Computed Summary Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg border border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <span className="text-xs uppercase font-bold tracking-wider text-blue-400">
                  Form 11 Tax Breakdown
                </span>
                <span className="text-xs text-slate-400 font-mono">SRCOP: &euro;{itResult.standardRateCutOffPoint.toLocaleString()}</span>
              </div>

              <div className="space-y-2 text-xs font-sans">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300">Taxable Net Income:</span>
                  <span className="font-bold text-white">
                    {formatCurrencyWithSymbol(itResult.taxableIncome, 'EUR')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300">Standard Rate Tax (20%):</span>
                  <span className="text-white">
                    {formatCurrencyWithSymbol(itResult.standardRateTax, 'EUR')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300">Higher Rate Tax (40%):</span>
                  <span className="text-white">
                    {formatCurrencyWithSymbol(itResult.higherRateTax, 'EUR')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300">Personal &amp; Earned Credits:</span>
                  <span className="text-emerald-400">
                    -{formatCurrencyWithSymbol(itResult.totalTaxCredits, 'EUR')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800 font-semibold">
                  <span className="text-slate-200">Net Income Tax Subtotal:</span>
                  <span className="text-emerald-400">
                    {formatCurrencyWithSymbol(itResult.netIncomeTax, 'EUR')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300">Universal Social Charge (USC):</span>
                  <span className="text-amber-400 font-medium">
                    {formatCurrencyWithSymbol(itResult.totalUSC, 'EUR')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300">PRSI Class S (4.1%):</span>
                  <span className="text-cyan-400 font-medium">
                    {formatCurrencyWithSymbol(itResult.prsiClassS, 'EUR')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800 font-bold">
                  <span className="text-white">Total Statutory Tax Liability:</span>
                  <span className="text-white">
                    {formatCurrencyWithSymbol(itResult.totalTaxLiability, 'EUR')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300">Preliminary Tax Credit:</span>
                  <span className="text-emerald-400">
                    -{formatCurrencyWithSymbol(itResult.preliminaryTaxPaid, 'EUR')}
                  </span>
                </div>

                {/* Final Net Amount */}
                <div className="pt-3 pb-1">
                  <div className="flex items-center justify-between text-sm font-bold bg-slate-800/80 p-3 rounded-xl border border-slate-600">
                    <span>
                      {itResult.balancePayableOrRefund >= 0 ? 'Balance Due to Revenue:' : 'Refund Due:'}
                    </span>
                    <span className={itResult.balancePayableOrRefund >= 0 ? 'text-amber-400 text-base' : 'text-emerald-400 text-base'}>
                      {itResult.balancePayableOrRefund >= 0
                        ? formatCurrencyWithSymbol(itResult.balancePayableOrRefund, 'EUR')
                        : `(${formatCurrencyWithSymbol(Math.abs(itResult.balancePayableOrRefund), 'EUR')})`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  disabled={savingRecord}
                  onClick={() => handleSaveForm11Record('ready_to_file')}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {savingRecord ? 'Generating Record...' : 'Generate & Save Form 11 Filing Record'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODE 3: VAT3 BI-MONTHLY RETURN                                      */}
      {/* =================================================================== */}
      {activeMode === 'VAT3' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Column */}
          <div className="lg:col-span-7 space-y-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                Irish VAT3 Bi-Monthly Period Supplies &amp; Purchases
              </h4>
              <span className="text-xs bg-emerald-50 text-emerald-800 font-medium px-2 py-0.5 rounded border border-emerald-200">
                Official Revenue VAT3 Boxes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Return Period</label>
                <select
                  value={vatPeriod}
                  onChange={(e) => setVatPeriod(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="2026-P01 (Jan/Feb)">2026-P01 (Jan/Feb)</option>
                  <option value="2026-P02 (Mar/Apr)">2026-P02 (Mar/Apr)</option>
                  <option value="2026-P03 (May/Jun)">2026-P03 (May/Jun)</option>
                  <option value="2026-P04 (Jul/Aug)">2026-P04 (Jul/Aug)</option>
                  <option value="2026-P05 (Sep/Oct)">2026-P05 (Sep/Oct)</option>
                  <option value="2026-P06 (Nov/Dec)">2026-P06 (Nov/Dec)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Standard Rate 23% Sales (Net &euro;)
                </label>
                <input
                  type="number"
                  value={vatSales23}
                  onChange={(e) => setVatSales23(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs font-semibold focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Reduced Rate 13.5% Sales (Net &euro;)
                  <span className="text-gray-400 font-normal block text-[10px]">Catering, cleaning, fuel</span>
                </label>
                <input
                  type="number"
                  value={vatSales135}
                  onChange={(e) => setVatSales135(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Zero-Rated Supplies (Net &euro;)
                  <span className="text-gray-400 font-normal block text-[10px]">Exports, basic foodstuffs</span>
                </label>
                <input
                  type="number"
                  value={vatSalesZero}
                  onChange={(e) => setVatSalesZero(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Standard Rate 23% Purchases (Net &euro;)
                  <span className="text-gray-400 font-normal block text-[10px]">Deductible business expenses</span>
                </label>
                <input
                  type="number"
                  value={vatPurchases23}
                  onChange={(e) => setVatPurchases23(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs font-semibold focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Reduced Rate 13.5% Purchases (Net &euro;)
                </label>
                <input
                  type="number"
                  value={vatPurchases135}
                  onChange={(e) => setVatPurchases135(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Box E1: Intra-EU Supplies (&euro;)
                  <span className="text-gray-400 font-normal block text-[10px]">VIES EU B2B dispatches</span>
                </label>
                <input
                  type="number"
                  value={vatBoxE1}
                  onChange={(e) => setVatBoxE1(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Box E2: Intra-EU Acquisitions (&euro;)
                  <span className="text-gray-400 font-normal block text-[10px]">Reverse-charged inbound services</span>
                </label>
                <input
                  type="number"
                  value={vatBoxE2}
                  onChange={(e) => setVatBoxE2(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* Computed VAT3 Box Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg border border-slate-700 space-y-4 font-mono">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3 font-sans">
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                  Revenue VAT3 Box Calculation
                </span>
                <span className="text-xs text-slate-400">{vatResult.period}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800 font-sans">
                  <span className="text-slate-300 font-semibold">Box T1 &mdash; VAT on Sales:</span>
                  <span className="font-bold text-white">
                    {formatCurrencyWithSymbol(vatResult.boxT1_VatOnSales, 'EUR')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800 font-sans">
                  <span className="text-slate-300 font-semibold text-emerald-400">Box T2 &mdash; Deductible Purchases VAT:</span>
                  <span className="font-bold text-emerald-400">
                    {formatCurrencyWithSymbol(vatResult.boxT2_VatOnPurchases, 'EUR')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800 font-sans">
                  <span className="text-slate-400">Box E1 &mdash; Intra-EU Supplies:</span>
                  <span className="text-slate-200">
                    {formatCurrencyWithSymbol(vatResult.boxE1_IntraEuSupplies, 'EUR')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800 font-sans">
                  <span className="text-slate-400">Box E2 &mdash; Intra-EU Acquisitions:</span>
                  <span className="text-slate-200">
                    {formatCurrencyWithSymbol(vatResult.boxE2_IntraEuAcquisitions, 'EUR')}
                  </span>
                </div>

                {/* Box T3 / T4 Result */}
                <div className="pt-3 pb-1 font-sans">
                  <div className="flex items-center justify-between text-sm font-bold bg-slate-800/80 p-3 rounded-xl border border-slate-600">
                    <span>
                      {vatResult.boxT3_NetPayable > 0 ? 'Box T3: Net VAT Payable:' : 'Box T4: Net Repayable (Refund):'}
                    </span>
                    <span className={vatResult.boxT3_NetPayable > 0 ? 'text-amber-400 text-base' : 'text-emerald-400 text-base'}>
                      {vatResult.boxT3_NetPayable > 0
                        ? formatCurrencyWithSymbol(vatResult.boxT3_NetPayable, 'EUR')
                        : formatCurrencyWithSymbol(vatResult.boxT4_NetRepayable, 'EUR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 font-sans">
                <button
                  disabled={savingRecord}
                  onClick={() => handleSaveVAT3Record('ready_to_file')}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {savingRecord ? 'Generating Record...' : 'Generate & Save VAT3 Filing Record'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

