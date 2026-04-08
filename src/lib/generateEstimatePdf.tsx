import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import {
  EstimatePdfDocument,
  type EstimateData,
  type EstimateLineItem,
  type EstimateBreakdown,
} from "@/lib/estimatePdf/EstimatePdfDocument";

export type { EstimateData, EstimateLineItem, EstimateBreakdown };

export async function generateEstimatePdf(data: EstimateData): Promise<Buffer> {
  const raw = await renderToBuffer(<EstimatePdfDocument data={data} />);
  return Buffer.from(raw);
}

export function generateEstimateNumber(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `EST-${yy}${mm}${dd}-${suffix}`;
}

/** Admin-issued custom quotes (distinct from public funnel EST-…). */
export function generateAdminEstimateNumber(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `ADM-${yy}${mm}${dd}-${suffix}`;
}
