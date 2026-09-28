// Shared enums/types used across CRM, Commercial Ops, and Client Portal domains.

export type EntityType =
  | "ltd"
  | "dac"
  | "sole_trader"
  | "partnership"
  | "llp"
  | "individual";

export type RiskRating = "low" | "medium" | "high";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal_sent"
  | "won"
  | "lost";

export type LeadSource = "organic" | "referral" | "paid" | "direct";

export type VatRate = 23 | 13.5 | 9 | 0 | "exempt" | "reverse_charge";

export type QuoteStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "rejected"
  | "expired"
  | "converted";

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export type PaymentStatus = "pending" | "partial" | "paid";

export type DocumentCategory =
  | "bank_statements"
  | "payroll"
  | "vat_returns"
  | "annual_accounts"
  | "tax_returns"
  | "company_secretarial"
  | "correspondence";

export type DocumentScanStatus = "pending_scan" | "clean" | "quarantined";

export type ComplianceObligationType = "VAT3" | "CT1" | "Form11" | "B1" | "RBO";

export type ComplianceStatus =
  | "upcoming"
  | "due_soon"
  | "overdue"
  | "filed"
  | "at_risk_missing_document";

export interface Lead {
  id: string;
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  serviceInterest: string[];
  message?: string;
  source: LeadSource;
  utmCampaign?: string;
  consentMarketing: boolean;
  status: LeadStatus;
  assignedOwnerId: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  customerId: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface Customer {
  id: string;
  clientCode: string;
  legalEntityName: string;
  tradingName?: string;
  entityType: EntityType;
  croNumber?: string;
  taxRefNumber?: string;
  vatNumber?: string;
  employerPayeNumber?: string;
  rboStatus?: "not_required" | "pending" | "filed";
  relationshipManagerId: string;
  riskRating: RiskRating;
  status: "active" | "dormant" | "ceased";
  createdAt: string;
}

export interface LineItem {
  description: string;
  quantity: number;
  unitPriceCents: number;
  vatRate: VatRate;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customerId: string;
  leadId?: string;
  lineItems: LineItem[];
  status: QuoteStatus;
  validUntil: string;
  createdAt: string;
  convertedInvoiceId?: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  date: string;
  amountCents: number;
  method: "card" | "bank_transfer" | "sepa";
  reference: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  quoteReference?: string;
  lineItems: LineItem[];
  status: InvoiceStatus;
  paymentStatus: PaymentStatus;
  issueDate: string;
  dueDate: string;
  currency: "EUR";
  createdAt: string;
  payments: Payment[];
}

export interface DocumentItem {
  id: string;
  customerId: string;
  fileName: string;
  category: DocumentCategory;
  taxYear: string;
  uploadedAt: string;
  status: DocumentScanStatus;
  retentionExpiresAt: string;
}

export interface ComplianceItem {
  id: string;
  customerId: string;
  obligationType: ComplianceObligationType;
  dueDate: string;
  status: ComplianceStatus;
}

export type StaffRole =
  | "partner_admin"
  | "manager"
  | "accountant"
  | "payroll_officer"
  | "company_secretarial_officer"
  | "service_desk_agent";

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
}
