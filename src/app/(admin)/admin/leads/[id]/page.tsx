import { notFound } from "next/navigation";
import { leadsRepository } from "@/lib/data/leads.repository";
import { customersRepository } from "@/lib/data/customers.repository";
import { staffRepository } from "@/lib/data/staff.repository";
import { formatDate } from "@/lib/format";
import { Card, CardBody } from "@/components/ui/Card";
import { createQuoteFromLead } from "../actions";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [lead, customers, staff] = await Promise.all([
    leadsRepository.getById(id),
    customersRepository.list(),
    staffRepository.list(),
  ]);
  if (!lead) notFound();
  const owner = staff.find((s) => s.id === lead.assignedOwnerId);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{lead.name}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {lead.companyName ?? "Individual"} &middot; Received {formatDate(lead.createdAt)}
        </p>
      </div>

      <Card>
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase text-slate-400">Email</p>
            <p className="text-slate-800">{lead.email}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-slate-400">Phone</p>
            <p className="text-slate-800">{lead.phone}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-slate-400">Service Interest</p>
            <p className="text-slate-800">{lead.serviceInterest.join(", ") || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-slate-400">Relationship Manager</p>
            <p className="text-slate-800">{owner?.name ?? "Unassigned"}</p>
          </div>
          {lead.message && (
            <div className="sm:col-span-2">
              <p className="text-xs font-medium uppercase text-slate-400">Message</p>
              <p className="text-slate-800">{lead.message}</p>
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2 className="font-semibold text-slate-900">Create Quote from this Lead</h2>
          <p className="mt-1 text-sm text-slate-500">
            Select the client record this quote should be linked to (create the Customer record
            first if this is a brand-new client).
          </p>
          <form
            action={async (formData: FormData) => {
              "use server";
              const customerId = String(formData.get("customerId"));
              await createQuoteFromLead(lead.id, customerId);
            }}
            className="mt-4 flex flex-wrap items-end gap-3"
          >
            <div>
              <label htmlFor="customerId" className="block text-xs font-medium text-slate-500">
                Customer
              </label>
              <select
                id="customerId"
                name="customerId"
                required
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.legalEntityName}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Create Quote
            </button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
