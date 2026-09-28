import type {
  Customer,
  DocumentItem,
  Invoice,
  Lead,
  Quote,
  StaffMember,
  ComplianceItem,
} from "./types";

export const staff: StaffMember[] = [
  { id: "staff-1", name: "Aoife Ryan", role: "partner_admin" },
  { id: "staff-2", name: "Cian Murphy", role: "manager" },
  { id: "staff-3", name: "Niamh O'Connor", role: "accountant" },
  { id: "staff-4", name: "Declan Walsh", role: "payroll_officer" },
  { id: "staff-5", name: "Sinead Kelly", role: "company_secretarial_officer" },
  { id: "staff-6", name: "Rory Byrne", role: "service_desk_agent" },
];

export const customers: Customer[] = [
  {
    id: "cust-1",
    clientCode: "RKA-2026-0001",
    legalEntityName: "Emerald Coastal Foods Ltd",
    tradingName: "Emerald Coastal Foods",
    entityType: "ltd",
    croNumber: "654321",
    taxRefNumber: "9876543A",
    vatNumber: "IE9876543A",
    employerPayeNumber: "9876543A",
    rboStatus: "filed",
    relationshipManagerId: "staff-2",
    riskRating: "low",
    status: "active",
    createdAt: "2024-03-12T09:00:00.000Z",
  },
  {
    id: "cust-2",
    clientCode: "RKA-2026-0002",
    legalEntityName: "Fionnuala Byrne",
    entityType: "individual",
    taxRefNumber: "1122334B",
    relationshipManagerId: "staff-3",
    riskRating: "low",
    status: "active",
    createdAt: "2025-01-20T09:00:00.000Z",
  },
  {
    id: "cust-3",
    clientCode: "RKA-2026-0003",
    legalEntityName: "Liffey Digital Solutions DAC",
    tradingName: "Liffey Digital",
    entityType: "dac",
    croNumber: "512345",
    taxRefNumber: "5566778C",
    vatNumber: "IE5566778C",
    employerPayeNumber: "5566778C",
    rboStatus: "pending",
    relationshipManagerId: "staff-2",
    riskRating: "medium",
    status: "active",
    createdAt: "2025-06-02T09:00:00.000Z",
  },
];

export const leads: Lead[] = [
  {
    id: "lead-1",
    name: "Padraig Nolan",
    companyName: "Nolan Joinery Ltd",
    email: "padraig@nolanjoinery.ie",
    phone: "+353 87 123 4567",
    serviceInterest: ["VAT Compliance", "Payroll"],
    message: "Need help getting VAT registered and payroll running for 4 staff.",
    source: "organic",
    consentMarketing: true,
    status: "new",
    assignedOwnerId: "staff-2",
    createdAt: "2026-09-20T10:15:00.000Z",
  },
  {
    id: "lead-2",
    name: "Grainne Fitzgerald",
    companyName: "Fitzgerald Consulting",
    email: "grainne@fitzgeraldconsulting.ie",
    phone: "+353 86 555 2211",
    serviceInterest: ["Taxation", "Advisory"],
    source: "referral",
    consentMarketing: true,
    status: "qualified",
    assignedOwnerId: "staff-3",
    createdAt: "2026-09-15T14:30:00.000Z",
  },
];

export const quotes: Quote[] = [
  {
    id: "quote-1",
    quoteNumber: "QTE-2026-0001",
    customerId: "cust-3",
    lineItems: [
      {
        description: "Monthly bookkeeping retainer",
        quantity: 12,
        unitPriceCents: 25000,
        vatRate: 23,
      },
      {
        description: "Annual accounts preparation & iXBRL tagging",
        quantity: 1,
        unitPriceCents: 90000,
        vatRate: 23,
      },
    ],
    status: "sent",
    validUntil: "2026-10-28T00:00:00.000Z",
    createdAt: "2026-09-10T09:00:00.000Z",
  },
];

export const invoices: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2026-000001",
    customerId: "cust-1",
    lineItems: [
      {
        description: "Bi-monthly VAT return filing",
        quantity: 1,
        unitPriceCents: 15000,
        vatRate: 23,
      },
    ],
    status: "sent",
    paymentStatus: "pending",
    issueDate: "2026-09-01T00:00:00.000Z",
    dueDate: "2026-09-30T00:00:00.000Z",
    currency: "EUR",
    createdAt: "2026-09-01T00:00:00.000Z",
    payments: [],
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2026-000002",
    customerId: "cust-3",
    lineItems: [
      {
        description: "Advisory services — intra-EU digital consulting",
        quantity: 1,
        unitPriceCents: 200000,
        vatRate: "reverse_charge",
      },
    ],
    status: "paid",
    paymentStatus: "paid",
    issueDate: "2026-08-05T00:00:00.000Z",
    dueDate: "2026-09-04T00:00:00.000Z",
    currency: "EUR",
    createdAt: "2026-08-05T00:00:00.000Z",
    payments: [
      {
        id: "pay-1",
        invoiceId: "inv-2",
        date: "2026-08-20T00:00:00.000Z",
        amountCents: 200000,
        method: "bank_transfer",
        reference: "LIFFEY-INV2",
      },
    ],
  },
];

export const documents: DocumentItem[] = [
  {
    id: "doc-1",
    customerId: "cust-1",
    fileName: "bank-statement-aug-2026.pdf",
    category: "bank_statements",
    taxYear: "2026",
    uploadedAt: "2026-09-05T11:00:00.000Z",
    status: "clean",
    retentionExpiresAt: "2032-09-05T11:00:00.000Z",
  },
  {
    id: "doc-2",
    customerId: "cust-1",
    fileName: "payroll-timesheets-sept-2026.xlsx",
    category: "payroll",
    taxYear: "2026",
    uploadedAt: "2026-09-22T09:30:00.000Z",
    status: "clean",
    retentionExpiresAt: "2032-09-22T09:30:00.000Z",
  },
];

export const complianceItems: ComplianceItem[] = [
  {
    id: "comp-1",
    customerId: "cust-1",
    obligationType: "VAT3",
    dueDate: "2026-10-19T00:00:00.000Z",
    status: "due_soon",
  },
  {
    id: "comp-2",
    customerId: "cust-1",
    obligationType: "B1",
    dueDate: "2026-11-30T00:00:00.000Z",
    status: "upcoming",
  },
  {
    id: "comp-3",
    customerId: "cust-3",
    obligationType: "CT1",
    dueDate: "2026-09-23T00:00:00.000Z",
    status: "overdue",
  },
  {
    id: "comp-4",
    customerId: "cust-2",
    obligationType: "Form11",
    dueDate: "2026-10-31T00:00:00.000Z",
    status: "at_risk_missing_document",
  },
];
