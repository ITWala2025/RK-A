import Link from "next/link";
import { quotesRepository } from "@/lib/data/quotes.repository";
import { customersRepository } from "@/lib/data/customers.repository";
import { calculateTotals } from "@/lib/vat";
import { formatCents, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";

const statusTone = {
  draft: "slate",
  sent: "blue",
  accepted: "green",
  rejected: "red",
  expired: "slate",
  converted: "green",
} as const;

export default async function QuotesPage() {
  const [quotes, customers] = await Promise.all([quotesRepository.list(), customersRepository.list()]);
  const customerById = new Map(customers.map((c) => [c.id, c.legalEntityName]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quotes</h1>
          <p className="mt-1 text-sm text-slate-500">Draft → Sent → Accepted/Rejected → Converted.</p>
        </div>
        <Link
          href="/admin/quotes/new"
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          New Quote
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Quote #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Valid Until</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {quotes.map((quote) => (
              <tr key={quote.id}>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{quote.quoteNumber}</td>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {customerById.get(quote.customerId) ?? "Unknown"}
                </td>
                <td className="px-4 py-3 text-slate-600">{formatDate(quote.validUntil)}</td>
                <td className="px-4 py-3 text-slate-600">
                  {formatCents(calculateTotals(quote.lineItems).totalCents)}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone[quote.status]}>{quote.status}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/quotes/${quote.id}`} className="text-emerald-700 hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {quotes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  No quotes yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
