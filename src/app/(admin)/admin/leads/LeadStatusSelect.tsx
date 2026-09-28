"use client";

import { useTransition } from "react";
import { updateLeadStatus } from "./actions";
import type { LeadStatus } from "@/lib/domain/types";

const STATUS_OPTIONS: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "proposal_sent",
  "won",
  "lost",
];

export function LeadStatusSelect({ leadId, status }: { leadId: string; status: LeadStatus }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as LeadStatus;
        startTransition(() => {
          void updateLeadStatus(leadId, next);
        });
      }}
      className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-medium disabled:opacity-60"
    >
      {STATUS_OPTIONS.map((option) => (
        <option key={option} value={option}>
          {option.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}
