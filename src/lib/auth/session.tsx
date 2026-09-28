"use client";

// Dev-only mock session/role switcher. NOT a security boundary — replace with
// Supabase Auth + RBAC before any real credentials or data are involved.
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { StaffRole } from "../domain/types";

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  partner_admin: "Partner / Admin",
  manager: "Manager",
  accountant: "Accountant",
  payroll_officer: "Payroll Officer",
  company_secretarial_officer: "Company Secretarial Officer",
  service_desk_agent: "Service Desk Agent",
};

interface AdminSessionValue {
  role: StaffRole;
  setRole: (role: StaffRole) => void;
}

const AdminSessionContext = createContext<AdminSessionValue | null>(null);

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<StaffRole>("partner_admin");
  const value = useMemo(() => ({ role, setRole }), [role]);
  return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>;
}

export function useAdminSession(): AdminSessionValue {
  const ctx = useContext(AdminSessionContext);
  if (!ctx) throw new Error("useAdminSession must be used within AdminSessionProvider");
  return ctx;
}

interface ClientSessionValue {
  customerId: string;
  setCustomerId: (id: string) => void;
}

const ClientSessionContext = createContext<ClientSessionValue | null>(null);

export function ClientSessionProvider({
  children,
  defaultCustomerId,
}: {
  children: ReactNode;
  defaultCustomerId: string;
}) {
  const [customerId, setCustomerId] = useState(defaultCustomerId);
  const value = useMemo(() => ({ customerId, setCustomerId }), [customerId]);
  return <ClientSessionContext.Provider value={value}>{children}</ClientSessionContext.Provider>;
}

export function useClientSession(): ClientSessionValue {
  const ctx = useContext(ClientSessionContext);
  if (!ctx) throw new Error("useClientSession must be used within ClientSessionProvider");
  return ctx;
}
