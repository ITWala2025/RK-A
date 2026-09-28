"use client";

import { useState } from "react";
import type { LineItem, VatRate } from "@/lib/domain/types";
import { calculateTotals, lineTotalCents, lineVatCents, vatRateLabel, REVERSE_CHARGE_NOTE } from "@/lib/vat";
import { formatCents } from "@/lib/format";

const VAT_RATE_OPTIONS: VatRate[] = [23, 13.5, 9, 0, "exempt", "reverse_charge"];

function emptyLine(): LineItem {
  return { description: "", quantity: 1, unitPriceCents: 0, vatRate: 23 };
}

export function LineItemsEditor({
  name,
  initialLineItems,
  onChange,
}: {
  name: string;
  initialLineItems?: LineItem[];
  onChange?: (items: LineItem[]) => void;
}) {
  const [items, setItems] = useState<LineItem[]>(initialLineItems?.length ? initialLineItems : [emptyLine()]);

  function update(index: number, patch: Partial<LineItem>) {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setItems(next);
    onChange?.(next);
  }

  function addRow() {
    const next = [...items, emptyLine()];
    setItems(next);
    onChange?.(next);
  }

  function removeRow(index: number) {
    const next = items.filter((_, i) => i !== index);
    setItems(next.length ? next : [emptyLine()]);
    onChange?.(next.length ? next : [emptyLine()]);
  }

  const totals = calculateTotals(items);

  return (
    <div>
      {/* Serialized for plain <form action={serverAction}> submission alongside React state */}
      <input type="hidden" name={name} value={JSON.stringify(items)} />

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2">Qty</th>
              <th className="px-3 py-2">Unit Price (€)</th>
              <th className="px-3 py-2">VAT Rate</th>
              <th className="px-3 py-2">Line VAT</th>
              <th className="px-3 py-2">Line Total</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, index) => (
              <tr key={index}>
                <td className="px-3 py-2">
                  <input
                    value={item.description}
                    onChange={(e) => update(index, { description: e.target.value })}
                    className="w-full rounded border border-slate-300 px-2 py-1"
                    placeholder="Service description"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    step="0.5"
                    value={item.quantity}
                    onChange={(e) => update(index, { quantity: Number(e.target.value) })}
                    className="w-20 rounded border border-slate-300 px-2 py-1"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={(item.unitPriceCents / 100).toFixed(2)}
                    onChange={(e) =>
                      update(index, { unitPriceCents: Math.round(Number(e.target.value) * 100) })
                    }
                    className="w-28 rounded border border-slate-300 px-2 py-1"
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    value={String(item.vatRate)}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const vatRate: VatRate =
                        raw === "exempt" || raw === "reverse_charge" ? raw : (Number(raw) as VatRate);
                      update(index, { vatRate });
                    }}
                    className="rounded border border-slate-300 px-2 py-1"
                  >
                    {VAT_RATE_OPTIONS.map((rate) => (
                      <option key={String(rate)} value={String(rate)}>
                        {vatRateLabel(rate)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2 text-slate-600">{formatCents(lineVatCents(item))}</td>
                <td className="px-3 py-2 font-medium text-slate-800">
                  {formatCents(lineTotalCents(item))}
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-3 text-sm font-medium text-emerald-700 hover:underline"
      >
        + Add line item
      </button>

      {totals.hasReverseCharge && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {REVERSE_CHARGE_NOTE}
        </p>
      )}

      <div className="mt-4 flex justify-end">
        <div className="w-64 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Net</span>
            <span className="text-slate-800">{formatCents(totals.netCents)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">VAT</span>
            <span className="text-slate-800">{formatCents(totals.vatCents)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-1 font-semibold">
            <span>Total</span>
            <span>{formatCents(totals.totalCents)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
