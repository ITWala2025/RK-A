import type { ReactNode } from "react";
import { AdminSessionProvider } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminSessionProvider>
      <AdminShell>{children}</AdminShell>
    </AdminSessionProvider>
  );
}
