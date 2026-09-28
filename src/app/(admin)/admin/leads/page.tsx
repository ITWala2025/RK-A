import Link from "next/link";
import { leadsRepository } from "@/lib/data/leads.repository";
import { staffRepository } from "@/lib/data/staff.repository";
import { formatDate } from "@/lib/format";
import { LeadStatusSelect } from "./LeadStatusSelect";

export default async function LeadsPage() {
  const [leads, staff] = await Promise.all([leadsRepository.list(), staffRepository.list()]);
  const staffById = new Map(staff.map((s) => [s.id, s.name]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
        <p className="mt-1 text-sm text-slate-500">
          Website enquiries and manually logged leads. Auto-assigned to a relationship manager on
          submission.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Service Interest</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{lead.name}</td>
                <td className="px-4 py-3 text-slate-600">{lead.companyName ?? "—"}</td>
                <td className="px-4 py-3 text-slate-600">
                  {lead.serviceInterest.join(", ") || "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {staffById.get(lead.assignedOwnerId) ?? "Unassigned"}
                </td>
                <td className="px-4 py-3 text-slate-600">{formatDate(lead.createdAt)}</td>
                <td className="px-4 py-3">
                  <LeadStatusSelect leadId={lead.id} status={lead.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/leads/${lead.id}`} className="text-emerald-700 hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  No leads yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
