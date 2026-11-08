"use client";

import type { ReactNode } from "react";
import { AdminSessionProvider } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/AdminShell";
import { CompanyProvider } from "@/contexts/CompanyContext";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { ActionProgressProvider } from "@/contexts/ActionProgressContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <CompanyProvider>
      <ToastProvider>
        <ActionProgressProvider>
          <AdminSessionProvider>
            <AdminShell>{children}</AdminShell>
          </AdminSessionProvider>
        </ActionProgressProvider>
      </ToastProvider>
    </CompanyProvider>
  );
}
