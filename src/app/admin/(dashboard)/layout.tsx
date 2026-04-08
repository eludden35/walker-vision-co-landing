import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AdminNav from "./AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Admin layout profiles error:", profileError.message);
    redirect("/admin/login?error=auth");
  }

  if (!profile || profile.role !== "admin") {
    redirect("/admin/login?error=forbidden");
  }

  return (
    <>
      <AdminNav />
      <div className="walker-admin-portal-main container-fluid px-3 px-md-4 pb-5 pt-4">
        {children}
      </div>
    </>
  );
}
