import type { Invoice, InvoiceStatus, LineItem } from "../domain/types";
import { invoices as seedInvoices } from "../domain/seed";

export interface NewInvoiceInput {
  customerId: string;
  quoteReference?: string;
  lineItems: LineItem[];
  dueDate: string;
}

export interface InvoicesRepository {
  list(): Promise<Invoice[]>;
  getById(id: string): Promise<Invoice | null>;
  create(input: NewInvoiceInput): Promise<Invoice>;
  updateStatus(id: string, status: InvoiceStatus): Promise<Invoice>;
  recordPayment(
    id: string,
    payment: { amountCents: number; method: Invoice["payments"][number]["method"]; reference: string }
  ): Promise<Invoice>;
}

function createInMemoryInvoicesRepository(initial: Invoice[]): InvoicesRepository {
  const store = [...initial];
  let sequence = store.length;

  return {
    async list() {
      return [...store].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    async getById(id) {
      return store.find((i) => i.id === id) ?? null;
    },
    async create(input) {
      sequence += 1;
      const now = new Date().toISOString();
      const invoice: Invoice = {
        id: `inv-${sequence}`,
        // Sequential, non-reusable, financial-year-aware numbering (Revenue requirement).
        invoiceNumber: `INV-2026-${String(sequence).padStart(6, "0")}`,
        customerId: input.customerId,
        quoteReference: input.quoteReference,
        lineItems: input.lineItems,
        status: "draft",
        paymentStatus: "pending",
        issueDate: now,
        dueDate: input.dueDate,
        currency: "EUR",
        createdAt: now,
        payments: [],
      };
      store.push(invoice);
      return invoice;
    },
    async updateStatus(id, status) {
      const invoice = store.find((i) => i.id === id);
      if (!invoice) throw new Error(`Invoice ${id} not found`);
      invoice.status = status;
      return invoice;
    },
    async recordPayment(id, payment) {
      const invoice = store.find((i) => i.id === id);
      if (!invoice) throw new Error(`Invoice ${id} not found`);
      invoice.payments.push({
        id: `pay-${invoice.payments.length + 1}-${invoice.id}`,
        invoiceId: id,
        date: new Date().toISOString(),
        ...payment,
      });
      const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amountCents, 0);
      const totalDue = invoice.lineItems.reduce(
        (sum, item) => sum + item.quantity * item.unitPriceCents,
        0
      );
      invoice.paymentStatus = totalPaid >= totalDue ? "paid" : totalPaid > 0 ? "partial" : "pending";
      if (invoice.paymentStatus === "paid") invoice.status = "paid";
      return invoice;
    },
  };
}

export const invoicesRepository: InvoicesRepository =
  createInMemoryInvoicesRepository(seedInvoices);
