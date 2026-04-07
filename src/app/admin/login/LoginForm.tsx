"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { safeAdminNext } from "@/lib/admin/safeNext";

type Props = {
  nextPath: string;
  errorKey?: string;
};

export default function LoginForm({ nextPath, errorKey }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "err">(
    "idle",
  );
  const safeNext = safeAdminNext(nextPath);

  const errorText =
    errorKey === "auth"
      ? "Sign-in failed. Request a new link and try again."
      : errorKey === "forbidden"
        ? "This account is not an admin. In Supabase SQL Editor run: update public.profiles set role = 'admin' where id = '<your user id>'."
        : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@") || status === "sending") return;
    setStatus("sending");
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) {
      setStatus("err");
      return;
    }
    setStatus("sent");
  }

  return (
    <div className="container py-5" style={{ maxWidth: 440 }}>
      <h1 className="h3 mb-4">Admin sign in</h1>
      <p className="text-secondary small mb-4">
        Magic link — we will email you a one-time sign-in link.
      </p>
      {errorText ? (
        <div className="alert alert-danger" role="alert">
          {errorText}
        </div>
      ) : null}
      {status === "sent" ? (
        <div className="alert alert-success" role="alert">
          Check your email for the sign-in link.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="admin-email" className="form-label">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              className="form-control"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {status === "err" ? (
            <p className="text-danger small">Could not send link. Try again.</p>
          ) : null}
          <button
            type="submit"
            className="btn btn-dark"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending…" : "Email me a link"}
          </button>
        </form>
      )}
    </div>
  );
}
