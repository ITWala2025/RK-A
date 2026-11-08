"use client";

import { Suspense } from "react";
import ContractManagement from "@/components/contract/ContractManagement";

export const dynamic = "force-dynamic";

export default function AdminNewContractPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Contract Builder...</div>}>
      <ContractManagement initialTab="contracts" />
    </Suspense>
  );
}

