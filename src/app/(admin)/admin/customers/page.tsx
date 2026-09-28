import Link from "next/link";
import { customersRepository } from "@/lib/data/customers.repository";
import { Badge } from "@/components/ui/Badge";

const riskTone = { low: "green", medium: "yellow", high: "red" } as const;

export default async function CustomersPage() {
  const customers = await customersRepository.list();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
        <p className="mt-1 text-sm text-slate-500">Client &amp; entity records (Customer 360 core).</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Client Code</th>
              <th className="px-4 py-3">Legal Entity Name</th>
              <th className="px-4 py-3">Entity Type</th>
              <th className="px-4 py-3">VAT Number</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{customer.clientCode}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{customer.legalEntityName}</td>
                <td className="px-4 py-3 text-slate-600 capitalize">
                  {customer.entityType.replace(/_/g, " ")}
                </td>
                <td className="px-4 py-3 text-slate-600">{customer.vatNumber ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge tone={riskTone[customer.riskRating]}>{customer.riskRating}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/customers/${customer.id}`} className="text-emerald-700 hover:underline">
                    View 360
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
