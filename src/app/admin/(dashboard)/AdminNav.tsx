"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

function navLinkClass(pathname: string, prefix: string, exact?: boolean) {
  const active =
    exact === true
      ? pathname === prefix || pathname === `${prefix}/`
      : pathname === prefix ||
        pathname === `${prefix}/` ||
        pathname.startsWith(`${prefix}/`);
  return `walker-admin-portal-nav-link${active ? " walker-admin-portal-nav-link--active" : ""}`;
}

export default function AdminNav() {
  const router = useRouter();
  const pathname = usePathname() ?? "";

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="walker-admin-portal-nav">
      <div className="walker-admin-portal-nav-inner">
        <div className="walker-admin-portal-brand-block">
          <span className="walker-brand-text">Walker Vision Co.</span>
          <span className="walker-admin-portal-brand-admin">Admin</span>
        </div>

        <nav
          className="walker-admin-portal-nav-links"
          aria-label="Admin sections"
        >
          <Link
            href="/admin"
            className={navLinkClass(pathname, "/admin", true)}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/quotes"
            className={navLinkClass(pathname, "/admin/quotes")}
          >
            Quotes
          </Link>
          <Link
            href="/admin/contacts"
            className={navLinkClass(pathname, "/admin/contacts")}
          >
            Contacts
          </Link>
        </nav>

        <div className="walker-admin-portal-nav-actions">
          <Link href="/" className="walker-admin-portal-site-link">
            View site
          </Link>
          <button
            type="button"
            className="btn walker-admin-portal-btn-signout"
            onClick={() => void handleSignOut()}
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
