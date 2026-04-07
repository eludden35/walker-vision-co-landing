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
      <Link
        href="/admin/contacts"
        className="small text-decoration-none mb-3 d-inline-block"
      >
        ← Back to contacts
      </Link>
      <h1 className="h3 mb-1">{row.subject}</h1>
      <p className="text-secondary small mb-4">{created}</p>

      <div className="card shadow-sm">
        <div className="card-header bg-white fw-semibold">Sender</div>
        <div className="card-body">
          <table className="table table-sm mb-0">
            <tbody>
              <tr>
                <th className="text-secondary" style={{ width: "28%" }}>
                  Name
                </th>
                <td>{row.name}</td>
              </tr>
              <tr>
                <th className="text-secondary">Email</th>
                <td>
                  <a href={`mailto:${row.email}`}>{row.email}</a>
                </td>
              </tr>
              <tr>
                <th className="text-secondary">Phone</th>
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
        <div className="card-header bg-white fw-semibold border-top">Message</div>
        <div className="card-body">
          <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
            {row.message}
          </p>
        </div>
      </div>
    </div>
  );
}
