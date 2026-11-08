"use client";

import { Suspense } from "react";
import CustomerManagement from "@/components/customer/CustomerManagement";

export const dynamic = "force-dynamic";

export default function AdminNewCustomerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Customer Form...</div>}>
      <CustomerManagement />
    </Suspense>
  );
}

