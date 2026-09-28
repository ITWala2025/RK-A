"use client";

import { useTransition } from "react";
import { updateQuoteStatus, convertQuoteToInvoice } from "../actions";
import type { QuoteStatus } from "@/lib/domain/types";

export function QuoteActions({ quoteId, status }: { quoteId: string; status: QuoteStatus }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-3">
      {status === "draft" && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => updateQuoteStatus(quoteId, "sent"))}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
        >
          Send Quote
        </button>
      )}
      {status === "sent" && (
        <>
          <button
            disabled={isPending}
            onClick={() => startTransition(() => updateQuoteStatus(quoteId, "accepted"))}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            Simulate Client Acceptance
          </button>
          <button
            disabled={isPending}
            onClick={() => startTransition(() => updateQuoteStatus(quoteId, "rejected"))}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
          >
            Mark Rejected
          </button>
        </>
      )}
      {status === "accepted" && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => convertQuoteToInvoice(quoteId))}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
        >
          Convert to Invoice
        </button>
      )}
      {status === "converted" && (
        <p className="text-sm text-slate-500">This quote has been converted to an invoice.</p>
      )}
    </div>
  );
}
