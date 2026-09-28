import { leadsRepository } from "@/lib/data/leads.repository";
import { customersRepository } from "@/lib/data/customers.repository";
import { quotesRepository } from "@/lib/data/quotes.repository";
import { invoicesRepository } from "@/lib/data/invoices.repository";
import { complianceRepository } from "@/lib/data/compliance.repository";
import { calculateTotals } from "@/lib/vat";
import { formatCents, formatDate } from "@/lib/format";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

const complianceTone = {
  upcoming: "slate",
  due_soon: "yellow",
  overdue: "red",
  filed: "green",
  at_risk_missing_document: "red",
} as const;

export default async function AdminDashboardPage() {
  const [leads, customers, quotes, invoices, compliance] = await Promise.all([
    leadsRepository.list(),
    customersRepository.list(),
    quotesRepository.list(),
    invoicesRepository.list(),
    complianceRepository.list(),
  ]);

  const openLeads = leads.filter((l) => !["won", "lost"].includes(l.status)).length;
  const openQuoteValue = quotes
    .filter((q) => q.status === "sent")
    .reduce((sum, q) => sum + calculateTotals(q.lineItems).totalCents, 0);
  const outstandingCents = invoices
    .filter((i) => i.paymentStatus !== "paid")
    .reduce((sum, i) => sum + calculateTotals(i.lineItems).totalCents, 0);
  const overdueObligations = compliance.filter((c) => c.status === "overdue").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Practice Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Snapshot across CRM, Commercial Operations, and Compliance (sample data).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open Leads" value={openLeads} hint={`${leads.length} total leads`} />
        <StatCard label="Active Clients" value={customers.length} />
        <StatCard label="Open Quote Pipeline" value={formatCents(openQuoteValue)} />
        <StatCard
          label="Outstanding Invoices"
          value={formatCents(outstandingCents)}
          hint={`${overdueObligations} overdue compliance item(s)`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Compliance Calendar (sample)</h2>
              <Link href="/admin/customers" className="text-sm text-emerald-700 hover:underline">
                View clients
              </Link>
            </div>
            <ul className="mt-4 space-y-3">
              {compliance.map((item) => {
                const customer = customers.find((c) => c.id === item.customerId);
                return (
                  <li key={item.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-slate-800">
                        {item.obligationType} &mdash; {customer?.legalEntityName ?? "Unknown client"}
                      </p>
                      <p className="text-slate-500">Due {formatDate(item.dueDate)}</p>
                    </div>
                    <Badge tone={complianceTone[item.status]}>
                      {item.status.replace(/_/g, " ")}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Recent Leads</h2>
              <Link href="/admin/leads" className="text-sm text-emerald-700 hover:underline">
                View all
              </Link>
            </div>
            <ul className="mt-4 space-y-3">
              {leads.slice(0, 5).map((lead) => (
                <li key={lead.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-slate-800">{lead.name}</p>
                    <p className="text-slate-500">{lead.companyName ?? "Individual"}</p>
                  </div>
                  <Badge tone="blue">{lead.status.replace(/_/g, " ")}</Badge>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
