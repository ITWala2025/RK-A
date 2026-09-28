"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { invoicesRepository } from "@/lib/data/invoices.repository";
import type { Invoice } from "@/lib/domain/types";
import { calculateTotals, lineTotalCents, lineVatCents, vatRateLabel, REVERSE_CHARGE_NOTE } from "@/lib/vat";
import { formatCents, formatDate } from "@/lib/format";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function PortalInvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [paying, setPaying] = useState(false);

  async function refresh() {
    const found = await invoicesRepository.getById(params.id);
    setInvoice(found);
  }

  useEffect(() => {
    let cancelled = false;
    invoicesRepository.getById(params.id).then((found) => {
      if (!cancelled) setInvoice(found);
    });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (!invoice) {
    return <p className="text-sm text-slate-400">Loading…</p>;
  }

  const totals = calculateTotals(invoice.lineItems);
  const paidCents = invoice.payments.reduce((sum, p) => sum + p.amountCents, 0);
  const outstandingCents = totals.totalCents - paidCents;

  async function handlePayNow() {
    setPaying(true);
    // Simulates the payment-gateway webhook confirmation described in PRD US-C2.
    await invoicesRepository.recordPayment(invoice!.id, {
      amountCents: outstandingCents,
      method: "card",
      reference: `CARD-${Date.now()}`,
    });
    await refresh();
    setPaying(false);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{invoice.invoiceNumber}</h1>
          <p className="mt-1 text-sm text-slate-500">Due {formatDate(invoice.dueDate)}</p>
        </div>
        <Badge tone={invoice.paymentStatus === "paid" ? "green" : "yellow"}>{invoice.paymentStatus}</Badge>
      </div>

      <Card>
        <CardBody>
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="text-left text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="py-2">Description</th>
                <th className="py-2">Qty</th>
                <th className="py-2">VAT</th>
                <th className="py-2">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.lineItems.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2 text-slate-800">{item.description}</td>
                  <td className="py-2 text-slate-600">{item.quantity}</td>
                  <td className="py-2 text-slate-600">
                    {vatRateLabel(item.vatRate)} ({formatCents(lineVatCents(item))})
                  </td>
                  <td className="py-2 font-medium text-slate-800">{formatCents(lineTotalCents(item))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {totals.hasReverseCharge && (
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              {REVERSE_CHARGE_NOTE}
            </p>
          )}

          <div className="mt-4 flex justify-end">
            <div className="w-64 space-y-1 text-sm">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCents(totals.totalCents)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Paid</span>
                <span>{formatCents(paidCents)}</span>
              </div>
              <div className="flex justify-between font-semibold text-emerald-700">
                <span>Outstanding</span>
                <span>{formatCents(outstandingCents)}</span>
              </div>
            </div>
          </div>

          {outstandingCents > 0 && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handlePayNow}
                disabled={paying}
                className="rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
              >
                {paying ? "Processing…" : "Pay Now"}
              </button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
