"use client";

import React, { use, Suspense } from "react";
import { Customer360Hub } from "@/components/customer/Customer360Hub";

export const dynamic = "force-dynamic";

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Customer 360...</div>}>
      <Customer360Hub initialCustomerId={resolvedParams.id} />
    </Suspense>
  );
}
