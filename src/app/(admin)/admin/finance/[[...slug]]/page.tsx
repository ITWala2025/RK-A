"use client";

import React, { Suspense } from "react";
import FinanceManagement from "@/components/admin/FinanceManagement";

export const dynamic = "force-dynamic";

export default function FinanceAdminPage({
  params,
}: {
  params?: Promise<{ slug?: string[] }>;
}) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 text-xs">Loading Finance &amp; P&amp;L...</div>}>
      <div className="space-y-6">
        <FinanceManagement />
      </div>
    </Suspense>
  );
}

