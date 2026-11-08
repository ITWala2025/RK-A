/**
 * Autonomous CRM Agents & Copilot Module
 * Multi-Agent Autonomous Diagnostic Engine
 */

import { AgentInsight, AgentDataProvider, AgentSeverity, AgentActionType } from '../types';
import { copilotSettingsService } from './copilotSettingsService';
import { mockStore } from '../../../data/mockStore';
import type { Quote } from '../../../types/quote';
import type { Invoice, CompanySettings, Customer } from '../../../types/invoice';
import type { Contract } from '../../../types/contract';
import type { Expense } from '../../../services/expenseService';
import type { IrishTaxReturn, IrishVATReturn } from '../../../types/irishTax';
import type { CompanyDirector } from '../../../types/director';

/**
 * Default CRM mock data provider.
 * When exported outside this app, can be replaced by any REST/GraphQL/Supabase provider.
 */
export const defaultDataProvider: AgentDataProvider = {
  async getQuotes(companyId?: string) {
    const quotes = mockStore.get<Quote>('quotes');
    return companyId ? quotes.filter((q) => q.company_settings_id === companyId) : quotes;
  },
  async getInvoices(companyId?: string) {
    const invoices = mockStore.get<Invoice>('invoices');
    return companyId ? invoices.filter((i) => i.company_settings_id === companyId) : invoices;
  },
  async getContracts(companyId?: string) {
    const contracts = mockStore.get<Contract>('contracts');
    return companyId ? contracts.filter((c) => c.company_settings_id === companyId) : contracts;
  },
  async getExpenses(companyId?: string) {
    const expenses = mockStore.get<Expense>('expenses');
    return companyId ? expenses.filter((e) => e.company_settings_id === companyId) : expenses;
  },
  async getCustomers() {
    return mockStore.get<Customer>('customers');
  },
  async getCompanySettings(companyId?: string) {
    const list = mockStore.get<CompanySettings>('company_settings');
    if (companyId) {
      return list.find((c) => c.id === companyId) || list[0];
    }
    return list.find((c) => c.is_default) || list[0];
  },
  async getTaxReturns() {
    return mockStore.get<IrishTaxReturn>('irish_tax_returns');
  },
  async getVatReturns() {
    return mockStore.get<IrishVATReturn>('irish_vat_returns');
  },
  async getDirectors() {
    return mockStore.get<CompanyDirector>('company_directors');
  },
};

export class AgentEngine {
  private dataProvider: AgentDataProvider;

  constructor(dataProvider: AgentDataProvider = defaultDataProvider) {
    this.dataProvider = dataProvider;
  }

  public setDataProvider(provider: AgentDataProvider) {
    this.dataProvider = provider;
  }

  /**
   * 1. Deal Health & CPQ Estimator Agent
   */
  public async runDealHealthAgent(companyId?: string): Promise<AgentInsight[]> {
    const settings = copilotSettingsService.getSettings();
    if (!settings.enabled || !settings.agents.dealHealth) return [];

    const quotes = await this.dataProvider.getQuotes(companyId);
    const insights: AgentInsight[] = [];
    const now = new Date();
    const expiryThreshold = settings.thresholds.quoteExpiryWarningDays;
    const discountThreshold = settings.thresholds.quoteDiscountWarningPercent;

    for (const quote of quotes) {
      const qCurr = quote.currency_code === 'EUR' ? '€' : quote.currency_code === 'INR' ? '₹' : quote.currency_code === 'USD' ? '$' : '€';

      // 1. Check for nearing expiry
      if (quote.status === 'sent' && quote.valid_until) {
        const expiryDate = new Date(quote.valid_until);
        const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays >= 0 && diffDays <= expiryThreshold) {
          insights.push({
            id: `dh-exp-${quote.id}`,
            agentName: 'DealHealthAgent',
            agentLabel: 'Deal Health & Estimator Agent',
            actionType: 'ALERT',
            severity: diffDays <= 2 ? 'high' : 'medium',
            title: `Quote ${quote.quote_number} Expiring in ${diffDays} Day${diffDays === 1 ? '' : 's'}`,
            description: `Valued at ${qCurr}${quote.total_amount?.toLocaleString()} for ${quote.customer?.company_name || 'Customer'}. Immediate follow-up or validity extension recommended before quote terms lapse.`,
            entityType: 'quote',
            entityId: quote.id,
            status: 'PENDING_REVIEW',
            timestamp: new Date().toISOString(),
            metadata: {
              daysToExpiry: diffDays,
              quoteTotal: quote.total_amount,
              expiryDate: quote.valid_until,
              customerName: quote.customer?.company_name,
            },
          });
        }
      }

      // 2. High Discount Alert
      if (quote.subtotal && quote.discount_amount) {
        const discountPercentage = (quote.discount_amount / quote.subtotal) * 100;
        if (discountPercentage >= discountThreshold) {
          insights.push({
            id: `dh-disc-${quote.id}`,
            agentName: 'DealHealthAgent',
            agentLabel: 'Deal Health & Estimator Agent',
            actionType: 'RECOMMENDATION',
            severity: discountPercentage >= 25 ? 'high' : 'medium',
            title: `High Discount Warning (${discountPercentage.toFixed(1)}%) on ${quote.quote_number}`,
            description: `Discount of ${qCurr}${quote.discount_amount.toLocaleString()} exceeds your standard ${discountThreshold}% threshold. Consider capping discount or requesting executive approval.`,
            entityType: 'quote',
            entityId: quote.id,
            status: 'PENDING_REVIEW',
            timestamp: new Date().toISOString(),
            metadata: {
              originalDiscountPercent: Math.round(discountPercentage),
              suggestedDiscountPercent: 10,
              discountAmount: quote.discount_amount,
              subtotal: quote.subtotal,
              quoteTotal: quote.total_amount,
            },
          });
        }
      }
    }

    return insights;
  }

  /**
   * 2. Collections & Cash Flow Chaser Agent
   */
  public async runCollectionsAgent(companyId?: string): Promise<AgentInsight[]> {
    const settings = copilotSettingsService.getSettings();
    if (!settings.enabled || !settings.agents.collections) return [];

    const invoices = await this.dataProvider.getInvoices(companyId);
    const company = await this.dataProvider.getCompanySettings(companyId);
    const insights: AgentInsight[] = [];
    const now = new Date();
    const graceDays = settings.thresholds.invoiceOverdueGraceDays;

    for (const inv of invoices) {
      const isOverdue =
        inv.status === 'overdue' ||
        (inv.payment_status !== 'paid' && inv.due_date && new Date(inv.due_date) < now);

      if (isOverdue) {
        const dueDate = new Date(inv.due_date || now.toISOString());
        const daysOverdue = Math.max(1, Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));

        if (daysOverdue >= graceDays) {
          let bucket = '1-15 days';
          let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';

          if (daysOverdue > 60) {
            bucket = '60+ days';
            severity = 'critical';
          } else if (daysOverdue > 30) {
            bucket = '31-60 days';
            severity = 'high';
          } else if (daysOverdue > 15) {
            bucket = '16-30 days';
            severity = 'medium';
          }

          const curr = inv.currency_code === 'EUR' ? '€' : inv.currency_code === 'INR' ? '₹' : inv.currency_code === 'USD' ? '$' : '€';
          const balance = inv.total_amount || 0;
          const customerEmail = inv.customer?.billing_email || inv.customer?.email || 'accounts@client.com';
          const customerName = inv.customer?.company_name || 'Valued Partner';

          // Synthesize personalized payment reminder draft
          const bankingInfo = {
            bankName: company?.bank_name || 'Barclays International Corporate Banking',
            accountNumber: company?.account_number || '****9821',
            iban: company?.iban || 'IE29 AIBK 9311 5212 3456 78',
            swiftBic: company?.swift_bic || 'AIBKIE2D',
            ifscCode: company?.ifsc_code,
          };

          const draftSubject = `URGENT: Outstanding Balance for Invoice ${inv.invoice_number} (${curr}${balance.toLocaleString()})`;
          const draftBody = `Dear Accounts Payable Team at ${customerName},

According to our records, payment for invoice ${inv.invoice_number} in the amount of ${curr}${balance.toLocaleString()} was due on ${inv.due_date} and is currently ${daysOverdue} days past due (${bucket} aging bucket).

Please remit payment to our designated corporate banking coordinates:
- Beneficiary: ${company?.company_name || 'Enterprise CRM Operating Entity'}
- Bank: ${bankingInfo.bankName}
- IBAN: ${bankingInfo.iban}
- BIC / SWIFT: ${bankingInfo.swiftBic}
- Reference: ${inv.invoice_number}

If payment has already been initiated, kindly reply with the transaction remittance advice.

Sincerely,
Automated Revenue & Collections Desk`;

          insights.push({
            id: `col-${inv.id}`,
            agentName: 'CollectionsAgent',
            agentLabel: 'Collections & Cash Chaser Agent',
            actionType: 'DRAFT_CREATED',
            severity,
            title: `Payment Follow-up Ready for ${inv.invoice_number} (${daysOverdue}d Overdue)`,
            description: `Outstanding balance of ${curr}${balance.toLocaleString()} for ${customerName} (${bucket}). Personalized payment reminder email synthesized with bank coordinates.`,
            entityType: 'invoice',
            entityId: inv.id,
            status: 'PENDING_REVIEW',
            timestamp: new Date().toISOString(),
            metadata: {
              daysOverdue,
              balanceDue: balance,
              draftRecipient: customerEmail,
              draftSubject,
              draftBody,
              bankingCoordinates: bankingInfo,
            },
          });
        }
      }
    }

    return insights;
  }

  /**
   * 3. Contract Compliance & Renewal Agent
   */
  public async runComplianceAgent(companyId?: string): Promise<AgentInsight[]> {
    const settings = copilotSettingsService.getSettings();
    if (!settings.enabled || !settings.agents.compliance) return [];

    const contracts = await this.dataProvider.getContracts(companyId);
    const insights: AgentInsight[] = [];
    const now = new Date();
    const horizon = settings.thresholds.contractRenewalWarningDays;

    for (const ctr of contracts) {
      if (ctr.status === 'active' && ctr.expiry_date) {
        const expiryDate = new Date(ctr.expiry_date);
        const daysToExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysToExpiry > 0 && daysToExpiry <= horizon) {
          insights.push({
            id: `ctr-renew-${ctr.id}`,
            agentName: 'ComplianceAgent',
            agentLabel: 'Contract Compliance & Renewal Agent',
            actionType: 'RECOMMENDATION',
            severity: daysToExpiry <= 30 ? 'high' : 'medium',
            title: `Contract ${ctr.contract_number} Expiring in ${daysToExpiry} Days`,
            description: `Master Agreement "${ctr.contract_title}" with ${ctr.party_b_name || 'Customer'} reaches maturity on ${ctr.expiry_date}. Auto-renewal quote generation recommended.`,
            entityType: 'contract',
            entityId: ctr.id,
            status: 'PENDING_REVIEW',
            timestamp: new Date().toISOString(),
            metadata: {
              daysToExpiry,
              expiryDate: ctr.expiry_date,
              contractValue: ctr.contract_value || 25000,
              renewalQuoteTitle: `Renewal: ${ctr.contract_title}`,
              suggestedTermMonths: 12,
            },
          });
        }
      }
    }

    return insights;
  }

  /**
   * 4. Financial Anomaly & Expense Auditor Agent
   */
  public async runFinanceAuditorAgent(companyId?: string): Promise<AgentInsight[]> {
    const settings = copilotSettingsService.getSettings();
    if (!settings.enabled || !settings.agents.financeAuditor) return [];

    const expenses = await this.dataProvider.getExpenses(companyId);
    const insights: AgentInsight[] = [];
    const seenVendorDate = new Map<string, Expense>();
    const highExpenseLimit = settings.thresholds.largeExpenseThreshold;

    for (const exp of expenses) {
      const expCurr = exp.currency === 'EUR' ? '€' : exp.currency === 'INR' ? '₹' : exp.currency === 'USD' ? '$' : '€';

      // 1. Duplicate check (same vendor_name, same expense_date, similar amount)
      const key = `${(exp.vendor_name || '').toLowerCase().trim()}_${exp.expense_date}_${exp.amount}`;
      if (seenVendorDate.has(key)) {
        const original = seenVendorDate.get(key)!;
        insights.push({
          id: `fin-dup-${exp.id}`,
          agentName: 'FinanceAuditor',
          agentLabel: 'Financial Anomaly & Expense Auditor',
          actionType: 'ALERT',
          severity: 'high',
          title: `Potential Duplicate Expense Detected`,
          description: `Expense #${exp.expense_number} (${exp.title || 'Expense'}: ${expCurr}${exp.amount.toLocaleString()}) matches another transaction logged for vendor "${exp.vendor_name}" on ${exp.expense_date}.`,
          entityType: 'expense',
          entityId: exp.id,
          status: 'PENDING_REVIEW',
          timestamp: new Date().toISOString(),
          metadata: {
            duplicateExpenseIds: [original.id, exp.id],
            matchedVendor: exp.vendor_name,
            matchedAmount: exp.amount,
            matchedDate: exp.expense_date,
          },
        });
      } else {
        seenVendorDate.set(key, exp);
      }

      // 2. High Value Discretionary Expense (> threshold)
      if (exp.amount >= highExpenseLimit && exp.payment_status === 'pending') {
        insights.push({
          id: `fin-high-${exp.id}`,
          agentName: 'FinanceAuditor',
          agentLabel: 'Financial Anomaly & Expense Auditor',
          actionType: 'ALERT',
          severity: 'medium',
          title: `Large Expense Awaiting Controller Signoff`,
          description: `Expense #${exp.expense_number} of ${expCurr}${exp.amount.toLocaleString()} for "${exp.description || exp.title}" exceeds the ${expCurr}${highExpenseLimit.toLocaleString()} discretionary threshold.`,
          entityType: 'expense',
          entityId: exp.id,
          status: 'PENDING_REVIEW',
          timestamp: new Date().toISOString(),
          metadata: {
            matchedAmount: exp.amount,
            vendorName: exp.vendor_name,
          },
        });
      }
    }

    return insights;
  }

  /**
   * 5. Customer 360 & Account Retention Scout
   */
  public async runCustomerScoutAgent(): Promise<AgentInsight[]> {
    const settings = copilotSettingsService.getSettings();
    if (!settings.enabled || !settings.agents.customerScout) return [];

    const customers = await this.dataProvider.getCustomers();
    const insights: AgentInsight[] = [];
    const now = new Date();
    const inactivityLimit = settings.thresholds.customerInactivityDays;

    for (const cust of customers) {
      // Check for high-tier customer inactivity
      if (cust.status === 'active') {
        const lastActive = cust.last_interaction_at || cust.updated_at || cust.created_at;
        if (lastActive) {
          const diffDays = Math.ceil((now.getTime() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays >= inactivityLimit) {
            insights.push({
              id: `scout-inact-${cust.id}`,
              agentName: 'CustomerScout',
              agentLabel: 'Customer 360 Scout Agent',
              actionType: 'RECOMMENDATION',
              severity: 'low',
              title: `Dormant Account Alert: ${cust.company_name}`,
              description: `No recorded operational touchpoints in ${diffDays} days for Tier-1 customer ${cust.company_name}. Proactive executive outreach recommended.`,
              entityType: 'customer',
              entityId: cust.id,
              status: 'PENDING_REVIEW',
              timestamp: new Date().toISOString(),
              metadata: {
                inactiveDays: diffDays,
                lastActivityDate: lastActive,
                accountTier: cust.tier || 'Enterprise',
              },
            });
          }
        }
      }
    }

    return insights;
  }

  /**
   * 6. Corporate & Personal Tax Agent
   * Scans individual companies for upcoming CT1 deadlines, VAT3 periods,
   * proprietary director Form 11 compliance, and preliminary tax safe harbors.
   */
  public async runTaxComplianceAgent(companyId?: string): Promise<AgentInsight[]> {
    const settings = copilotSettingsService.getSettings();
    if (!settings.enabled || !settings.agents.taxCompliance) return [];

    const customers = await this.dataProvider.getCustomers();
    const targetCustomers = companyId
      ? customers.filter((c: Customer) => (c as any).company_settings_id === companyId || c.id === companyId)
      : customers;

    const allTaxReturns: IrishTaxReturn[] =
      (await this.dataProvider.getTaxReturns?.(companyId)) ||
      mockStore.get<IrishTaxReturn>('irish_tax_returns') ||
      [];
    const allVatReturns: IrishVATReturn[] =
      (await this.dataProvider.getVatReturns?.(companyId)) ||
      mockStore.get<IrishVATReturn>('irish_vat_returns') ||
      [];
    const allDirectors: CompanyDirector[] =
      (await this.dataProvider.getDirectors?.(companyId)) ||
      mockStore.get<CompanyDirector>('company_directors') ||
      [];

    const insights: AgentInsight[] = [];
    const now = new Date();
    const warningHorizon = settings.thresholds.taxDeadlineWarningDays || 21;

    for (const cust of targetCustomers) {
      const custName = cust.company_name || 'Enterprise Client';
      const custEmail = cust.billing_email || cust.email || 'finance@client.com';

      // 1. Scan Corporation Tax (CT1) returns for this individual company
      const custTaxReturns = allTaxReturns.filter((r) => r.customerId === cust.id);

      for (const ret of custTaxReturns) {
        if (ret.returnType === 'CT1' && ret.dueDate) {
          const dueDate = new Date(ret.dueDate);
          const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          const isPending = ret.status === 'draft' || ret.status === 'ready_to_file';
          const isOverdue =
            diffDays < 0 &&
            ret.status !== 'submitted_ros' &&
            ret.status !== 'acknowledged' &&
            ret.status !== 'paid';

          if (isOverdue || (isPending && diffDays <= warningHorizon)) {
            const severity: AgentSeverity = isOverdue ? 'critical' : diffDays <= 7 ? 'high' : 'medium';
            const actionType: AgentActionType = isOverdue ? 'ALERT' : diffDays <= 7 ? 'ALERT' : 'RECOMMENDATION';
            const statusLabel = isOverdue ? `Overdue by ${Math.abs(diffDays)} Day(s)` : `Due in ${diffDays} Day(s)`;
            const liability = ret.netTaxPayable || ret.balanceDueOrRefund || 0;

            const advisorySubject = `Statutory Notice: Irish CT1 Corporation Tax Deadline (${ret.taxYear}) - ${custName}`;
            const advisoryBody = `Dear Finance Team at ${custName},

Your Irish Corporation Tax (CT1) return for Tax Year ${ret.taxYear} is ${statusLabel.toLowerCase()} (Statutory Due Date: ${ret.dueDate}).

Tax Return Computation Summary:
- Taxable Trading Profit: €${(ret.taxableProfitOrIncome || 0).toLocaleString()}
- Gross Corporation Tax (12.5%): €${(ret.grossTaxCalculated || 0).toLocaleString()}
- Preliminary Tax Prepayment Credited: €${(ret.preliminaryTaxPaid || 0).toLocaleString()}
- Net Balance Due to Revenue: €${liability.toLocaleString()}

Action Required:
Please confirm approval to transmit this return via the Revenue Online Service (ROS). To prevent late filing surcharges (TCA 1997 s1084), please authorize direct debit payment prior to the statutory deadline.

Sincerely,
RK & Associate Chartered Accountants — Corporate Tax Compliance Desk`;

            insights.push({
              id: `tax-ct1-${ret.id}`,
              agentName: 'TaxComplianceAgent',
              agentLabel: 'Corporate & Personal Tax Agent',
              actionType,
              severity,
              title: `CT1 Corporation Tax Return ${statusLabel} (${custName})`,
              description: `Tax Year ${ret.taxYear} CT1 return for ${custName} indicates net tax liability of €${liability.toLocaleString()}. Status: "${ret.status.replace(/_/g, ' ')}". Statutory filing deadline: ${ret.dueDate}.`,
              entityType: 'tax_return',
              entityId: ret.id,
              status: 'PENDING_REVIEW',
              timestamp: new Date().toISOString(),
              metadata: {
                taxReturnType: 'CT1',
                taxYear: ret.taxYear,
                dueDate: ret.dueDate,
                daysToDueDate: diffDays,
                amountPayable: liability,
                customerId: cust.id,
                customerName: custName,
                filingStatus: ret.status,
                draftRecipient: custEmail,
                draftSubject: advisorySubject,
                draftBody: advisoryBody,
              },
            });
          }
        }
      }

      // 2. Scan Preliminary Tax Safe Harbor Prepayment
      const hasPriorCT = custTaxReturns.some(
        (r) => r.returnType === 'CT1' && r.taxYear === now.getFullYear() - 1 && r.netTaxPayable > 0
      );
      const hasCurrentPrelim = custTaxReturns.some(
        (r) =>
          r.returnType === 'PRELIMINARY_TAX' &&
          r.taxYear === now.getFullYear() &&
          r.status === 'paid'
      );

      if (hasPriorCT && !hasCurrentPrelim) {
        const priorCTReturn = custTaxReturns.find(
          (r) => r.returnType === 'CT1' && r.taxYear === now.getFullYear() - 1
        );
        const safeHarborAmount = priorCTReturn ? priorCTReturn.netTaxPayable : 15000;

        const prelimSubject = `Mandatory Preliminary Tax Safe Harbor Prepayment - ${custName}`;
        const prelimBody = `Dear Directors at ${custName},

Our continuous tax monitoring indicates no preliminary corporation tax payment recorded for Tax Year ${now.getFullYear()}.

Under Irish Tax Consolidation Act 1997 Section 958, small companies must remit at least 100% of the preceding year's corporation tax liability (€${safeHarborAmount.toLocaleString()}) to qualify for safe-harbor protection and prevent statutory daily interest charges.

Recommended Action:
- Authorize preliminary tax remittance of €${safeHarborAmount.toLocaleString()} via ROS.

Sincerely,
RK & Associate Chartered Accountants — Corporate Tax Compliance Desk`;

        insights.push({
          id: `tax-prelim-${cust.id}-${now.getFullYear()}`,
          agentName: 'TaxComplianceAgent',
          agentLabel: 'Corporate & Personal Tax Agent',
          actionType: 'RECOMMENDATION',
          severity: 'high',
          title: `Preliminary Tax Safe Harbor Prepayment Required: ${custName}`,
          description: `No preliminary tax remittance recorded for ${now.getFullYear()}. Prepayment of €${safeHarborAmount.toLocaleString()} (100% prior year safe harbor) is required to avoid statutory Revenue interest surcharges.`,
          entityType: 'customer',
          entityId: cust.id,
          status: 'PENDING_REVIEW',
          timestamp: new Date().toISOString(),
          metadata: {
            taxReturnType: 'PRELIMINARY_TAX',
            taxYear: now.getFullYear(),
            amountPayable: safeHarborAmount,
            customerId: cust.id,
            customerName: custName,
            draftRecipient: custEmail,
            draftSubject: prelimSubject,
            draftBody: prelimBody,
          },
        });
      }

      // 3. Scan VAT3 & RTD Returns for this individual company
      const custVatReturns = allVatReturns.filter((v) => v.customerId === cust.id);

      for (const vat of custVatReturns) {
        if (vat.dueDate) {
          const dueDate = new Date(vat.dueDate);
          const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          const isPending = vat.status === 'draft' || vat.status === 'ready_to_file';
          const isOverdue =
            diffDays < 0 &&
            vat.status !== 'submitted_ros' &&
            vat.status !== 'acknowledged' &&
            vat.status !== 'paid';

          if (isOverdue || (isPending && diffDays <= warningHorizon)) {
            const severity: AgentSeverity = isOverdue ? 'critical' : diffDays <= 7 ? 'high' : 'medium';
            const actionType: AgentActionType = isOverdue ? 'ALERT' : diffDays <= 7 ? 'ALERT' : 'RECOMMENDATION';
            const statusLabel = isOverdue ? `Overdue by ${Math.abs(diffDays)} Day(s)` : `Due in ${diffDays} Day(s)`;
            const netPayable = vat.boxT3_NetPayable || 0;

            const vatSubject = `Irish VAT3 Filing & Payment Reminder: Period ${vat.period} - ${custName}`;
            const vatBody = `Dear Accounts Payable & Tax Team at ${custName},

Your Irish VAT3 return for Period ${vat.period} is ${statusLabel.toLowerCase()} (Statutory Due Date: ${vat.dueDate}).

VAT Return Declaration Summary:
- Box T1 (Output VAT on Sales): €${(vat.boxT1_VatOnSales || 0).toLocaleString()}
- Box T2 (Deductible VAT on Purchases): €${(vat.boxT2_VatOnPurchases || 0).toLocaleString()}
- Box T3 (Net VAT Payable to Revenue): €${netPayable.toLocaleString()}
- Box E1 (Intra-EU Supplies): €${(vat.boxE1_IntraEuSupplies || 0).toLocaleString()}

Please approve ROS upload and ensure sufficient funds are available for direct debit clearing.

Sincerely,
RK & Associate Chartered Accountants — VAT & Indirect Tax Desk`;

            insights.push({
              id: `tax-vat-${vat.id}`,
              agentName: 'TaxComplianceAgent',
              agentLabel: 'Corporate & Personal Tax Agent',
              actionType,
              severity,
              title: `VAT3 Period ${vat.period} ${statusLabel} (${custName})`,
              description: `Net VAT liability of €${netPayable.toLocaleString()} payable for ${vat.period}. Output VAT €${(vat.boxT1_VatOnSales || 0).toLocaleString()} vs deductible €${(vat.boxT2_VatOnPurchases || 0).toLocaleString()}. Status: "${vat.status.replace(/_/g, ' ')}".`,
              entityType: 'tax_return',
              entityId: vat.id,
              status: 'PENDING_REVIEW',
              timestamp: new Date().toISOString(),
              metadata: {
                taxReturnType: 'VAT3',
                period: vat.period,
                dueDate: vat.dueDate,
                daysToDueDate: diffDays,
                amountPayable: netPayable,
                customerId: cust.id,
                customerName: custName,
                filingStatus: vat.status,
                draftRecipient: custEmail,
                draftSubject: vatSubject,
                draftBody: vatBody,
              },
            });
          }
        }
      }

      // 4. Scan Company Directors for Form 11 Compliance
      const custDirectors = allDirectors.filter((d) => d.customerId === cust.id);

      for (const dir of custDirectors) {
        if (dir.directorType === 'proprietary' && dir.status === 'active') {
          const isForm11Pending =
            !dir.latestForm11Status ||
            dir.latestForm11Status === 'not_filed' ||
            dir.latestForm11Status === 'draft';

          if (isForm11Pending) {
            const taxYear = dir.latestForm11TaxYear || now.getFullYear() - 1;
            const form11Subject = `Mandatory Form 11 Personal Tax Filing - ${dir.name} (${custName})`;
            const form11Body = `Dear ${dir.name},

Under Irish Companies Act 2014 and Taxes Consolidation Act 1997, proprietary directors holding >= 15% beneficial shareholding in ${custName} are legally required to file an annual Form 11 self-assessment tax return for Tax Year ${taxYear}.

Director Status: Form 11 Self-Assessment Pending
PPSN: ${dir.ppsn || 'On File'}
Shareholding: ${dir.shareholdingPercentage}%

Please provide your emoluments and personal income deductions so we can finalize your ROS computation.

Sincerely,
RK & Associate Chartered Accountants — Personal Tax Desk`;

            insights.push({
              id: `tax-dir-form11-${dir.id}`,
              agentName: 'TaxComplianceAgent',
              agentLabel: 'Corporate & Personal Tax Agent',
              actionType: 'ALERT',
              severity: 'high',
              title: `Proprietary Director Form 11 Pending: ${dir.name} (${custName})`,
              description: `Proprietary director owning ${dir.shareholdingPercentage}% shareholding has an unfiled Form 11 obligation for Tax Year ${taxYear}. Mandatory personal tax self-assessment required under Irish Revenue regulations.`,
              entityType: 'customer',
              entityId: cust.id,
              status: 'PENDING_REVIEW',
              timestamp: new Date().toISOString(),
              metadata: {
                taxReturnType: 'FORM_11',
                directorName: dir.name,
                taxYear,
                customerId: cust.id,
                customerName: custName,
                draftRecipient: dir.email || custEmail,
                draftSubject: form11Subject,
                draftBody: form11Body,
              },
            });
          }
        }
      }
    }

    return insights;
  }

  /**
   * Run all enabled agents and aggregate real-time insights
   */
  public async runAllAgents(companyId?: string): Promise<AgentInsight[]> {
    const settings = copilotSettingsService.getSettings();
    if (!settings.enabled) {
      return [];
    }

    const [dealInsights, colInsights, compInsights, finInsights, scoutInsights, taxInsights] =
      await Promise.all([
        this.runDealHealthAgent(companyId),
        this.runCollectionsAgent(companyId),
        this.runComplianceAgent(companyId),
        this.runFinanceAuditorAgent(companyId),
        this.runCustomerScoutAgent(),
        this.runTaxComplianceAgent(companyId),
      ]);

    return [
      ...dealInsights,
      ...colInsights,
      ...compInsights,
      ...finInsights,
      ...scoutInsights,
      ...taxInsights,
    ];
  }
}

export const agentEngine = new AgentEngine();
export default agentEngine;
