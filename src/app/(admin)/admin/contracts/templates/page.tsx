"use client";

import { Suspense } from "react";
import ContractManagement from "@/components/contract/ContractManagement";

export const dynamic = "force-dynamic";

export default function AdminContractsTemplatesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Contract Templates...</div>}>
      <ContractManagement initialTab="templates" />
    </Suspense>
  );
}

