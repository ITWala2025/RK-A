"use client";

import React, { Suspense } from "react";
import IncomeManagement from "@/components/admin/IncomeManagement";

export const dynamic = "force-dynamic";

export default function IncomeAdminPage({
  params,
}: {
  params?: Promise<{ slug?: string[] }>;
}) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 text-xs">Loading Income Records...</div>}>
      <div className="space-y-6">
        <IncomeManagement />
      </div>
    </Suspense>
  );
}

