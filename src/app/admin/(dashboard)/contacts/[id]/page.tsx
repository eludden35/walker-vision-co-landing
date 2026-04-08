import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type Props = { params: Promise<{ id: string }> };

export default async function AdminContactDetailPage({ params }: Props) {
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    notFound();
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: row, error } = await supabase
    .from("contact_messages")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !row) {
    notFound();
  }

  const created = new Date(row.created_at).toLocaleString();

  return (
    <div>
      <Link href="/admin/contacts" className="walker-admin-portal-back-link">
        <i className="ri-arrow-left-line" aria-hidden />
        Back to contacts
      </Link>
      <h1 className="walker-admin-portal-page-title mb-2">{row.subject}</h1>
      <p className="walker-admin-portal-muted small mb-4">{created}</p>

      <div className="walker-admin-portal-panel mb-4">
        <div className="walker-admin-portal-panel-header">Sender</div>
        <div className="walker-admin-portal-panel-body">
          <table className="table table-sm mb-0 walker-admin-portal-detail-table">
            <tbody>
              <tr>
                <th scope="row">Name</th>
                <td>{row.name}</td>
              </tr>
              <tr>
                <th scope="row">Email</th>
                <td>
                  <a href={`mailto:${row.email}`}>{row.email}</a>
                </td>
              </tr>
              <tr>
                <th scope="row">Phone</th>
                <td>
                  {row.phone ? (
                    <a href={`tel:${row.phone}`}>{row.phone}</a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="walker-admin-portal-panel">
        <div className="walker-admin-portal-panel-header">Message</div>
        <div className="walker-admin-portal-panel-body">
          <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
            {row.message}
          </p>
        </div>
      </div>
    </div>
  );
}
