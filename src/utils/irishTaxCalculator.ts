import type {
  CorporationTaxCalculationResult,
  IrishIncomeTaxCalculationResult,
  IrishVAT3CalculationResult,
  MaritalStatus,
} from '../types/irishTax';

/**
 * Irish Corporation Tax (CT1) Calculator
 * Implements Irish Taxes Consolidation Act 1997 rules (12.5% trading, 25% passive).
 */
export interface CorporationTaxInputs {
  taxYear: number;
  accountingProfit: number;
  nonDeductibleAddBacks?: number;
  capitalAllowances?: number;
  passiveIncome?: number;
  smallCompanyRelief_s486C?: number; // Section 486C start-up relief
  researchAndDevelopmentCredit?: number; // 30% R&D credit
  otherTaxReliefs?: number;
  preliminaryTaxPaid?: number;
}

export function calculateIrishCorporationTax(inputs: CorporationTaxInputs): CorporationTaxCalculationResult {
  const taxYear = inputs.taxYear || 2025;
  const accountingProfit = Math.max(0, inputs.accountingProfit || 0);
  const nonDeductibleAddBacks = Math.max(0, inputs.nonDeductibleAddBacks || 0);
  const capitalAllowances = Math.max(0, inputs.capitalAllowances || 0);
  const passiveIncome = Math.max(0, inputs.passiveIncome || 0);
  const preliminaryTaxPaid = Math.max(0, inputs.preliminaryTaxPaid || 0);

  // Adjusted Trading Profit = Accounting Profit + Disallowables - Capital Allowances
  const adjustedTradingProfit = Math.max(0, accountingProfit + nonDeductibleAddBacks - capitalAllowances);

  // Trading Income Tax @ 12.5%
  const tradingIncomeTaxRate = 0.125;
  const tradingIncomeTax = Number((adjustedTradingProfit * tradingIncomeTaxRate).toFixed(2));

  // Passive / Non-trading Income Tax @ 25.0%
  const passiveIncomeTaxRate = 0.25;
  const passiveIncomeTax = Number((passiveIncome * passiveIncomeTaxRate).toFixed(2));

  const grossCorporationTax = Number((tradingIncomeTax + passiveIncomeTax).toFixed(2));

  // Reliefs & Credits
  const smallCompanyRelief = Math.min(grossCorporationTax, Math.max(0, inputs.smallCompanyRelief_s486C || 0));
  const rdCredit = Math.max(0, inputs.researchAndDevelopmentCredit || 0);
  const otherReliefs = Math.max(0, inputs.otherTaxReliefs || 0);

  const totalCredits = smallCompanyRelief + rdCredit + otherReliefs;
  const netCorporationTaxBeforePrepayments = Math.max(0, Number((grossCorporationTax - totalCredits).toFixed(2)));

  // Balance due (positive) or refund due (negative)
  const balancePayableOrRefund = Number((netCorporationTaxBeforePrepayments - preliminaryTaxPaid).toFixed(2));

  return {
    taxYear,
    accountingProfit,
    nonDeductibleAddBacks,
    capitalAllowances,
    adjustedTradingProfit,
    tradingIncomeTaxRate,
    tradingIncomeTax,
    passiveIncome,
    passiveIncomeTaxRate,
    passiveIncomeTax,
    grossCorporationTax,
    smallCompanyRelief_s486C: smallCompanyRelief,
    researchAndDevelopmentCredit: rdCredit,
    otherTaxReliefs: otherReliefs,
    netCorporationTaxBeforePrepayments,
    preliminaryTaxPaid,
    balancePayableOrRefund,
  };
}

/**
 * Irish Income Tax / Self-Assessment (Form 11 / Form 12) Calculator
 * 2025/2026 Irish Budget rules:
 * - SRCOP: €44,000 (Single), €53,000 (Married 1 Earner), €88,000 (Married 2 Earners)
 * - 20% standard rate, 40% higher rate
 * - Personal Credit: €2,000 (Single) / €4,000 (Married)
 * - Earned Income Credit: €2,000 (Self-employed / Proprietary Director)
 * - USC Bands: 0.5% (to €12,012), 2% (to €27,382), 3% (to €70,044), 8% (excess), 11% surcharge over €100k
 * - PRSI Class S: 4.1% (min €500)
 */
export interface IncomeTaxInputs {
  taxYear: number;
  maritalStatus: MaritalStatus;
  isSelfEmployedOrDirector: boolean;
  grossIncome: number;
  allowableDeductions?: number; // e.g. pension contributions, business expenses
  otherCredits?: number;
  preliminaryTaxPaid?: number;
}

export function calculateIrishIncomeTax(inputs: IncomeTaxInputs): IrishIncomeTaxCalculationResult {
  const taxYear = inputs.taxYear || 2025;
  const maritalStatus = inputs.maritalStatus || 'single';
  const grossIncome = Math.max(0, inputs.grossIncome || 0);
  const allowableDeductions = Math.max(0, inputs.allowableDeductions || 0);
  const preliminaryTaxPaid = Math.max(0, inputs.preliminaryTaxPaid || 0);

  const taxableIncome = Math.max(0, grossIncome - allowableDeductions);

  // Standard Rate Cut-Off Point (SRCOP)
  let standardRateCutOffPoint = 44000;
  if (maritalStatus === 'married_one_earner') {
    standardRateCutOffPoint = 53000;
  } else if (maritalStatus === 'married_two_earners') {
    standardRateCutOffPoint = 88000;
  }

  // Income Tax Calculation
  const standardTaxable = Math.min(taxableIncome, standardRateCutOffPoint);
  const higherTaxable = Math.max(0, taxableIncome - standardRateCutOffPoint);

  const standardRateTax = Number((standardTaxable * 0.20).toFixed(2));
  const higherRateTax = Number((higherTaxable * 0.40).toFixed(2));
  const grossIncomeTax = Number((standardRateTax + higherRateTax).toFixed(2));

  // Tax Credits
  const personalTaxCredit = maritalStatus === 'single' ? 2000 : 4000;
  const earnedIncomeTaxCredit = inputs.isSelfEmployedOrDirector ? 2000 : 0;
  const employeePAYETaxCredit = !inputs.isSelfEmployedOrDirector ? 2000 : 0;
  const otherCredits = Math.max(0, inputs.otherCredits || 0);
  const totalTaxCredits = personalTaxCredit + earnedIncomeTaxCredit + employeePAYETaxCredit + otherCredits;

  const netIncomeTax = Math.max(0, Number((grossIncomeTax - totalTaxCredits).toFixed(2)));

  // Universal Social Charge (USC) Calculation
  let uscBand1_0_5 = 0;
  let uscBand2_2_0 = 0;
  let uscBand3_3_0 = 0;
  let uscBand4_8_0 = 0;
  let uscSurcharge11_0 = 0;

  if (taxableIncome > 13000) { // USC exemption threshold is €13,000
    // Band 1: Up to €12,012 @ 0.5%
    const band1Amount = Math.min(taxableIncome, 12012);
    uscBand1_0_5 = Number((band1Amount * 0.005).toFixed(2));

    // Band 2: €12,012 to €27,382 (span of €15,370) @ 2.0%
    if (taxableIncome > 12012) {
      const band2Amount = Math.min(taxableIncome - 12012, 15370);
      uscBand2_2_0 = Number((band2Amount * 0.02).toFixed(2));
    }

    // Band 3: €27,382 to €70,044 (span of €42,662) @ 3.0%
    if (taxableIncome > 27382) {
      const band3Amount = Math.min(taxableIncome - 27382, 42662);
      uscBand3_3_0 = Number((band3Amount * 0.03).toFixed(2));
    }

    // Band 4: Excess over €70,044 @ 8.0% (up to €100,000 for self-employed, or all excess for PAYE)
    if (taxableIncome > 70044) {
      if (inputs.isSelfEmployedOrDirector) {
        const band4Amount = Math.min(taxableIncome - 70044, 100000 - 70044);
        uscBand4_8_0 = Number((band4Amount * 0.08).toFixed(2));

        // Self-employed 3% surcharge on income over €100k (making total 11%)
        if (taxableIncome > 100000) {
          const surchargeAmount = taxableIncome - 100000;
          uscSurcharge11_0 = Number((surchargeAmount * 0.11).toFixed(2));
        }
      } else {
        const band4Amount = taxableIncome - 70044;
        uscBand4_8_0 = Number((band4Amount * 0.08).toFixed(2));
      }
    }
  }

  const totalUSC = Number((uscBand1_0_5 + uscBand2_2_0 + uscBand3_3_0 + uscBand4_8_0 + uscSurcharge11_0).toFixed(2));

  // PRSI Class S (4.1% for Self-Employed, minimum €500)
  let prsiClassS = 0;
  if (inputs.isSelfEmployedOrDirector && taxableIncome > 0) {
    prsiClassS = Math.max(500, Number((taxableIncome * 0.041).toFixed(2)));
  }

  // Total Tax Liability
  const totalTaxLiability = Number((netIncomeTax + totalUSC + prsiClassS).toFixed(2));
  const balancePayableOrRefund = Number((totalTaxLiability - preliminaryTaxPaid).toFixed(2));

  return {
    taxYear,
    maritalStatus,
    grossIncome,
    allowableDeductions,
    taxableIncome,
    standardRateCutOffPoint,
    standardRateTax,
    higherRateTax,
    grossIncomeTax,
    personalTaxCredit,
    earnedIncomeTaxCredit,
    employeePAYETaxCredit,
    otherCredits,
    totalTaxCredits,
    netIncomeTax,
    uscBand1_0_5,
    uscBand2_2_0,
    uscBand3_3_0,
    uscBand4_8_0,
    uscSurcharge11_0,
    totalUSC,
    prsiClassS,
    totalTaxLiability,
    preliminaryTaxPaid,
    balancePayableOrRefund,
  };
}

/**
 * Irish VAT3 Return Calculator
 * Computes official boxes T1, T2, T3, T4, E1, E2
 */
export interface VAT3Inputs {
  period: string; // e.g. "2026-P01 (Jan/Feb)"
  year: number;
  salesStandard23Net: number;
  salesReduced13_5Net?: number;
  salesSecondReduced9Net?: number;
  salesZeroRatedNet?: number;
  salesExemptNet?: number;
  purchasesStandard23Net: number;
  purchasesReduced13_5Net?: number;
  boxE1_IntraEuSupplies?: number;
  boxE2_IntraEuAcquisitions?: number;
}

export function calculateIrishVAT3(inputs: VAT3Inputs): IrishVAT3CalculationResult {
  const s23 = Math.max(0, inputs.salesStandard23Net || 0);
  const s135 = Math.max(0, inputs.salesReduced13_5Net || 0);
  const s9 = Math.max(0, inputs.salesSecondReduced9Net || 0);
  const s0 = Math.max(0, inputs.salesZeroRatedNet || 0);
  const sExempt = Math.max(0, inputs.salesExemptNet || 0);

  const p23 = Math.max(0, inputs.purchasesStandard23Net || 0);
  const p135 = Math.max(0, inputs.purchasesReduced13_5Net || 0);
  const e1 = Math.max(0, inputs.boxE1_IntraEuSupplies || 0);
  const e2 = Math.max(0, inputs.boxE2_IntraEuAcquisitions || 0);

  // Box T1: VAT on Sales
  // Note: Intra-EU acquisitions (Box E2) are reverse-charged so VAT is included in T1 and simultaneously credited in T2
  const vatOnSales = (s23 * 0.23) + (s135 * 0.135) + (s9 * 0.09) + (e2 * 0.23);
  const boxT1_VatOnSales = Number(vatOnSales.toFixed(2));

  // Box T2: VAT on Purchases
  const vatOnPurchases = (p23 * 0.23) + (p135 * 0.135) + (e2 * 0.23);
  const boxT2_VatOnPurchases = Number(vatOnPurchases.toFixed(2));

  // Box T3 (Net Payable) or Box T4 (Net Repayable)
  let boxT3_NetPayable = 0;
  let boxT4_NetRepayable = 0;

  if (boxT1_VatOnSales >= boxT2_VatOnPurchases) {
    boxT3_NetPayable = Number((boxT1_VatOnSales - boxT2_VatOnPurchases).toFixed(2));
  } else {
    boxT4_NetRepayable = Number((boxT2_VatOnPurchases - boxT1_VatOnSales).toFixed(2));
  }

  return {
    period: inputs.period,
    year: inputs.year || 2026,
    salesStandard23Net: s23,
    salesReduced13_5Net: s135,
    salesSecondReduced9Net: s9,
    salesZeroRatedNet: s0,
    salesExemptNet: sExempt,
    boxT1_VatOnSales,
    purchasesStandard23Net: p23,
    purchasesReduced13_5Net: p135,
    boxT2_VatOnPurchases,
    boxT3_NetPayable,
    boxT4_NetRepayable,
    boxE1_IntraEuSupplies: e1,
    boxE2_IntraEuAcquisitions: e2,
  };
}

