import { notFound } from "next/navigation";
import { customersRepository } from "@/lib/data/customers.repository";
import { quotesRepository } from "@/lib/data/quotes.repository";
import { invoicesRepository } from "@/lib/data/invoices.repository";
import { complianceRepository } from "@/lib/data/compliance.repository";
import { staffRepository } from "@/lib/data/staff.repository";
import { calculateTotals } from "@/lib/vat";
import { formatCents, formatDate } from "@/lib/format";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";

const complianceTone = {
  upcoming: "slate",
  due_soon: "yellow",
  overdue: "red",
  filed: "green",
  at_risk_missing_document: "red",
} as const;

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [customer, quotes, invoices, compliance, staff] = await Promise.all([
    customersRepository.getById(id),
    quotesRepository.list(),
    invoicesRepository.list(),
    complianceRepository.listByCustomer(id),
    staffRepository.list(),
  ]);
  if (!customer) notFound();

  const customerQuotes = quotes.filter((q) => q.customerId === id);
  const customerInvoices = invoices.filter((i) => i.customerId === id);
  const relationshipManager = staff.find((s) => s.id === customer.relationshipManagerId);

  const totalInvoiced = customerInvoices.reduce(
    (sum, i) => sum + calculateTotals(i.lineItems).totalCents,
    0
  );
  const totalCollected = customerInvoices.reduce(
    (sum, i) => sum + i.payments.reduce((s, p) => s + p.amountCents, 0),
    0
  );
  const outstanding = totalInvoiced - totalCollected;

  type TimelineEntry = { date: string; label: string; type: string };
  const timeline: TimelineEntry[] = [
    ...customerQuotes.map((q) => ({
      date: q.createdAt,
      label: `Quote ${q.quoteNumber} — ${q.status}`,
      type: "quote",
    })),
    ...customerInvoices.map((i) => ({
      date: i.createdAt,
      label: `Invoice ${i.invoiceNumber} — ${i.status}`,
      type: "invoice",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{customer.legalEntityName}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {customer.clientCode} &middot; {customer.entityType.replace(/_/g, " ")} &middot;{" "}
          Relationship Manager: {relationshipManager?.name ?? "Unassigned"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Invoiced (lifetime)" value={formatCents(totalInvoiced)} />
        <StatCard label="Total Collected" value={formatCents(totalCollected)} />
        <StatCard label="Outstanding Balance" value={formatCents(outstanding)} />
      </div>

      <Card>
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase text-slate-400">CRO Number</p>
            <p className="text-slate-800">{customer.croNumber ?? "N/A (individual)"}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-slate-400">Tax Reference Number</p>
            <p className="text-slate-800">{customer.taxRefNumber ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-slate-400">VAT Number</p>
            <p className="text-slate-800">{customer.vatNumber ?? "Not VAT registered"}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-slate-400">Employer PAYE Number</p>
            <p className="text-slate-800">{customer.employerPayeNumber ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-slate-400">RBO Status</p>
            <p className="text-slate-800 capitalize">{customer.rboStatus?.replace(/_/g, " ") ?? "Not required"}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-slate-400">Risk Rating</p>
            <p className="text-slate-800 capitalize">{customer.riskRating}</p>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2 className="font-semibold text-slate-900">Compliance / CRO Tracker</h2>
          <ul className="mt-4 space-y-3">
            {compliance.length === 0 && <p className="text-sm text-slate-400">No upcoming obligations on file.</p>}
            {compliance.map((item) => (
              <li key={item.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-slate-800">{item.obligationType}</p>
                  <p className="text-slate-500">Due {formatDate(item.dueDate)}</p>
                </div>
                <Badge tone={complianceTone[item.status]}>{item.status.replace(/_/g, " ")}</Badge>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2 className="font-semibold text-slate-900">Unified Activity Timeline</h2>
          <ul className="mt-4 space-y-3">
            {timeline.length === 0 && <p className="text-sm text-slate-400">No activity yet.</p>}
            {timeline.map((entry, idx) => (
              <li key={idx} className="flex items-center gap-3 text-sm">
                <Badge tone={entry.type === "quote" ? "blue" : "green"}>{entry.type}</Badge>
                <span className="text-slate-700">{entry.label}</span>
                <span className="ml-auto text-slate-400">{formatDate(entry.date)}</span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
