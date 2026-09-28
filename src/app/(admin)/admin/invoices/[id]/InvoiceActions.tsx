"use client";

import { useState, useTransition } from "react";
import { updateInvoiceStatus, recordInvoicePayment } from "../actions";
import type { InvoiceStatus } from "@/lib/domain/types";

export function InvoiceActions({
  invoiceId,
  status,
  outstandingCents,
}: {
  invoiceId: string;
  status: InvoiceStatus;
  outstandingCents: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [amount, setAmount] = useState((outstandingCents / 100).toFixed(2));
  const [reference, setReference] = useState("");

  function updateStatus(next: InvoiceStatus) {
    startTransition(() => updateInvoiceStatus(invoiceId, next));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {status === "draft" && (
          <button
            disabled={isPending}
            onClick={() => updateStatus("sent")}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            Send Invoice
          </button>
        )}
        {status !== "cancelled" && status !== "paid" && (
          <button
            disabled={isPending}
            onClick={() => updateStatus("cancelled")}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
          >
            Cancel Invoice
          </button>
        )}
      </div>

      {outstandingCents > 0 && status !== "cancelled" && (
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-sm font-medium text-slate-700">Record a payment</p>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500">Amount (€)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 w-32 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500">Reference</label>
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. bank ref"
                className="mt-1 w-40 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
              />
            </div>
            <button
              disabled={isPending}
              onClick={() =>
                startTransition(() =>
                  recordInvoicePayment(
                    invoiceId,
                    Math.round(Number(amount) * 100),
                    "bank_transfer",
                    reference || "N/A"
                  )
                )
              }
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
            >
              Record Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
