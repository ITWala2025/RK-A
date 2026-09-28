"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { quotesRepository } from "@/lib/data/quotes.repository";
import { invoicesRepository } from "@/lib/data/invoices.repository";
import type { LineItem, QuoteStatus } from "@/lib/domain/types";

export async function createQuote(input: {
  customerId: string;
  lineItems: LineItem[];
  validUntil: string;
}) {
  const quote = await quotesRepository.create(input);
  revalidatePath("/admin/quotes");
  redirect(`/admin/quotes/${quote.id}`);
}

export async function updateQuoteStatus(quoteId: string, status: QuoteStatus) {
  await quotesRepository.updateStatus(quoteId, status);
  revalidatePath("/admin/quotes");
  revalidatePath(`/admin/quotes/${quoteId}`);
}

// PRD US-C1: one-click "Convert to Invoice", preserving quote_reference traceability.
export async function convertQuoteToInvoice(quoteId: string) {
  const quote = await quotesRepository.getById(quoteId);
  if (!quote) throw new Error("Quote not found");

  const invoice = await invoicesRepository.create({
    customerId: quote.customerId,
    quoteReference: quote.quoteNumber,
    lineItems: quote.lineItems,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });
  await quotesRepository.markConverted(quoteId, invoice.id);

  revalidatePath("/admin/quotes");
  revalidatePath("/admin/invoices");
  redirect(`/admin/invoices/${invoice.id}`);
}
