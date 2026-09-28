"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useClientSession } from "@/lib/auth/session";
import { customersRepository } from "@/lib/data/customers.repository";
import { complianceRepository } from "@/lib/data/compliance.repository";
import { invoicesRepository } from "@/lib/data/invoices.repository";
import { documentsRepository } from "@/lib/data/documents.repository";
import type { ComplianceItem, Customer, DocumentItem, Invoice } from "@/lib/domain/types";
import { calculateTotals } from "@/lib/vat";
import { formatCents, formatDate, daysUntil } from "@/lib/format";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const complianceTone = {
  upcoming: "slate",
  due_soon: "yellow",
  overdue: "red",
  filed: "green",
  at_risk_missing_document: "red",
} as const;

export default function PortalDashboardPage() {
  const { customerId } = useClientSession();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [compliance, setCompliance] = useState<ComplianceItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  useEffect(() => {
    if (!customerId) return;
    let cancelled = false;
    Promise.all([
      customersRepository.getById(customerId),
      complianceRepository.listByCustomer(customerId),
      invoicesRepository.list(),
      documentsRepository.listByCustomer(customerId),
    ]).then(([customerResult, complianceResult, invoicesResult, documentsResult]) => {
      if (cancelled) return;
      setCustomer(customerResult);
      setCompliance(complianceResult);
      setInvoices(invoicesResult.filter((i) => i.customerId === customerId));
      setDocuments(documentsResult);
    });
    return () => {
      cancelled = true;
    };
  }, [customerId]);

  const outstandingInvoices = invoices.filter((i) => i.paymentStatus !== "paid");
  const outstandingCents = outstandingInvoices.reduce(
    (sum, i) => sum + calculateTotals(i.lineItems).totalCents,
    0
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome{customer ? `, ${customer.legalEntityName}` : ""}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Your deadlines, documents, invoices, and support at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Upcoming Deadlines"
          value={compliance.filter((c) => c.status !== "filed").length}
          hint={compliance.some((c) => c.status === "overdue") ? "Includes overdue items" : undefined}
        />
        <StatCard label="Outstanding Invoices" value={formatCents(outstandingCents)} hint={`${outstandingInvoices.length} unpaid`} />
        <StatCard label="Documents on File" value={documents.length} />
      </div>

      <Card>
        <CardBody>
          <h2 className="font-semibold text-slate-900">Compliance Calendar</h2>
          <ul className="mt-4 space-y-3">
            {compliance.map((item) => (
              <li key={item.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-slate-800">{item.obligationType}</p>
                  <p className="text-slate-500">
                    Due {formatDate(item.dueDate)} ({daysUntil(item.dueDate)} days)
                  </p>
                </div>
                <Badge tone={complianceTone[item.status]}>{item.status.replace(/_/g, " ")}</Badge>
              </li>
            ))}
            {compliance.length === 0 && <p className="text-sm text-slate-400">No obligations on file.</p>}
          </ul>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Invoices</h2>
            <Link href="/portal/invoices" className="text-sm text-emerald-700 hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {invoices.slice(0, 5).map((invoice) => (
              <li key={invoice.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{invoice.invoiceNumber}</span>
                <span className="text-slate-500">{formatCents(calculateTotals(invoice.lineItems).totalCents)}</span>
                <Badge tone={invoice.paymentStatus === "paid" ? "green" : "yellow"}>
                  {invoice.paymentStatus}
                </Badge>
              </li>
            ))}
            {invoices.length === 0 && <p className="text-sm text-slate-400">No invoices yet.</p>}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
