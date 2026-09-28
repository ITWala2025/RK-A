"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { leadsRepository } from "@/lib/data/leads.repository";
import { quotesRepository } from "@/lib/data/quotes.repository";
import type { LeadStatus } from "@/lib/domain/types";

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  await leadsRepository.updateStatus(leadId, status);
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
}

// PRD US-A2: convert a qualified lead into a Draft quote pre-populated for the lead.
export async function createQuoteFromLead(leadId: string, customerId: string) {
  const quote = await quotesRepository.create({
    customerId,
    leadId,
    lineItems: [],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });
  revalidatePath("/admin/quotes");
  redirect(`/admin/quotes/${quote.id}`);
}
