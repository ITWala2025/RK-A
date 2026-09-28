"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useClientSession } from "@/lib/auth/session";
import { invoicesRepository } from "@/lib/data/invoices.repository";
import type { Invoice } from "@/lib/domain/types";
import { calculateTotals } from "@/lib/vat";
import { formatCents, formatDate } from "@/lib/format";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function PortalInvoicesPage() {
  const { customerId } = useClientSession();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    if (!customerId) return;
    invoicesRepository.list().then((all) => setInvoices(all.filter((i) => i.customerId === customerId)));
  }, [customerId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
        <p className="mt-1 text-sm text-slate-500">View, download, and pay your invoices.</p>
      </div>

      <Card>
        <CardBody>
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="text-left text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="py-2">Invoice #</th>
                <th className="py-2">Due Date</th>
                <th className="py-2">Total</th>
                <th className="py-2">Status</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="py-2 font-mono text-xs text-slate-500">{invoice.invoiceNumber}</td>
                  <td className="py-2 text-slate-600">{formatDate(invoice.dueDate)}</td>
                  <td className="py-2 text-slate-600">
                    {formatCents(calculateTotals(invoice.lineItems).totalCents)}
                  </td>
                  <td className="py-2">
                    <Badge tone={invoice.paymentStatus === "paid" ? "green" : "yellow"}>
                      {invoice.paymentStatus}
                    </Badge>
                  </td>
                  <td className="py-2 text-right">
                    <Link href={`/portal/invoices/${invoice.id}`} className="text-emerald-700 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No invoices yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
