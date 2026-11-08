// ====================================================================
// Irish Tax System & Compliance Types
// Chartered Accountants Ireland (CAI) & Revenue Commissioners (ROS)
// ====================================================================

export type IrishTaxReturnType =
  | 'CT1'              // Corporation Tax (Companies Act 2014 & TCA 1997)
  | 'FORM_11'          // Income Tax / Self-Assessment (Sole Traders & Proprietary Directors)
  | 'FORM_12'          // PAYE Employee Income Tax Return
  | 'CGT'              // Capital Gains Tax Return (CG1)
  | 'CAT'              // Capital Acquisitions Tax Return (IT38)
  | 'PRELIMINARY_TAX'; // Mandatory Irish preliminary tax payment record

export type IrishTaxReturnStatus =
  | 'draft'            // Computation in progress
  | 'ready_to_file'    // Partner/Manager approved, awaiting ROS upload
  | 'submitted_ros'    // Transmitted via ROS (Revenue Online Service)
  | 'acknowledged'     // ROS Notice of Assessment received
  | 'paid';            // Net tax liability cleared with Revenue

export interface IrishTaxReturn {
  id: string;
  customerId: string;
  customerName?: string;
  taxYear: number;
  returnType: IrishTaxReturnType;
  filingDate?: string;
  dueDate: string;
  periodStart: string;
  periodEnd: string;
  rosAcknowledgmentNumber?: string;
  
  // Financial computation
  taxableProfitOrIncome: number;
  grossTaxCalculated: number;
  taxCreditsAndReliefs: number;
  preliminaryTaxPaid: number;
  netTaxPayable: number;
  balanceDueOrRefund: number; // Positive = Due to Revenue, Negative = Refund due
  
  status: IrishTaxReturnStatus;
  calculatedBy?: string;
  notes?: string;
  calculationBreakdown?: Record<string, any>;
  attachments?: { name: string; url?: string; type?: string }[];
  
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------------------------
// Irish VAT Return Types (Revenue Commissioners VAT3 & RTD)
// ----------------------------------------------------------------------

export type IrishVATReturnType =
  | 'VAT3'      // Bi-Monthly VAT Return
  | 'RTD'       // Annual Return of Trading Details
  | 'MOSS_OSS'  // Mini One Stop Shop / One Stop Shop (EU e-Commerce)
  | 'VIES';     // VAT Information Exchange System (Intra-EU B2B)

export type IrishVATReturnStatus =
  | 'draft'
  | 'ready_to_file'
  | 'submitted_ros'
  | 'acknowledged'
  | 'paid';

export interface IrishVATReturn {
  id: string;
  customerId: string;
  customerName?: string;
  period: string; // e.g. "2026-P01 (Jan/Feb)", "2025-RTD"
  year: number;
  periodIndex?: number; // 1 to 6 for bi-monthly
  returnType: IrishVATReturnType;
  filingDate?: string;
  dueDate: string;
  rosNoticeNumber?: string;
  
  // Official Irish Revenue VAT3 Box Data
  salesStandard23Net: number;
  salesReduced13_5Net: number;
  salesSecondReduced9Net: number;
  salesZeroRatedNet: number;
  salesExemptNet: number;
  
  /** Box T1: Total VAT on Sales (Output VAT payable) */
  boxT1_VatOnSales: number;
  
  purchasesStandard23Net: number;
  purchasesReduced13_5Net: number;
  
  /** Box T2: Total VAT on Purchases (Input VAT deductible) */
  boxT2_VatOnPurchases: number;
  
  /** Box T3: Net VAT Payable to Revenue (if T1 > T2) */
  boxT3_NetPayable: number;
  
  /** Box T4: Net VAT Repayable from Revenue (if T2 > T1) */
  boxT4_NetRepayable: number;
  
  /** Box E1: Intra-EU supplies of goods/services */
  boxE1_IntraEuSupplies: number;
  
  /** Box E2: Intra-EU acquisitions of goods/services (Reverse Charge) */
  boxE2_IntraEuAcquisitions: number;
  
  status: IrishVATReturnStatus;
  filedBy?: string;
  notes?: string;
  
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------------------------
// Irish Tax Calculation Result Interfaces
// ----------------------------------------------------------------------

export interface CorporationTaxCalculationResult {
  taxYear: number;
  accountingProfit: number;
  nonDeductibleAddBacks: number;
  capitalAllowances: number;
  adjustedTradingProfit: number;
  
  // Tax calculations
  tradingIncomeTaxRate: number; // 12.5%
  tradingIncomeTax: number;
  
  passiveIncome: number;
  passiveIncomeTaxRate: number; // 25.0%
  passiveIncomeTax: number;
  
  grossCorporationTax: number;
  
  // Reliefs & Credits
  smallCompanyRelief_s486C: number;
  researchAndDevelopmentCredit: number;
  otherTaxReliefs: number;
  netCorporationTaxBeforePrepayments: number;
  
  preliminaryTaxPaid: number;
  balancePayableOrRefund: number; // Positive = Due, Negative = Refund
}

export type MaritalStatus = 'single' | 'married_one_earner' | 'married_two_earners';

export interface IrishIncomeTaxCalculationResult {
  taxYear: number;
  maritalStatus: MaritalStatus;
  grossIncome: number;
  allowableDeductions: number; // pension, allowable business expenses
  taxableIncome: number;
  
  standardRateCutOffPoint: number; // e.g. €44,000 for single (2025/2026)
  standardRateTax: number; // 20%
  higherRateTax: number;   // 40%
  grossIncomeTax: number;
  
  // Credits
  personalTaxCredit: number;
  earnedIncomeTaxCredit: number;
  employeePAYETaxCredit: number;
  otherCredits: number;
  totalTaxCredits: number;
  netIncomeTax: number;
  
  // Universal Social Charge (USC)
  uscBand1_0_5: number;
  uscBand2_2_0: number;
  uscBand3_3_0: number;
  uscBand4_8_0: number;
  uscSurcharge11_0: number;
  totalUSC: number;
  
  // PRSI Class S (Self-Employed)
  prsiClassS: number;
  
  // Totals
  totalTaxLiability: number; // IT + USC + PRSI
  preliminaryTaxPaid: number;
  balancePayableOrRefund: number;
}

export interface IrishVAT3CalculationResult {
  period: string;
  year: number;
  salesStandard23Net: number;
  salesReduced13_5Net: number;
  salesSecondReduced9Net: number;
  salesZeroRatedNet: number;
  salesExemptNet: number;
  boxT1_VatOnSales: number;
  
  purchasesStandard23Net: number;
  purchasesReduced13_5Net: number;
  boxT2_VatOnPurchases: number;
  
  boxT3_NetPayable: number;
  boxT4_NetRepayable: number;
  
  boxE1_IntraEuSupplies: number;
  boxE2_IntraEuAcquisitions: number;
}

