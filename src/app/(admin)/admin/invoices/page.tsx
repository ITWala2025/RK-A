import Link from "next/link";
import { invoicesRepository } from "@/lib/data/invoices.repository";
import { customersRepository } from "@/lib/data/customers.repository";
import { calculateTotals } from "@/lib/vat";
import { formatCents, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";

const statusTone = {
  draft: "slate",
  sent: "blue",
  paid: "green",
  overdue: "red",
  cancelled: "slate",
} as const;

const paymentTone = { pending: "slate", partial: "yellow", paid: "green" } as const;

export default async function InvoicesPage() {
  const [invoices, customers] = await Promise.all([
    invoicesRepository.list(),
    customersRepository.list(),
  ]);
  const customerById = new Map(customers.map((c) => [c.id, c.legalEntityName]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
          <p className="mt-1 text-sm text-slate-500">Irish VAT-compliant invoicing.</p>
        </div>
        <Link
          href="/admin/invoices/new"
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          New Invoice
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Invoice #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{invoice.invoiceNumber}</td>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {customerById.get(invoice.customerId) ?? "Unknown"}
                </td>
                <td className="px-4 py-3 text-slate-600">{formatDate(invoice.dueDate)}</td>
                <td className="px-4 py-3 text-slate-600">
                  {formatCents(calculateTotals(invoice.lineItems).totalCents)}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone[invoice.status]}>{invoice.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={paymentTone[invoice.paymentStatus]}>{invoice.paymentStatus}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/invoices/${invoice.id}`} className="text-emerald-700 hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  No invoices yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
