import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Selections } from "@/lib/pricing";
import { buildLineItems } from "@/lib/pricing";

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

type Props = { params: Promise<{ id: string }> };

export default async function AdminQuoteDetailPage({ params }: Props) {
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    notFound();
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: row, error } = await supabase
    .from("quote_submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !row) {
    notFound();
  }

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

  return (
    <div>
      <Link href="/admin/quotes" className="small text-decoration-none mb-3 d-inline-block">
        ← Back to quotes
      </Link>
      <h1 className="h3 mb-1">{row.estimate_number}</h1>
      <p className="text-secondary small mb-4">{created}</p>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white fw-semibold">Customer</div>
            <div className="card-body">
              <table className="table table-sm mb-0">
                <tbody>
                  <tr>
                    <th className="text-secondary" style={{ width: "28%" }}>
                      Name
                    </th>
                    <td>{contact.name ?? "—"}</td>
                  </tr>
                  <tr>
                    <th className="text-secondary">Email</th>
                    <td>
                      {contact.email ? (
                        <a href={`mailto:${contact.email}`}>{contact.email}</a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th className="text-secondary">Phone</th>
                    <td>
                      {contact.phone ? (
                        <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th className="text-secondary">Address</th>
                    <td>{contact.address || "—"}</td>
                  </tr>
                  <tr>
                    <th className="text-secondary align-top">Notes</th>
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
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white fw-semibold">Line items</div>
            <div className="card-body p-0">
              <table className="table table-sm mb-0">
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td className="text-secondary p-3">No line items.</td>
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
                  <tr className="table-light fw-semibold">
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

      <details className="mt-4">
        <summary className="small text-secondary" style={{ cursor: "pointer" }}>
          Raw selections (JSON)
        </summary>
        <pre className="small bg-white border rounded p-3 mt-2 mb-0 overflow-auto">
          {JSON.stringify(row.selections, null, 2)}
        </pre>
      </details>
    </div>
  );
}
