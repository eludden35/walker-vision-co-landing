import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const quotesRes = await supabase
    .from("admin_quotes_list")
    .select("id", { count: "exact", head: true });

  const contactsRes = await supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true });

  if (quotesRes.error) {
    console.error("admin_quotes_list count:", quotesRes.error.message);
  }
  if (contactsRes.error) {
    console.error("contact_messages count:", contactsRes.error.message);
  }

  const quoteCount = quotesRes.error ? 0 : (quotesRes.count ?? 0);
  const contactCount = contactsRes.error ? 0 : (contactsRes.count ?? 0);

  return (
    <div>
      <p className="walker-admin-portal-eyebrow">Overview</p>
      <h1 className="walker-admin-portal-page-title mb-4 mb-lg-5">Dashboard</h1>
      <div className="row g-4">
        <div className="col-md-6 col-lg-4">
          <div className="walker-admin-portal-card">
            <h2 className="walker-admin-portal-card-label">Quotes</h2>
            <p className="walker-admin-portal-card-stat">{quoteCount ?? 0}</p>
            <Link href="/admin/quotes" className="btn walker-hero-btn-primary">
              View quotes
            </Link>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="walker-admin-portal-card">
            <h2 className="walker-admin-portal-card-label">Contact messages</h2>
            <p className="walker-admin-portal-card-stat">{contactCount ?? 0}</p>
            <Link href="/admin/contacts" className="btn walker-hero-btn-primary">
              View contacts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
