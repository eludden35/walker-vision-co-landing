import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Selections } from "@/lib/pricing";
import { buildLineItems } from "@/lib/pricing";
import { roundMoney } from "@/lib/customQuoteSchema";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type ContactRow = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
};

type LineItem = { label: string; amount: number };

type OutboundLine = {
  description: string;
  quantity: number;
  unitPrice: number;
};

function money(n: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

type Props = { params: Promise<{ id: string }> };

export default async function AdminQuoteDetailPage({ params }: Props) {
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    notFound();
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: inbound, error: inboundErr } = await supabase
    .from("quote_submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (inboundErr) {
    notFound();
  }

  if (inbound) {
    return <InboundQuoteDetail row={inbound} />;
  }

  const { data: outbound, error: outboundErr } = await supabase
    .from("outbound_custom_quotes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (outboundErr || !outbound) {
    notFound();
  }

  return <OutboundQuoteDetail row={outbound} />;
}

type InboundRow = {
  id: string;
  created_at: string;
  estimate_number: string;
  contact: unknown;
  selections: unknown;
  line_items: unknown;
  total: number | string;
};

function InboundQuoteDetail({ row }: { row: InboundRow }) {
  const contact = row.contact as ContactRow;
  const storedItems = row.line_items as LineItem[] | null;
  let items: LineItem[] = Array.isArray(storedItems) ? storedItems : [];
  if (items.length === 0) {
    try {
      items = buildLineItems(row.selections as Selections);
    } catch {
      items = [];
    }
  }

  const created = new Date(row.created_at).toLocaleString();

  const prefill = new URLSearchParams();
  if (contact.name) prefill.set("name", contact.name);
  if (contact.email) prefill.set("email", contact.email);
  if (contact.phone) prefill.set("phone", contact.phone);
  const prefillQs = prefill.toString();

  return (
    <div>
      <Link href="/admin/quotes" className="walker-admin-portal-back-link">
        <i className="ri-arrow-left-line" aria-hidden />
        Back to quotes
      </Link>
      <p className="walker-admin-portal-eyebrow small mb-1">Website request</p>
      <h1 className="walker-admin-portal-page-title mb-2">{row.estimate_number}</h1>
      <p className="walker-admin-portal-muted small mb-2">{created}</p>
      <p className="mb-4">
        <Link
          href={`/admin/quotes/new${prefillQs ? `?${prefillQs}` : ""}`}
          className="walker-admin-portal-btn-table"
        >
          Send custom quote (prefill customer)
        </Link>
      </p>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="walker-admin-portal-panel h-100">
            <div className="walker-admin-portal-panel-header">Customer</div>
            <div className="walker-admin-portal-panel-body">
              <table className="table table-sm mb-0 walker-admin-portal-detail-table">
                <tbody>
                  <tr>
                    <th scope="row">Name</th>
                    <td>{contact.name ?? "—"}</td>
                  </tr>
                  <tr>
                    <th scope="row">Email</th>
                    <td>
                      {contact.email ? (
                        <a href={`mailto:${contact.email}`}>{contact.email}</a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Phone</th>
                    <td>
                      {contact.phone ? (
                        <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Address</th>
                    <td>{contact.address || "—"}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="align-top">
                      Notes
                    </th>
                    <td style={{ whiteSpace: "pre-wrap" }}>
                      {contact.notes || "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="walker-admin-portal-panel h-100">
            <div className="walker-admin-portal-panel-header">Line items</div>
            <div className="walker-admin-portal-panel-body walker-admin-portal-panel-body--flush">
              <table className="table table-sm mb-0 walker-admin-portal-detail-table">
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="walker-admin-portal-muted p-3">
                        No line items.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, i) => (
                      <tr key={`${item.label}-${i}`}>
                        <td>{item.label}</td>
                        <td className="text-end text-nowrap">
                          ${item.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                  <tr className="walker-admin-portal-total-row">
                    <td>Total</td>
                    <td className="text-end text-nowrap">
                      ${Number(row.total).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <details className="walker-admin-portal-details mt-4">
        <summary className="small">Raw selections (JSON)</summary>
        <pre className="walker-admin-portal-pre mt-2 mb-0 overflow-auto">
          {JSON.stringify(row.selections, null, 2)}
        </pre>
      </details>
    </div>
  );
}

type OutboundRow = {
  id: string;
  created_at: string;
  estimate_number: string;
  contact: unknown;
  lines: unknown;
  subtotal: number | string;
  discount_percent: number | string;
  discount_amount: number | string;
  tax_percent: number | string;
  tax_amount: number | string;
  total: number | string;
  sent_to_email: string;
  status: string;
};

function OutboundQuoteDetail({ row }: { row: OutboundRow }) {
  const contact = row.contact as ContactRow;
  const rawLines = row.lines as OutboundLine[] | null;
  const lines: OutboundLine[] = Array.isArray(rawLines) ? rawLines : [];

  const created = new Date(row.created_at).toLocaleString();
  const subtotal = Number(row.subtotal);
  const discountPct = Number(row.discount_percent);
  const discountAmt = Number(row.discount_amount);
  const taxPct = Number(row.tax_percent);
  const taxAmt = Number(row.tax_amount);
  const grand = Number(row.total);

  const prefill = new URLSearchParams();
  if (contact.name) prefill.set("name", contact.name);
  if (contact.email) prefill.set("email", contact.email);
  if (contact.phone) prefill.set("phone", contact.phone);
  const prefillQs = prefill.toString();

  return (
    <div>
      <Link href="/admin/quotes" className="walker-admin-portal-back-link">
        <i className="ri-arrow-left-line" aria-hidden />
        Back to quotes
      </Link>
      <p className="walker-admin-portal-eyebrow small mb-1">Custom quote sent</p>
      <h1 className="walker-admin-portal-page-title mb-2">{row.estimate_number}</h1>
      <p className="walker-admin-portal-muted small mb-2">{created}</p>
      <p className="mb-2 small">
        Sent to{" "}
        <a href={`mailto:${row.sent_to_email}`}>{row.sent_to_email}</a>
        {row.status ? (
          <span className="walker-admin-portal-muted"> · {row.status}</span>
        ) : null}
      </p>
      <p className="mb-4">
        <Link
          href={`/admin/quotes/new${prefillQs ? `?${prefillQs}` : ""}`}
          className="walker-admin-portal-btn-table"
        >
          Send another custom quote (prefill customer)
        </Link>
      </p>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="walker-admin-portal-panel h-100">
            <div className="walker-admin-portal-panel-header">Customer</div>
            <div className="walker-admin-portal-panel-body">
              <table className="table table-sm mb-0 walker-admin-portal-detail-table">
                <tbody>
                  <tr>
                    <th scope="row">Name</th>
                    <td>{contact.name ?? "—"}</td>
                  </tr>
                  <tr>
                    <th scope="row">Email</th>
                    <td>
                      {contact.email ? (
                        <a href={`mailto:${contact.email}`}>{contact.email}</a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Phone</th>
                    <td>
                      {contact.phone ? (
                        <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Address</th>
                    <td>{contact.address || "—"}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="align-top">
                      Notes
                    </th>
                    <td style={{ whiteSpace: "pre-wrap" }}>
                      {contact.notes || "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="walker-admin-portal-panel h-100">
            <div className="walker-admin-portal-panel-header">Line items</div>
            <div className="walker-admin-portal-panel-body walker-admin-portal-panel-body--flush">
              <table className="table table-sm mb-0 walker-admin-portal-detail-table">
                <thead>
                  <tr className="small walker-admin-portal-muted">
                    <th scope="col">Description</th>
                    <th scope="col" className="text-end">
                      Qty
                    </th>
                    <th scope="col" className="text-end">
                      Unit
                    </th>
                    <th scope="col" className="text-end">
                      Line
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lines.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="walker-admin-portal-muted p-3">
                        No line items.
                      </td>
                    </tr>
                  ) : (
                    lines.map((line, i) => {
                      const lineTotal = roundMoney(
                        line.quantity * line.unitPrice,
                      );
                      return (
                        <tr key={`${line.description}-${i}`}>
                          <td>{line.description}</td>
                          <td className="text-end">{line.quantity}</td>
                          <td className="text-end text-nowrap">
                            ${money(line.unitPrice)}
                          </td>
                          <td className="text-end text-nowrap">
                            ${money(lineTotal)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                  <tr>
                    <td colSpan={3} className="text-end walker-admin-portal-muted">
                      Subtotal
                    </td>
                    <td className="text-end text-nowrap">${money(subtotal)}</td>
                  </tr>
                  {discountPct > 0 ? (
                    <tr>
                      <td colSpan={3} className="text-end walker-admin-portal-muted">
                        Discount ({discountPct}%)
                      </td>
                      <td className="text-end text-nowrap">
                        -${money(discountAmt)}
                      </td>
                    </tr>
                  ) : null}
                  {taxPct > 0 ? (
                    <tr>
                      <td colSpan={3} className="text-end walker-admin-portal-muted">
                        Tax ({taxPct}%)
                      </td>
                      <td className="text-end text-nowrap">${money(taxAmt)}</td>
                    </tr>
                  ) : null}
                  <tr className="walker-admin-portal-total-row">
                    <td colSpan={3}>Total</td>
                    <td className="text-end text-nowrap">${money(grand)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <details className="walker-admin-portal-details mt-4">
        <summary className="small">Raw payload (JSON)</summary>
        <pre className="walker-admin-portal-pre mt-2 mb-0 overflow-auto">
          {JSON.stringify(
            {
              lines: row.lines,
              subtotal: row.subtotal,
              discount_percent: row.discount_percent,
              discount_amount: row.discount_amount,
              tax_percent: row.tax_percent,
              tax_amount: row.tax_amount,
              total: row.total,
            },
            null,
            2,
          )}
        </pre>
      </details>
    </div>
  );
}
