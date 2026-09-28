import { notFound } from "next/navigation";
import Link from "next/link";
import { quotesRepository } from "@/lib/data/quotes.repository";
import { customersRepository } from "@/lib/data/customers.repository";
import { calculateTotals, lineTotalCents, lineVatCents, vatRateLabel, REVERSE_CHARGE_NOTE } from "@/lib/vat";
import { formatCents, formatDate } from "@/lib/format";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { QuoteActions } from "./QuoteActions";

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quote = await quotesRepository.getById(id);
  if (!quote) notFound();
  const customer = await customersRepository.getById(quote.customerId);
  const totals = calculateTotals(quote.lineItems);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{quote.quoteNumber}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {customer?.legalEntityName ?? "Unknown customer"} &middot; Valid until{" "}
            {formatDate(quote.validUntil)}
          </p>
        </div>
        <Badge tone="blue">{quote.status}</Badge>
      </div>

      <Card>
        <CardBody>
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
              {quote.lineItems.map((item, idx) => (
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
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <QuoteActions quoteId={quote.id} status={quote.status} />
          {quote.convertedInvoiceId && (
            <p className="mt-3 text-sm text-slate-500">
              Converted to{" "}
              <Link href={`/admin/invoices/${quote.convertedInvoiceId}`} className="text-emerald-700 hover:underline">
                Invoice
              </Link>
              .
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
