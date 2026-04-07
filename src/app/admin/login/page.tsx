import LoginForm from "./LoginForm";
import { safeAdminNext } from "@/lib/admin/safeNext";

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
