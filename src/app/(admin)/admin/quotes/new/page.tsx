import { customersRepository } from "@/lib/data/customers.repository";
import { Card, CardBody } from "@/components/ui/Card";
import { LineItemsEditor } from "@/components/admin/LineItemsEditor";
import { createQuote } from "../actions";
import type { LineItem } from "@/lib/domain/types";
import { isoDateDaysFromNow } from "@/lib/format";

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const { customerId } = await searchParams;
  const customers = await customersRepository.list();

  async function handleCreate(formData: FormData) {
    "use server";
    const lineItems = JSON.parse(String(formData.get("lineItems") ?? "[]")) as LineItem[];
    const validItems = lineItems.filter((li) => li.description.trim().length > 0);
    await createQuote({
      customerId: String(formData.get("customerId")),
      lineItems: validItems,
      validUntil: String(formData.get("validUntil")),
    });
  }

  const defaultValidUntil = isoDateDaysFromNow(30);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">New Quote</h1>
        <p className="mt-1 text-sm text-slate-500">Default validity period is 30 days.</p>
      </div>

      <Card>
        <CardBody>
          <form action={handleCreate} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="customerId" className="block text-sm font-medium text-slate-700">
                  Customer
                </label>
                <select
                  id="customerId"
                  name="customerId"
                  defaultValue={customerId}
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="" disabled>
                    Select a customer
                  </option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.legalEntityName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="validUntil" className="block text-sm font-medium text-slate-700">
                  Valid Until
                </label>
                <input
                  id="validUntil"
                  name="validUntil"
                  type="date"
                  defaultValue={defaultValidUntil}
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <LineItemsEditor name="lineItems" />

            <button
              type="submit"
              className="rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Save Draft Quote
            </button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
