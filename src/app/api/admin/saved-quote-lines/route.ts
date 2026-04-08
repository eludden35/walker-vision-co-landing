import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { requireAdmin } from "@/lib/admin/verifyAdmin";
import { z } from "zod";
import { normalizeLabelForSavedLine } from "@/lib/customQuoteSchema";

const SaveLineSchema = z.object({
  label: z.string().min(1).max(500),
  unitPrice: z.coerce.number().min(0).max(99_999_999),
  defaultQty: z.coerce.number().int().min(1).max(9999).default(1),
  source: z.enum(["manual", "catalog", "sent_quote"]).default("manual"),
});

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const admin = await requireAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("saved_quote_lines")
    .select("id, label, unit_price, default_qty, source, use_count, last_used_at")
    .eq("admin_user_id", admin.userId)
    .order("last_used_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("saved_quote_lines GET:", error);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }

  return NextResponse.json({ lines: data ?? [] });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const admin = await requireAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = SaveLineSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { label, unitPrice, defaultQty, source } = parsed.data;
  const trimmed = label.trim();
  const label_normalized = normalizeLabelForSavedLine(trimmed);

  const { data: existing } = await supabase
    .from("saved_quote_lines")
    .select("id, use_count")
    .eq("admin_user_id", admin.userId)
    .eq("label_normalized", label_normalized)
    .eq("unit_price", unitPrice)
    .maybeSingle();

  const now = new Date().toISOString();

  if (existing) {
    const { error } = await supabase
      .from("saved_quote_lines")
      .update({
        use_count: existing.use_count + 1,
        last_used_at: now,
        label: trimmed,
        default_qty: defaultQty,
        source,
      })
      .eq("id", existing.id);
    if (error) {
      console.error("saved_quote_lines POST update:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
  } else {
    const { error } = await supabase.from("saved_quote_lines").insert({
      admin_user_id: admin.userId,
      label: trimmed,
      label_normalized,
      unit_price: unitPrice,
      default_qty: defaultQty,
      source,
      use_count: 1,
      last_used_at: now,
    });
    if (error) {
      console.error("saved_quote_lines POST insert:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
