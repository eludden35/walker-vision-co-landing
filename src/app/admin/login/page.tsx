import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import { safeAdminNext } from "@/lib/admin/safeNext";

export const metadata: Metadata = {
  title: "Admin sign-in | Walker Vision Co",
  description:
    "Staff sign-in for Walker Vision Co. admin tools. Same site experience—secure access for authorized users only.",
};

type Props = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  return (
    <LoginForm
      nextPath={safeAdminNext(sp.next)}
      errorKey={sp.error}
    />
  );
}
