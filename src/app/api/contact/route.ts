import { NextResponse } from "next/server";
import { Resend } from "resend";
import { ContactPayloadSchema } from "@/lib/quoteSchema";
import { createAdminClient } from "@/utils/supabase/admin";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}
const RECIPIENT = process.env.QUOTE_RECIPIENT_EMAIL || "walkerco.constructioncompany@gmail.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ContactPayloadSchema.parse(body);

    if (parsed.honeypot) {
      return NextResponse.json({ success: true });
    }

    const admin = createAdminClient();
    const { error: dbError } = await admin.from("contact_messages").insert({
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone ?? null,
      subject: parsed.subject,
      message: parsed.message,
    });
    if (dbError) {
      console.error("Contact DB insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save message" },
        { status: 500 },
      );
    }

    const emailHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#2D1C22;padding:24px;text-align:center">
          <h1 style="color:#af9e6d;margin:0;font-size:24px">Walker Vision Co</h1>
          <p style="color:#fff;margin:8px 0 0">New Contact Message</p>
        </div>
        <div style="padding:24px;background:#fff">
          <table style="width:100%;margin-bottom:24px">
            <tr><td style="padding:4px 0;color:#555"><strong>Name:</strong></td><td>${parsed.name}</td></tr>
            <tr><td style="padding:4px 0;color:#555"><strong>Email:</strong></td><td>${parsed.email}</td></tr>
            ${parsed.phone ? `<tr><td style="padding:4px 0;color:#555"><strong>Phone:</strong></td><td>${parsed.phone}</td></tr>` : ""}
            <tr><td style="padding:4px 0;color:#555"><strong>Subject:</strong></td><td>${parsed.subject}</td></tr>
          </table>
          <div style="background:#f8f8f8;padding:16px;border-radius:8px">
            <p style="margin:0;white-space:pre-wrap">${parsed.message}</p>
          </div>
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;color:#888;font-size:13px">
          This message was sent from walkervisionco.com
        </div>
      </div>
    `;

    await getResend().emails.send({
      from: "Walker Vision Co <onboarding@resend.dev>",
      to: RECIPIENT,
      subject: `Contact: ${parsed.subject} — from ${parsed.name}`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
