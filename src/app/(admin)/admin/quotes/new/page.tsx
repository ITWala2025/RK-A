"use client";

import { Suspense } from "react";
import QuoteManagement from "@/components/quote/QuoteManagement";

export const dynamic = "force-dynamic";

export default function AdminNewQuotePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Quote Builder...</div>}>
      <QuoteManagement initialTab="create-quote" />
    </Suspense>
  );
}
