import { NextResponse } from "next/server";
import { Resend } from "resend";
import { QuotePayloadSchema } from "@/lib/quoteSchema";
import { calculateTotal, buildLineItems } from "@/lib/pricing";
import {
  generateEstimatePdf,
  generateEstimateNumber,
  type EstimateData,
} from "@/lib/generateEstimatePdf";
import { createAdminClient } from "@/utils/supabase/admin";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}
const RECIPIENT =
  process.env.QUOTE_RECIPIENT_EMAIL || "walkerco.constructioncompany@gmail.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = QuotePayloadSchema.parse(body);

    if (parsed.contact.honeypot) {
      return NextResponse.json({ success: true });
    }

    const total = calculateTotal(parsed.selections);
    const items = buildLineItems(parsed.selections);

    if (total === 0) {
      return NextResponse.json(
        { error: "No services selected" },
        { status: 400 },
      );
    }

    const estimateNumber = generateEstimateNumber();
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const estimateData: EstimateData = {
      estimateNumber,
      date,
      contact: {
        name: parsed.contact.name,
        email: parsed.contact.email,
        phone: parsed.contact.phone,
        address: parsed.contact.address,
        notes: parsed.contact.notes,
      },
      items,
      total,
    };

    const contactForDb = {
      name: parsed.contact.name,
      email: parsed.contact.email,
      phone: parsed.contact.phone,
      address: parsed.contact.address,
      notes: parsed.contact.notes,
    };
    const admin = createAdminClient();
    const { error: dbError } = await admin.from("quote_submissions").insert({
      estimate_number: estimateNumber,
      contact: contactForDb,
      selections: parsed.selections,
      total,
      line_items: items,
    });
    if (dbError) {
      console.error("Quote DB insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save quote" },
        { status: 500 },
      );
    }

    const pdfBuffer = await generateEstimatePdf(estimateData);

    const lineItemsHtml = items
      .map(
        (item) =>
          `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee">${item.label}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;font-weight:600">$${item.amount.toLocaleString()}</td></tr>`,
      )
      .join("");

    const emailHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#2D1C22;padding:24px;text-align:center">
          <h1 style="color:#af9e6d;margin:0;font-size:24px">Walker Vision Co</h1>
          <p style="color:#fff;margin:8px 0 0">New Quote Request</p>
          <p style="color:#af9e6d;margin:6px 0 0;font-size:13px">${estimateNumber}</p>
        </div>
        <div style="padding:24px;background:#fff">
          <h2 style="margin:0 0 16px;color:#2D1C22">Customer Information</h2>
          <table style="width:100%;margin-bottom:24px">
            <tr><td style="padding:4px 0;color:#555"><strong>Name:</strong></td><td>${parsed.contact.name}</td></tr>
            <tr><td style="padding:4px 0;color:#555"><strong>Email:</strong></td><td>${parsed.contact.email}</td></tr>
            <tr><td style="padding:4px 0;color:#555"><strong>Phone:</strong></td><td>${parsed.contact.phone}</td></tr>
            ${parsed.contact.address ? `<tr><td style="padding:4px 0;color:#555"><strong>Address:</strong></td><td>${parsed.contact.address}</td></tr>` : ""}
            ${parsed.contact.notes ? `<tr><td style="padding:4px 0;color:#555"><strong>Notes:</strong></td><td>${parsed.contact.notes}</td></tr>` : ""}
          </table>

          <h2 style="margin:0 0 16px;color:#2D1C22">Quote Breakdown</h2>
          <table style="width:100%;border-collapse:collapse">
            ${lineItemsHtml}
            <tr style="background:#f8f8f8">
              <td style="padding:12px;font-weight:700;font-size:18px">Total</td>
              <td style="padding:12px;font-weight:700;font-size:18px;text-align:right;color:#af9e6d">$${total.toLocaleString()}</td>
            </tr>
          </table>

          <p style="margin:20px 0 0;padding:14px;background:#f9f6ef;border-radius:6px;color:#2D1C22;font-size:13px;text-align:center">
            Your detailed estimate is attached as a PDF.
          </p>
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;color:#888;font-size:13px">
          This quote was generated from walkervisionco.com
        </div>
      </div>
    `;

    const pdfAttachment = {
      filename: `${estimateNumber}.pdf`,
      content: pdfBuffer,
    };

    const resend = getResend();

    await resend.emails.send({
      from: "Walker Vision Co <no-reply@noreply.walkervisionco.com>",
      to: RECIPIENT,
      subject: `New Quote Request from ${parsed.contact.name} — $${total.toLocaleString()}`,
      html: emailHtml,
      attachments: [pdfAttachment],
    });

    await resend.emails.send({
      from: "Walker Vision Co <no-reply@noreply.walkervisionco.com>",
      to: parsed.contact.email,
      subject: `Your Quote from Walker Vision Co — $${total.toLocaleString()}`,
      html: emailHtml.replace("New Quote Request", "Your Quote Estimate"),
      attachments: [pdfAttachment],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quote submission error:", error);
    return NextResponse.json(
      { error: "Failed to process quote" },
      { status: 500 },
    );
  }
}
