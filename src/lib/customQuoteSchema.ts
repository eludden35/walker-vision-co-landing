import { z } from "zod";

export const CustomQuoteLineSchema = z.object({
  description: z.string().min(1, "Description required").max(500),
  quantity: z.coerce.number().int().min(1).max(9999).default(1),
  unitPrice: z.coerce.number().min(0).max(99_999_999),
});

export const CustomQuotePayloadSchema = z.object({
  contact: z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(10, "Valid phone number required"),
    address: z.string().max(200).optional(),
    notes: z.string().max(2000).optional(),
  }),
  lines: z.array(CustomQuoteLineSchema).min(1, "Add at least one line"),
  discountPercent: z.coerce.number().min(0).max(100).default(0),
  taxPercent: z.coerce.number().min(0).max(100).default(0),
});

export type CustomQuoteLine = z.infer<typeof CustomQuoteLineSchema>;
export type CustomQuotePayload = z.infer<typeof CustomQuotePayloadSchema>;

export function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

export function computeLineAmount(line: { quantity: number; unitPrice: number }): number {
  return roundMoney(line.quantity * line.unitPrice);
}

export type QuoteTotals = {
  lineAmounts: number[];
  subtotal: number;
  discountAmount: number;
  afterDiscount: number;
  taxAmount: number;
  grandTotal: number;
};

export function computeQuoteTotals(
  lines: { quantity: number; unitPrice: number }[],
  discountPercent: number,
  taxPercent: number,
): QuoteTotals {
  const lineAmounts = lines.map((l) => computeLineAmount(l));
  const subtotal = roundMoney(lineAmounts.reduce((a, b) => a + b, 0));
  const discountAmount = roundMoney(subtotal * (discountPercent / 100));
  const afterDiscount = roundMoney(subtotal - discountAmount);
  const taxAmount = roundMoney(afterDiscount * (taxPercent / 100));
  const grandTotal = roundMoney(afterDiscount + taxAmount);
  return {
    lineAmounts,
    subtotal,
    discountAmount,
    afterDiscount,
    taxAmount,
    grandTotal,
  };
}

export function normalizeLabelForSavedLine(label: string): string {
  return label.trim().toLowerCase();
}
