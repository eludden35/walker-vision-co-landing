import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { ADMIN_PAGE_SIZE, parsePage } from "@/lib/admin/pagination";
import { escapeIlikePattern } from "@/lib/admin/escapeIlike";

type Props = {
  searchParams: Promise<{ page?: string; q?: string }>;
};

export default async function AdminContactsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const q = sp.q?.trim() ?? "";
  const from = (page - 1) * ADMIN_PAGE_SIZE;
  const to = from + ADMIN_PAGE_SIZE - 1;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  let query = supabase
    .from("contact_messages")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (q.length > 0) {
    const pattern = `%${escapeIlikePattern(q)}%`;
    query = query.or(
      `name.ilike.${pattern},email.ilike.${pattern},subject.ilike.${pattern}`,
    );
  }

  const { data: rows, error, count } = await query;

  if (error) {
    return (
      <div
        className="walker-admin-portal-alert walker-admin-portal-alert--error"
        role="alert"
      >
        Could not load messages: {error.message}
      </div>
    );
  }

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <h1 className="walker-admin-portal-page-title">Contact messages</h1>
        <form className="d-flex gap-2 flex-md-nowrap flex-wrap" method="get" action="/admin/contacts">
          <input
            type="search"
            name="q"
            className="form-control form-control-sm walker-admin-portal-input flex-grow-1"
            style={{ minWidth: "200px" }}
            placeholder="Search name, email, subject"
            defaultValue={q}
            aria-label="Search contacts"
          />
          <button
            type="submit"
            className="btn btn-sm walker-admin-portal-btn-search"
          >
            Search
          </button>
        </form>
      </div>

      <div className="walker-admin-portal-table-wrap">
        <table className="table table-hover table-sm mb-0 align-middle walker-admin-portal-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>From</th>
              <th>Subject</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).length === 0 ? (
              <tr>
                <td colSpan={4} className="walker-admin-portal-table-empty">
                  No messages yet.
                </td>
              </tr>
            ) : (
              (rows ?? []).map((row) => {
                const created = new Date(row.created_at).toLocaleString();
                return (
                  <tr key={row.id}>
                    <td className="text-nowrap small walker-admin-portal-muted">
                      {created}
                    </td>
                    <td>
                      <div>{row.name}</div>
                      <div className="small walker-admin-portal-muted">
                        {row.email}
                      </div>
                    </td>
                    <td className="small">{row.subject}</td>
                    <td>
                      <Link
                        href={`/admin/contacts/${row.id}`}
                        className="walker-admin-portal-btn-table"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <nav
          className="walker-admin-portal-pagination mt-3 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2"
          aria-label="Contact list pagination"
        >
          <span className="small walker-admin-portal-muted">
            Page {page} of {totalPages} ({total} total)
          </span>
          <div className="d-flex gap-2">
            {page > 1 ? (
              <Link
                className="btn btn-sm walker-admin-portal-btn-page"
                href={`/admin/contacts?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              >
                Previous
              </Link>
            ) : null}
            {page < totalPages ? (
              <Link
                className="btn btn-sm walker-admin-portal-btn-page"
                href={`/admin/contacts?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              >
                Next
              </Link>
            ) : null}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
