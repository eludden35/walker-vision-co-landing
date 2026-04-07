import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { ADMIN_PAGE_SIZE, parsePage } from "@/lib/admin/pagination";
import { escapeIlikePattern } from "@/lib/admin/escapeIlike";

type Props = {
  searchParams: Promise<{ page?: string; q?: string }>;
};

export default async function AdminQuotesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const q = sp.q?.trim() ?? "";
  const from = (page - 1) * ADMIN_PAGE_SIZE;
  const to = from + ADMIN_PAGE_SIZE - 1;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  let query = supabase
    .from("quote_submissions")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (q.length > 0) {
    const pattern = `%${escapeIlikePattern(q)}%`;
    query = query.ilike("estimate_number", pattern);
  }

  const { data: rows, error, count } = await query;

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Could not load quotes: {error.message}
      </div>
    );
  }

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <h1 className="h3 mb-0">Quote requests</h1>
        <form className="d-flex gap-2" method="get" action="/admin/quotes">
          <input
            type="search"
            name="q"
            className="form-control form-control-sm"
            placeholder="Search estimate #"
            defaultValue={q}
            aria-label="Search by estimate number"
          />
          <button type="submit" className="btn btn-sm btn-outline-secondary">
            Search
          </button>
        </form>
      </div>

      <div className="table-responsive shadow-sm bg-white rounded">
        <table className="table table-hover table-sm mb-0 align-middle">
          <thead className="table-light">
            <tr>
              <th>Date</th>
              <th>Estimate</th>
              <th>Customer</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).length === 0 ? (
              <tr>
                <td colSpan={5} className="text-secondary text-center py-4">
                  No quotes yet.
                </td>
              </tr>
            ) : (
              (rows ?? []).map((row) => {
                const contact = row.contact as {
                  name?: string;
                  email?: string;
                };
                const created = new Date(row.created_at).toLocaleString();
                return (
                  <tr key={row.id}>
                    <td className="text-nowrap small">{created}</td>
                    <td className="font-monospace small">{row.estimate_number}</td>
                    <td>
                      <div>{contact?.name ?? "—"}</div>
                      <div className="small text-secondary">{contact?.email}</div>
                    </td>
                    <td>${Number(row.total).toLocaleString()}</td>
                    <td>
                      <Link
                        href={`/admin/quotes/${row.id}`}
                        className="btn btn-sm btn-outline-dark"
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
        <nav className="mt-3 d-flex justify-content-between align-items-center">
          <span className="small text-secondary">
            Page {page} of {totalPages} ({total} total)
          </span>
          <div className="btn-group">
            {page > 1 ? (
              <Link
                className="btn btn-sm btn-outline-secondary"
                href={`/admin/quotes?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              >
                Previous
              </Link>
            ) : null}
            {page < totalPages ? (
              <Link
                className="btn btn-sm btn-outline-secondary"
                href={`/admin/quotes?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
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
