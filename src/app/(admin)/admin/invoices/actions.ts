"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { invoicesRepository } from "@/lib/data/invoices.repository";
import type { InvoiceStatus, LineItem } from "@/lib/domain/types";

export async function createInvoice(input: {
  customerId: string;
  lineItems: LineItem[];
  dueDate: string;
}) {
  const invoice = await invoicesRepository.create(input);
  revalidatePath("/admin/invoices");
  redirect(`/admin/invoices/${invoice.id}`);
}

export async function updateInvoiceStatus(invoiceId: string, status: InvoiceStatus) {
  await invoicesRepository.updateStatus(invoiceId, status);
  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${invoiceId}`);
}

export async function recordInvoicePayment(
  invoiceId: string,
  amountCents: number,
  method: "card" | "bank_transfer" | "sepa",
  reference: string
) {
  await invoicesRepository.recordPayment(invoiceId, { amountCents, method, reference });
  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${invoiceId}`);
}
