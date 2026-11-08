// ====================================================================
// Company Income & Expense Bookkeeping Model
// Irish Revenue / CT1 Trading vs Passive & Add-Back Categories
// ====================================================================

export type TransactionType = 'income' | 'expense';

export type IncomeCategory =
  | 'trading_sales'          // Standard trading sales (23% / 13.5% / 9% / 0% VAT)
  | 'consulting_services'     // Professional & advisory services
  | 'passive_rental'          // Rental income from property (taxed @ 25% CT)
  | 'grant_funding'           // Enterprise Ireland / LEO grant funding
  | 'interest_dividends'      // Investment income
  | 'other_income';

export type ExpenseCategory =
  | 'cost_of_sales'           // Wholesale inventory / direct production costs
  | 'director_remuneration'   // Proprietary director salary / drawings
  | 'staff_payroll'           // Employee wages, employer PRSI & benefits
  | 'rent_rates'              // Office/warehouse lease and commercial rates
  | 'utilities_office'        // Light, heat, broadband, software SaaS
  | 'subcontractor_costs'     // Third-party freelancers & contractors
  | 'advertising_marketing'   // Digital ads, branding, sponsorships
  | 'professional_legal_fees' // Legal, audit, CRO secretarial fees
  | 'equipment_purchase'      // Plant & machinery (eligible for 12.5% wear & tear)
  | 'client_entertainment'    // Client dinners & gifts (DISALLOWED / ADD-BACK FOR CT1!)
  | 'motor_travel'            // Business mileage and subsistence
  | 'fines_penalties'         // Non-deductible statutory penalties
  | 'other_expenses';

export type BookkeepingStatus = 'submitted' | 'reconciled' | 'approved';

export interface CompanyBookkeepingRecord {
  id: string;
  customerId: string;
  customerName?: string;
  taxYear: number;
  period: string; // e.g. "2025-Annual", "2026-Q1", "2026-P01"
  transactionType: TransactionType;
  date: string;
  
  category: IncomeCategory | ExpenseCategory;
  description: string;
  
  amountNet: number;
  vatRate: number; // 23, 13.5, 9, 0, or 0 (exempt)
  vatAmount: number;
  amountGross: number;
  
  /**
   * Under Irish Taxes Consolidation Act 1997:
   * Client entertaining, depreciation, and fines must be added back to accounting profit
   * when computing CT1 adjusted trading profits.
   */
  isNonDeductibleAddBack: boolean;
  
  /**
   * Capital expenditure (plant & machinery) qualifies for 12.5% p.a. capital allowances.
   */
  isCapitalAllowanceEligible: boolean;
  
  payeeOrCustomer: string;
  invoiceOrReceiptNumber?: string;
  receiptDocumentId?: string;
  
  source: 'portal_entry' | 'csv_import' | 'bank_feed' | 'admin_entry';
  status: BookkeepingStatus;
  
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookkeepingFinancialSummary {
  taxYear: number;
  totalIncomeNet: number;
  totalExpensesNet: number;
  accountingNetProfit: number;
  
  // Irish CT1 tax analysis breakdown
  tradingIncomeNet: number;
  passiveIncomeNet: number;
  allowableTradingExpenses: number;
  nonDeductibleAddBacks: number;
  capitalAllowancesExpenditure: number;
  directorRemunerationTotal: number;
  
  estimatedAdjustedTradingProfit: number;
}
