import type { LineItem, VatRate } from "./domain/types";

// Statutory note required on every reverse-charge invoice/quote line (PRD Epic C).
export const REVERSE_CHARGE_NOTE =
  "VAT to be accounted for by the recipient under the reverse charge mechanism (Intra-EU B2B supply of services).";

export function lineNetCents(item: LineItem): number {
  return Math.round(item.quantity * item.unitPriceCents);
}

export function lineVatCents(item: LineItem): number {
  const { vatRate } = item;
  if (vatRate === "exempt" || vatRate === "reverse_charge") return 0;
  return Math.round((lineNetCents(item) * vatRate) / 100);
}

export function lineTotalCents(item: LineItem): number {
  return lineNetCents(item) + lineVatCents(item);
}

export function vatRateLabel(vatRate: VatRate): string {
  if (vatRate === "exempt") return "Exempt";
  if (vatRate === "reverse_charge") return "Reverse Charge";
  return `${vatRate}%`;
}

export interface LineItemTotals {
  netCents: number;
  vatCents: number;
  totalCents: number;
  hasReverseCharge: boolean;
}

export function calculateTotals(lineItems: LineItem[]): LineItemTotals {
  return lineItems.reduce<LineItemTotals>(
    (acc, item) => ({
      netCents: acc.netCents + lineNetCents(item),
      vatCents: acc.vatCents + lineVatCents(item),
      totalCents: acc.totalCents + lineTotalCents(item),
      hasReverseCharge: acc.hasReverseCharge || item.vatRate === "reverse_charge",
    }),
    { netCents: 0, vatCents: 0, totalCents: 0, hasReverseCharge: false }
  );
}
