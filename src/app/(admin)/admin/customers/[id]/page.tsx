import { notFound } from "next/navigation";
import { customersRepository } from "@/lib/data/customers.repository";
import { quotesRepository } from "@/lib/data/quotes.repository";
import { invoicesRepository } from "@/lib/data/invoices.repository";
import { complianceRepository } from "@/lib/data/compliance.repository";
import { staffRepository } from "@/lib/data/staff.repository";
import { leadsRepository } from "@/lib/data/leads.repository";
import { Customer360Hub } from "@/components/admin/Customer360Hub";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [customer, allCustomers, quotes, invoices, compliance, staff, leads] =
    await Promise.all([
      customersRepository.getById(id),
      customersRepository.list(),
      quotesRepository.list(),
      invoicesRepository.list(),
      complianceRepository.listByCustomer(id),
      staffRepository.list(),
      leadsRepository.list(),
    ]);

  if (!customer) notFound();

  const customerQuotes = quotes.filter((q) => q.customerId === id);
  const customerInvoices = invoices.filter((i) => i.customerId === id);
  const customerLeads = leads.filter(
    (l) =>
      l.companyName?.toLowerCase().includes(customer.legalEntityName.toLowerCase()) ||
      customer.legalEntityName.toLowerCase().includes(l.companyName?.toLowerCase() || "")
  );

  return (
    <Customer360Hub
      customer={customer}
      allCustomers={allCustomers}
      quotes={customerQuotes}
      invoices={customerInvoices}
      complianceItems={compliance}
      staff={staff}
      leads={customerLeads}
    />
  );
}
