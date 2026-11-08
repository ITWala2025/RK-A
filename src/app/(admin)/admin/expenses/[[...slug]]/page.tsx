"use client";

import React, { Suspense } from "react";
import ExpenseManagement from "@/components/admin/ExpenseManagement";

export const dynamic = "force-dynamic";

export default function ExpensesAdminPage({
  params,
}: {
  params?: Promise<{ slug?: string[] }>;
}) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 text-xs">Loading Expenses...</div>}>
      <div className="space-y-6">
        <ExpenseManagement />
      </div>
    </Suspense>
  );
}

