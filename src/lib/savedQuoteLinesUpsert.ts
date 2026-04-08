import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizeLabelForSavedLine, roundMoney } from "@/lib/customQuoteSchema";

export type LineForSavedSnippet = {
  description: string;
  quantity: number;
  unitPrice: number;
};

/**
 * Upserts per-line snippets for quick add (Supabase client with admin session; RLS applies).
 */
export async function upsertSavedQuoteLinesAfterSend(
  supabase: SupabaseClient,
  adminUserId: string,
  lines: LineForSavedSnippet[],
  source: "sent_quote" | "catalog" | "manual",
): Promise<void> {
  for (const line of lines) {
    const label = line.description.trim();
    if (!label) continue;
    const label_normalized = normalizeLabelForSavedLine(label);
    const unit_price = roundMoney(line.unitPrice);
    const default_qty = Math.max(1, Math.min(9999, Math.floor(line.quantity)));

    const { data: existing, error: selErr } = await supabase
      .from("saved_quote_lines")
      .select("id, use_count")
      .eq("admin_user_id", adminUserId)
      .eq("label_normalized", label_normalized)
      .eq("unit_price", unit_price)
      .maybeSingle();

    if (selErr) {
      console.error("saved_quote_lines select:", selErr);
      continue;
    }

    const now = new Date().toISOString();

    if (existing) {
      const { error: upErr } = await supabase
        .from("saved_quote_lines")
        .update({
          use_count: existing.use_count + 1,
          last_used_at: now,
          label,
          default_qty,
          source,
        })
        .eq("id", existing.id);
      if (upErr) console.error("saved_quote_lines update:", upErr);
    } else {
      const { error: insErr } = await supabase.from("saved_quote_lines").insert({
        admin_user_id: adminUserId,
        label,
        label_normalized,
        unit_price,
        default_qty,
        source,
        use_count: 1,
        last_used_at: now,
      });
      if (insErr) console.error("saved_quote_lines insert:", insErr);
    }
  }
}
