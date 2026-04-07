"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AdminNav() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark mb-4">
      <div className="container-fluid px-3 px-md-4">
        <Link className="navbar-brand" href="/admin">
          Walker Vision — Admin
        </Link>
        <div className="navbar-nav ms-auto flex-row gap-3 align-items-center">
          <Link className="nav-link text-white-50" href="/admin/quotes">
            Quotes
          </Link>
          <Link className="nav-link text-white-50" href="/admin/contacts">
            Contacts
          </Link>
          <button
            type="button"
            className="btn btn-outline-light btn-sm"
            onClick={() => void handleSignOut()}
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
