"use client";

import { Suspense } from "react";
import ContractManagement from "@/components/contract/ContractManagement";

export const dynamic = "force-dynamic";

export default function AdminContractsListPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Contracts...</div>}>
      <ContractManagement initialTab="contracts" />
    </Suspense>
  );
}

