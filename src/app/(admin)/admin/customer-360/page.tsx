"use client";

import { Suspense } from "react";
import { Customer360Hub } from "@/components/customer/Customer360Hub";

export const dynamic = "force-dynamic";

export default function AdminCustomer360Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Customer 360...</div>}>
      <Customer360Hub />
    </Suspense>
  );
}
