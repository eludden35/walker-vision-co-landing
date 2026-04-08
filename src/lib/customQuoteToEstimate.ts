import type { CustomQuotePayload } from "@/lib/customQuoteSchema";
import type { QuoteTotals } from "@/lib/customQuoteSchema";
import type { EstimateData } from "@/lib/estimatePdf/EstimatePdfDocument";

export function customQuoteToEstimateData(
  payload: CustomQuotePayload,
  totals: QuoteTotals,
  estimateNumber: string,
  date: string,
): EstimateData {
  const items = payload.lines.map((line, i) => ({
    label: line.description,
    quantity: line.quantity,
    unitPrice: line.unitPrice,
    amount: totals.lineAmounts[i]!,
  }));

  return {
    estimateNumber,
    date,
    contact: {
      name: payload.contact.name,
      email: payload.contact.email,
      phone: payload.contact.phone,
      address: payload.contact.address,
      notes: payload.contact.notes,
    },
    items,
    total: totals.grandTotal,
    breakdown: {
      subtotal: totals.subtotal,
      discountPercent: payload.discountPercent,
      discountAmount: totals.discountAmount,
      taxPercent: payload.taxPercent,
      taxAmount: totals.taxAmount,
      grandTotal: totals.grandTotal,
    },
  };
}
