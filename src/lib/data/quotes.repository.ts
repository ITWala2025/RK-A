import type { LineItem, Quote, QuoteStatus } from "../domain/types";
import { quotes as seedQuotes } from "../domain/seed";

export interface NewQuoteInput {
  customerId: string;
  leadId?: string;
  lineItems: LineItem[];
  validUntil: string;
}

export interface QuotesRepository {
  list(): Promise<Quote[]>;
  getById(id: string): Promise<Quote | null>;
  create(input: NewQuoteInput): Promise<Quote>;
  updateStatus(id: string, status: QuoteStatus): Promise<Quote>;
  markConverted(id: string, invoiceId: string): Promise<Quote>;
}

function createInMemoryQuotesRepository(initial: Quote[]): QuotesRepository {
  const store = [...initial];
  let sequence = store.length;

  return {
    async list() {
      return [...store].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    async getById(id) {
      return store.find((q) => q.id === id) ?? null;
    },
    async create(input) {
      sequence += 1;
      const quote: Quote = {
        id: `quote-${sequence}`,
        // Non-reusable, sequential numbering per PRD invoicing/quoting rules.
        quoteNumber: `QTE-2026-${String(sequence).padStart(4, "0")}`,
        customerId: input.customerId,
        leadId: input.leadId,
        lineItems: input.lineItems,
        status: "draft",
        validUntil: input.validUntil,
        createdAt: new Date().toISOString(),
      };
      store.push(quote);
      return quote;
    },
    async updateStatus(id, status) {
      const quote = store.find((q) => q.id === id);
      if (!quote) throw new Error(`Quote ${id} not found`);
      quote.status = status;
      return quote;
    },
    async markConverted(id, invoiceId) {
      const quote = store.find((q) => q.id === id);
      if (!quote) throw new Error(`Quote ${id} not found`);
      quote.status = "converted";
      quote.convertedInvoiceId = invoiceId;
      return quote;
    },
  };
}

export const quotesRepository: QuotesRepository = createInMemoryQuotesRepository(seedQuotes);
