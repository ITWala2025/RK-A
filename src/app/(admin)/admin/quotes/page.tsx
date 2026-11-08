"use client";

import { Suspense } from "react";
import QuoteManagement from "@/components/quote/QuoteManagement";

export const dynamic = "force-dynamic";

export default function AdminQuotesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Quotes...</div>}>
      <QuoteManagement />
    </Suspense>
  );
}
