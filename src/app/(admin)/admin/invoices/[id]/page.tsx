import { notFound } from "next/navigation";
import { invoicesRepository } from "@/lib/data/invoices.repository";
import { customersRepository } from "@/lib/data/customers.repository";
import { calculateTotals, lineTotalCents, lineVatCents, vatRateLabel, REVERSE_CHARGE_NOTE } from "@/lib/vat";
import { formatCents, formatDate } from "@/lib/format";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { InvoiceActions } from "./InvoiceActions";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await invoicesRepository.getById(id);
  if (!invoice) notFound();
  const customer = await customersRepository.getById(invoice.customerId);
  const totals = calculateTotals(invoice.lineItems);
  const paidCents = invoice.payments.reduce((sum, p) => sum + p.amountCents, 0);
  const outstandingCents = totals.totalCents - paidCents;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{invoice.invoiceNumber}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {customer?.legalEntityName ?? "Unknown customer"} &middot; Due {formatDate(invoice.dueDate)}
            {invoice.quoteReference && <> &middot; from {invoice.quoteReference}</>}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge tone="blue">{invoice.status}</Badge>
          <Badge tone={invoice.paymentStatus === "paid" ? "green" : "yellow"}>
            {invoice.paymentStatus}
          </Badge>
        </div>
      </div>

      <Card>
        <CardBody>
          {customer?.vatNumber && (
            <p className="mb-4 text-xs text-slate-500">
              Firm VAT: IE1234567T &middot; Client VAT: {customer.vatNumber}
            </p>
          )}
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="text-left text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="py-2">Description</th>
                <th className="py-2">Qty</th>
                <th className="py-2">Unit Price</th>
                <th className="py-2">VAT</th>
                <th className="py-2">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.lineItems.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2 text-slate-800">{item.description}</td>
                  <td className="py-2 text-slate-600">{item.quantity}</td>
                  <td className="py-2 text-slate-600">{formatCents(item.unitPriceCents)}</td>
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
              <div className="flex justify-between">
                <span className="text-slate-500">Net</span>
                <span>{formatCents(totals.netCents)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">VAT</span>
                <span>{formatCents(totals.vatCents)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1 font-semibold">
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
        </CardBody>
      </Card>

      {invoice.payments.length > 0 && (
        <Card>
          <CardBody>
            <h2 className="font-semibold text-slate-900">Payment History</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {invoice.payments.map((p) => (
                <li key={p.id} className="flex justify-between">
                  <span className="text-slate-600">
                    {formatDate(p.date)} &middot; {p.method} &middot; {p.reference}
                  </span>
                  <span className="font-medium text-slate-800">{formatCents(p.amountCents)}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody>
          <InvoiceActions invoiceId={invoice.id} status={invoice.status} outstandingCents={outstandingCents} />
        </CardBody>
      </Card>
    </div>
  );
}
