import type { ReactNode } from "react";
import { ClientSessionProvider } from "@/lib/auth/session";
import { PortalShell } from "@/components/portal/PortalShell";
import { customersRepository } from "@/lib/data/customers.repository";

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const customers = await customersRepository.list();
  const defaultCustomerId = customers[0]?.id ?? "";

  return (
    <ClientSessionProvider defaultCustomerId={defaultCustomerId}>
      <PortalShell customers={customers}>{children}</PortalShell>
    </ClientSessionProvider>
  );
}
