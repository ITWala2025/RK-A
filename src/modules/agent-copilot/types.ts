/**
 * Autonomous CRM Agents & Copilot Module
 * Type Definitions
 */

export type AgentType =
  | 'DealHealthAgent'
  | 'CollectionsAgent'
  | 'ComplianceAgent'
  | 'FinanceAuditor'
  | 'CustomerScout'
  | 'TaxComplianceAgent';

export type AgentActionType =
  | 'RECOMMENDATION'
  | 'ALERT'
  | 'AUTO_ACTION'
  | 'DRAFT_CREATED';

export type AgentSeverity = 'low' | 'medium' | 'high' | 'critical';

export type AgentEntityType = 'quote' | 'invoice' | 'contract' | 'expense' | 'customer' | 'tax_return';

export type AgentInsightStatus = 'PENDING_REVIEW' | 'APPROVED' | 'DISMISSED' | 'APPLIED';

export interface AgentActionPayload {
  // Collections email draft payload
  draftSubject?: string;
  draftRecipient?: string;
  draftBody?: string;
  daysOverdue?: number;
  balanceDue?: number;
  bankingCoordinates?: {
    bankName?: string;
    accountNumber?: string;
    iban?: string;
    swiftBic?: string;
    ifscCode?: string;
  };

  // Deal health quote discount payload
  originalDiscountPercent?: number;
  suggestedDiscountPercent?: number;
  discountAmount?: number;
  subtotal?: number;
  quoteTotal?: number;
  daysToExpiry?: number;

  // Contract renewal payload
  renewalQuoteTitle?: string;
  contractValue?: number;
  expiryDate?: string;
  suggestedTermMonths?: number;

  // Finance anomaly payload
  duplicateExpenseIds?: string[];
  matchedVendor?: string;
  matchedAmount?: number;
  matchedDate?: string;

  // Customer scout payload
  inactiveDays?: number;
  lastActivityDate?: string;
  accountTier?: string;

  // Tax compliance payload
  taxReturnType?: 'CT1' | 'VAT3' | 'RTD' | 'FORM_11' | 'PRELIMINARY_TAX';
  taxYear?: number;
  period?: string;
  dueDate?: string;
  daysToDueDate?: number;
  amountPayable?: number;
  directorName?: string;
  customerName?: string;
  customerId?: string;
  filingStatus?: string;

  // Generic custom data
  [key: string]: any;
}

export interface AgentInsight {
  id: string;
  agentName: AgentType;
  agentLabel: string;
  actionType: AgentActionType;
  severity: AgentSeverity;
  title: string;
  description: string;
  entityType: AgentEntityType;
  entityId: string;
  metadata?: AgentActionPayload;
  status: AgentInsightStatus;
  timestamp: string;
}

export interface AgentAuditRecord {
  id: string;
  agentName: AgentType;
  actionType: AgentActionType;
  entityType: AgentEntityType;
  entityId: string;
  payload: Record<string, any>;
  status: AgentInsightStatus;
  timestamp: string;
  actorName?: string;
  resolutionNotes?: string;
}

export interface AgentModuleSettings {
  /**
   * Master license / entitlement toggle for this client.
   * If false, the Autonomous Agents Copilot is disabled and hidden for this client.
   */
  enabled: boolean;
  planTier: 'standard' | 'professional' | 'enterprise';
  clientName?: string;
  agents: {
    dealHealth: boolean;
    collections: boolean;
    compliance: boolean;
    financeAuditor: boolean;
    customerScout: boolean;
    taxCompliance: boolean;
  };
  thresholds: {
    quoteExpiryWarningDays: number;
    quoteDiscountWarningPercent: number;
    invoiceOverdueGraceDays: number;
    contractRenewalWarningDays: number;
    largeExpenseThreshold: number;
    customerInactivityDays: number;
    taxDeadlineWarningDays: number;
  };
  autoPilot: {
    enabled: boolean;
    requireApprovalForReminders: boolean;
    requireApprovalForQuotes: boolean;
    requireApprovalForExpenseFlags: boolean;
  };
  notifications: {
    showDashboardBadge: boolean;
    toastAlertsOnCritical: boolean;
  };
}

export interface AgentDiagnosticsStats {
  totalScanned: number;
  activeAnomalies: number;
  pendingReview: number;
  appliedCount: number;
  dismissedCount: number;
  lastRunTimestamp: string | null;
  agentStats: Record<
    AgentType,
    {
      activeCount: number;
      lastRun: string;
      status: 'active' | 'idle' | 'disabled';
    }
  >;
}

export interface AgentCopilotCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToEntity?: (entityType: string, entityId: string) => void;
  companyId?: string;
  /**
   * Optional custom class for standalone embedding
   */
  className?: string;
}

/**
 * Data provider interface allowing the Agent Copilot module
 * to be exported and wired to any backend, mock store, or database.
 */
export interface AgentDataProvider {
  getQuotes(companyId?: string): Promise<any[]>;
  getInvoices(companyId?: string): Promise<any[]>;
  getContracts(companyId?: string): Promise<any[]>;
  getExpenses(companyId?: string): Promise<any[]>;
  getCustomers(companyId?: string): Promise<any[]>;
  getCompanySettings(companyId?: string): Promise<any>;
  getTaxReturns?(companyId?: string): Promise<any[]>;
  getVatReturns?(companyId?: string): Promise<any[]>;
  getDirectors?(companyId?: string): Promise<any[]>;
  updateQuote?(quoteId: string, updates: any): Promise<any>;
  createQuote?(quoteData: any): Promise<any>;
  updateExpense?(expenseId: string, updates: any): Promise<any>;
  addTimelineEvent?(event: any): Promise<void> | void;
}

