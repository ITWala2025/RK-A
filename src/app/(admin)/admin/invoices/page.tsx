"use client";

import { Suspense } from "react";
import InvoiceManagement from "@/components/invoice/InvoiceManagement";

export const dynamic = "force-dynamic";

export default function AdminInvoicesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Invoices...</div>}>
      <InvoiceManagement />
    </Suspense>
  );
}
