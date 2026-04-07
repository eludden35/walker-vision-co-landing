import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export default async function AdminHomePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { count: quoteCount } = await supabase
    .from("quote_submissions")
    .select("*", { count: "exact", head: true });

  const { count: contactCount } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true });

  return (
    <div>
      <h1 className="h3 mb-4">Dashboard</h1>
      <div className="row g-4">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h5 card-title">Quote requests</h2>
              <p className="display-6 mb-3">{quoteCount ?? 0}</p>
              <Link href="/admin/quotes" className="btn btn-outline-dark btn-sm">
                View quotes
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h5 card-title">Contact messages</h2>
              <p className="display-6 mb-3">{contactCount ?? 0}</p>
              <Link
                href="/admin/contacts"
                className="btn btn-outline-dark btn-sm"
              >
                View contacts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
