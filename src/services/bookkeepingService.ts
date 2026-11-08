import { mockStore } from '../data/mockStore';
import type {
  CompanyBookkeepingRecord,
  BookkeepingFinancialSummary,
  TransactionType,
  IncomeCategory,
  ExpenseCategory,
  BookkeepingStatus,
} from '../types/bookkeeping';

class BookkeepingService {
  async getRecordsByCustomer(customerId: string, taxYear?: number): Promise<CompanyBookkeepingRecord[]> {
    if (!customerId) return [];
    const records = mockStore.get<CompanyBookkeepingRecord>('company_bookkeeping');
    return records
      .filter((r) => r.customerId === customerId && (!taxYear || r.taxYear === taxYear))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createRecord(
    input: Omit<CompanyBookkeepingRecord, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<CompanyBookkeepingRecord> {
    const now = new Date().toISOString();
    const net = Number(input.amountNet || 0);
    const vatRate = Number(input.vatRate || 0);
    const vatAmount = Number((net * (vatRate / 100)).toFixed(2));
    const gross = Number((net + vatAmount).toFixed(2));

    // Auto-detect Irish add-backs (Client Entertainment, Fines)
    const isAddBack = input.category === 'client_entertainment' || input.category === 'fines_penalties';
    const isCapAllowance = input.category === 'equipment_purchase';

    const newRecord: CompanyBookkeepingRecord = {
      ...input,
      id: `bk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      amountNet: net,
      vatRate,
      vatAmount,
      amountGross: gross,
      isNonDeductibleAddBack: input.isNonDeductibleAddBack !== undefined ? input.isNonDeductibleAddBack : isAddBack,
      isCapitalAllowanceEligible: input.isCapitalAllowanceEligible !== undefined ? input.isCapitalAllowanceEligible : isCapAllowance,
      createdAt: now,
      updatedAt: now,
    };

    return mockStore.insert<CompanyBookkeepingRecord>('company_bookkeeping', newRecord);
  }

  async updateRecord(id: string, updates: Partial<CompanyBookkeepingRecord>): Promise<CompanyBookkeepingRecord | null> {
    const existing = mockStore.getById<CompanyBookkeepingRecord>('company_bookkeeping', id);
    if (!existing) return null;

    const net = updates.amountNet !== undefined ? Number(updates.amountNet) : existing.amountNet;
    const vatRate = updates.vatRate !== undefined ? Number(updates.vatRate) : existing.vatRate;
    const vatAmount = Number((net * (vatRate / 100)).toFixed(2));
    const gross = Number((net + vatAmount).toFixed(2));

    const cleanUpdates: Partial<CompanyBookkeepingRecord> = {
      ...updates,
      amountNet: net,
      vatRate,
      vatAmount,
      amountGross: gross,
      updatedAt: new Date().toISOString(),
    };

    return mockStore.update<CompanyBookkeepingRecord>('company_bookkeeping', id, cleanUpdates);
  }

  async deleteRecord(id: string): Promise<boolean> {
    return mockStore.delete('company_bookkeeping', id);
  }

  /**
   * Aggregate Irish CT1 tax figures from all bookkeeping items for a customer & tax year
   */
  async getFinancialSummary(customerId: string, taxYear: number): Promise<BookkeepingFinancialSummary> {
    const records = await this.getRecordsByCustomer(customerId, taxYear);

    let totalIncomeNet = 0;
    let tradingIncomeNet = 0;
    let passiveIncomeNet = 0;

    let totalExpensesNet = 0;
    let allowableTradingExpenses = 0;
    let nonDeductibleAddBacks = 0;
    let capitalAllowancesExpenditure = 0;
    let directorRemunerationTotal = 0;

    for (const rec of records) {
      if (rec.transactionType === 'income') {
        totalIncomeNet += rec.amountNet;
        if (rec.category === 'passive_rental' || rec.category === 'interest_dividends') {
          passiveIncomeNet += rec.amountNet;
        } else {
          tradingIncomeNet += rec.amountNet;
        }
      } else if (rec.transactionType === 'expense') {
        totalExpensesNet += rec.amountNet;
        if (rec.isNonDeductibleAddBack) {
          nonDeductibleAddBacks += rec.amountNet;
        } else {
          allowableTradingExpenses += rec.amountNet;
        }

        if (rec.isCapitalAllowanceEligible) {
          capitalAllowancesExpenditure += rec.amountNet;
        }

        if (rec.category === 'director_remuneration') {
          directorRemunerationTotal += rec.amountNet;
        }
      }
    }

    const accountingNetProfit = Number((totalIncomeNet - totalExpensesNet).toFixed(2));

    // Capital allowance claim: standard 12.5% wear & tear on qualifying capital expenditure
    const annualCapitalAllowancesClaim = Number((capitalAllowancesExpenditure * 0.125).toFixed(2));

    // Estimated Adjusted Trading Profit = Accounting Profit + Disallowables - Capital Allowances
    const estimatedAdjustedTradingProfit = Math.max(
      0,
      Number((accountingNetProfit + nonDeductibleAddBacks - annualCapitalAllowancesClaim).toFixed(2))
    );

    return {
      taxYear,
      totalIncomeNet: Number(totalIncomeNet.toFixed(2)),
      totalExpensesNet: Number(totalExpensesNet.toFixed(2)),
      accountingNetProfit,
      tradingIncomeNet: Number(tradingIncomeNet.toFixed(2)),
      passiveIncomeNet: Number(passiveIncomeNet.toFixed(2)),
      allowableTradingExpenses: Number(allowableTradingExpenses.toFixed(2)),
      nonDeductibleAddBacks: Number(nonDeductibleAddBacks.toFixed(2)),
      capitalAllowancesExpenditure: Number(capitalAllowancesExpenditure.toFixed(2)),
      directorRemunerationTotal: Number(directorRemunerationTotal.toFixed(2)),
      estimatedAdjustedTradingProfit,
    };
  }
}

export const bookkeepingService = new BookkeepingService();
