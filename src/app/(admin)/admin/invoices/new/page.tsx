"use client";

import { Suspense } from "react";
import InvoiceManagement from "@/components/invoice/InvoiceManagement";

export const dynamic = "force-dynamic";

export default function AdminNewInvoicePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Invoice Builder...</div>}>
      <InvoiceManagement />
    </Suspense>
  );
}
