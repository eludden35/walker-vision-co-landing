import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Resend } from "resend";
import { createClient } from "@/utils/supabase/server";
import { requireAdmin } from "@/lib/admin/verifyAdmin";
import {
  CustomQuotePayloadSchema,
  computeQuoteTotals,
} from "@/lib/customQuoteSchema";
import { customQuoteToEstimateData } from "@/lib/customQuoteToEstimate";
import {
  generateAdminEstimateNumber,
  generateEstimatePdf,
} from "@/lib/generateEstimatePdf";
import { upsertSavedQuoteLinesAfterSend } from "@/lib/savedQuoteLinesUpsert";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Missing RESEND_API_KEY");
  return new Resend(key);
}

const RECIPIENT =
  process.env.QUOTE_RECIPIENT_EMAIL || "walkerco.constructioncompany@gmail.com";

function money(n: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const adminSession = await requireAdmin(supabase);
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CustomQuotePayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const payload = parsed.data;
  const totals = computeQuoteTotals(
    payload.lines,
    payload.discountPercent,
    payload.taxPercent,
  );

  if (totals.grandTotal <= 0) {
    return NextResponse.json(
      { error: "Grand total must be greater than zero" },
      { status: 400 },
    );
  }

  const estimateNumber = generateAdminEstimateNumber();
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const estimateData = customQuoteToEstimateData(
    payload,
    totals,
    estimateNumber,
    date,
  );

  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await generateEstimatePdf(estimateData);
  } catch (e) {
    console.error("generateEstimatePdf:", e);
    return NextResponse.json({ error: "Failed to build PDF" }, { status: 500 });
  }

  const lineRows = payload.lines.map((line, i) => {
    const amt = totals.lineAmounts[i]!;
    return `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee">${line.description}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">${line.quantity}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">$${money(line.unitPrice)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;font-weight:600">$${money(amt)}</td></tr>`;
  });

  const summaryRows: string[] = [
    `<tr><td colspan="3" style="padding:8px 12px;text-align:right;color:#555">Subtotal</td><td style="padding:8px 12px;text-align:right;font-weight:600">$${money(totals.subtotal)}</td></tr>`,
  ];
  if (payload.discountPercent > 0) {
    summaryRows.push(
      `<tr><td colspan="3" style="padding:8px 12px;text-align:right;color:#555">Discount (${payload.discountPercent}%)</td><td style="padding:8px 12px;text-align:right;font-weight:600">-$${money(totals.discountAmount)}</td></tr>`,
    );
  }
  if (payload.taxPercent > 0) {
    summaryRows.push(
      `<tr><td colspan="3" style="padding:8px 12px;text-align:right;color:#555">Tax (${payload.taxPercent}%)</td><td style="padding:8px 12px;text-align:right;font-weight:600">$${money(totals.taxAmount)}</td></tr>`,
    );
  }

  const emailHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#2D1C22;padding:24px;text-align:center">
          <h1 style="color:#af9e6d;margin:0;font-size:24px">Walker Vision Co</h1>
          <p style="color:#fff;margin:8px 0 0">Custom quote</p>
          <p style="color:#af9e6d;margin:6px 0 0;font-size:13px">${estimateNumber}</p>
        </div>
        <div style="padding:24px;background:#fff">
          <h2 style="margin:0 0 16px;color:#2D1C22">Customer</h2>
          <table style="width:100%;margin-bottom:24px">
            <tr><td style="padding:4px 0;color:#555"><strong>Name:</strong></td><td>${payload.contact.name}</td></tr>
            <tr><td style="padding:4px 0;color:#555"><strong>Email:</strong></td><td>${payload.contact.email}</td></tr>
            <tr><td style="padding:4px 0;color:#555"><strong>Phone:</strong></td><td>${payload.contact.phone}</td></tr>
            ${payload.contact.address ? `<tr><td style="padding:4px 0;color:#555"><strong>Address:</strong></td><td>${payload.contact.address}</td></tr>` : ""}
            ${payload.contact.notes ? `<tr><td style="padding:4px 0;color:#555"><strong>Notes:</strong></td><td>${payload.contact.notes}</td></tr>` : ""}
          </table>

          <h2 style="margin:0 0 16px;color:#2D1C22">Line items</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr style="background:#2D1C22;color:#af9e6d">
              <th style="padding:8px 12px;text-align:left">Description</th>
              <th style="padding:8px 12px;text-align:right">Qty</th>
              <th style="padding:8px 12px;text-align:right">Unit</th>
              <th style="padding:8px 12px;text-align:right">Amount</th>
            </tr>
            ${lineRows.join("")}
            ${summaryRows.join("")}
            <tr style="background:#f8f8f8">
              <td colspan="3" style="padding:12px;font-weight:700;font-size:18px">Total</td>
              <td style="padding:12px;font-weight:700;font-size:18px;text-align:right;color:#af9e6d">$${money(totals.grandTotal)}</td>
            </tr>
          </table>

          <p style="margin:20px 0 0;padding:14px;background:#f9f6ef;border-radius:6px;color:#2D1C22;font-size:13px;text-align:center">
            Your detailed estimate is attached as a PDF.
          </p>
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;color:#888;font-size:13px">
          Quote prepared by Walker Vision Co.
        </div>
      </div>
    `;

  const pdfAttachment = {
    filename: `${estimateNumber}.pdf`,
    content: pdfBuffer,
  };

  let resend: Resend;
  try {
    resend = getResend();
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Email is not configured (RESEND_API_KEY)." },
      { status: 500 },
    );
  }

  try {
    await resend.emails.send({
      from: "Walker Vision Co <no-reply@noreply.walkervisionco.com>",
      to: RECIPIENT,
      subject: `Custom quote sent to ${payload.contact.name} — $${money(totals.grandTotal)} (${estimateNumber})`,
      html: emailHtml,
      attachments: [pdfAttachment],
    });

    await resend.emails.send({
      from: "Walker Vision Co <no-reply@noreply.walkervisionco.com>",
      to: payload.contact.email,
      subject: `Your quote from Walker Vision Co — $${money(totals.grandTotal)}`,
      html: emailHtml.replace("Custom quote", "Your quote estimate"),
      attachments: [pdfAttachment],
    });
  } catch (e) {
    console.error("Resend send error:", e);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  try {
    const { error: obErr } = await supabase.from("outbound_custom_quotes").insert({
      created_by: adminSession.userId,
      estimate_number: estimateNumber,
      contact: payload.contact,
      lines: payload.lines,
      subtotal: totals.subtotal,
      discount_percent: payload.discountPercent,
      discount_amount: totals.discountAmount,
      tax_percent: payload.taxPercent,
      tax_amount: totals.taxAmount,
      total: totals.grandTotal,
      sent_to_email: payload.contact.email,
      status: "sent",
    });
    if (obErr) console.error("outbound_custom_quotes insert:", obErr);

    await upsertSavedQuoteLinesAfterSend(
      supabase,
      adminSession.userId,
      payload.lines.map((l) => ({
        description: l.description,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
      })),
      "sent_quote",
    );
  } catch (e) {
    console.error("Post-send persistence:", e);
  }

  return NextResponse.json({ ok: true, estimateNumber });
}
