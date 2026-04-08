import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { ADMIN_PAGE_SIZE, parsePage } from "@/lib/admin/pagination";
import { escapeIlikePattern } from "@/lib/admin/escapeIlike";

type QuoteListRow = {
  id: string;
  created_at: string;
  estimate_number: string;
  total: number | string;
  contact: unknown;
  quote_source: "inbound" | "outbound";
};

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
    .from("admin_quotes_list")
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
      <div
        className="walker-admin-portal-alert walker-admin-portal-alert--error"
        role="alert"
      >
        Could not load quotes: {error.message}
      </div>
    );
  }

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <h1 className="walker-admin-portal-page-title">Quotes</h1>
        <div className="d-flex flex-column flex-sm-row gap-2 align-items-stretch align-items-sm-center">
          <Link
            href="/admin/quotes/new"
            className="btn btn-sm walker-hero-btn-primary text-nowrap"
          >
            New custom quote
          </Link>
          <form className="d-flex gap-2 flex-md-nowrap flex-wrap" method="get" action="/admin/quotes">
          <input
            type="search"
            name="q"
            className="form-control form-control-sm walker-admin-portal-input flex-grow-1"
            style={{ minWidth: "200px" }}
            placeholder="Search estimate #"
            defaultValue={q}
            aria-label="Search by estimate number"
          />
          <button
            type="submit"
            className="btn btn-sm walker-admin-portal-btn-search"
          >
            Search
          </button>
        </form>
        </div>
      </div>

      <div className="walker-admin-portal-table-wrap">
        <table className="table table-hover table-sm mb-0 align-middle walker-admin-portal-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Source</th>
              <th>Estimate</th>
              <th>Customer</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).length === 0 ? (
              <tr>
                <td colSpan={6} className="walker-admin-portal-table-empty">
                  No quotes yet.
                </td>
              </tr>
            ) : (
              (rows as QuoteListRow[]).map((row) => {
                const contact = row.contact as {
                  name?: string;
                  email?: string;
                };
                const created = new Date(row.created_at).toLocaleString();
                const sourceLabel =
                  row.quote_source === "outbound"
                    ? "Custom sent"
                    : "Website";
                return (
                  <tr key={row.id}>
                    <td className="text-nowrap small walker-admin-portal-muted">
                      {created}
                    </td>
                    <td className="small">
                      <span
                        className={
                          row.quote_source === "outbound"
                            ? "badge text-bg-secondary"
                            : "badge text-bg-dark border border-secondary"
                        }
                      >
                        {sourceLabel}
                      </span>
                    </td>
                    <td className="font-monospace small">{row.estimate_number}</td>
                    <td>
                      <div>{contact?.name ?? "—"}</div>
                      <div className="small walker-admin-portal-muted">
                        {contact?.email}
                      </div>
                    </td>
                    <td>${Number(row.total).toLocaleString()}</td>
                    <td>
                      <Link
                        href={`/admin/quotes/${row.id}`}
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
          aria-label="Quote list pagination"
        >
          <span className="small walker-admin-portal-muted">
            Page {page} of {totalPages} ({total} total)
          </span>
          <div className="d-flex gap-2">
            {page > 1 ? (
              <Link
                className="btn btn-sm walker-admin-portal-btn-page"
                href={`/admin/quotes?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              >
                Previous
              </Link>
            ) : null}
            {page < totalPages ? (
              <Link
                className="btn btn-sm walker-admin-portal-btn-page"
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
