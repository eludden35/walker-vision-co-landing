"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { safeAdminNext } from "@/lib/admin/safeNext";

type Props = {
  nextPath: string;
  errorKey?: string;
};

export default function LoginForm({ nextPath, errorKey }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const safeNext = safeAdminNext(nextPath);

  const errorText =
    errorKey === "auth"
      ? "Session could not be established. Try logging in again."
      : errorKey === "forbidden"
        ? "This user is not an admin. In Supabase SQL Editor: update public.profiles set role = 'admin' where id = '<auth.users id>'."
        : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@") || !password || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setSubmitting(false);
      setSubmitError(error.message);
      return;
    }
    router.push(safeNext);
    router.refresh();
  }

  return (
    <section className="walker-admin-login position-relative">
      <div className="walker-admin-login-bg position-absolute w-100 h-100" aria-hidden>
        <div className="walker-admin-login-overlay position-absolute w-100 h-100" />
        <Image
          src="/images/hero/hero-bg-1.jpg"
          alt=""
          fill
          className="object-cover walker-admin-login-bg-img"
          priority
          style={{ opacity: 0.5 }}
        />
      </div>

      <Link
        href="/"
        className="walker-admin-login-back position-absolute text-decoration-none"
      >
        <span className="d-inline-flex align-items-center gap-2">
          <i className="ri-arrow-left-line" aria-hidden />
          Back to site
        </span>
      </Link>

      <div className="container-fluid position-relative walker-admin-login-inner">
        <div className="row align-items-center g-4 g-lg-5">
          <div className="col-12 col-lg-6">
            <div className="walker-admin-login-brand text-center text-lg-start">
              <p className="walker-brand-text mb-2 mb-lg-3">
                Walker Vision Co.
              </p>
              <p className="walker-hero-subtitle mb-3 mb-lg-4">
                Design • Build • Renovate
              </p>
              <h1 className="walker-admin-login-headline mb-3 mb-lg-4">
                Welcome
                <br />
                <span className="walker-hero-title-gradient">back.</span>
              </h1>
              <p className="walker-admin-login-lead mb-0 mx-auto mx-lg-0">
                Staff sign-in for leads and project tools. Same craft as the
                site—just behind the scenes.
              </p>
            </div>
          </div>

          <div className="col-12 col-lg-5 ms-lg-auto">
            <div className="walker-admin-login-card">
              <h2 className="walker-admin-login-card-title">Staff access</h2>
              <p className="walker-admin-login-card-hint">
                Use the email and password from Supabase Authentication → Users.
                This form does not create accounts.
              </p>

              {errorText ? (
                <div
                  className="walker-admin-login-alert walker-admin-login-alert--error"
                  role="alert"
                >
                  {errorText}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label
                    htmlFor="admin-email"
                    className="form-label walker-admin-login-label"
                  >
                    Email
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    className="form-control walker-admin-login-input"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="admin-password"
                    className="form-label walker-admin-login-label"
                  >
                    Password
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    className="form-control walker-admin-login-input"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div aria-live="polite" className="walker-admin-login-live">
                  {submitError ? (
                    <p className="walker-admin-login-submit-error mb-3">
                      {submitError}
                    </p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  className="btn walker-hero-btn-primary w-100"
                  disabled={submitting}
                >
                  {submitting ? "Signing in…" : "Sign in"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
