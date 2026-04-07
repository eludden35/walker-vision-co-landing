/** Avoid open redirects after magic-link login. */
export function safeAdminNext(next: string | undefined): string {
  if (!next || !next.startsWith("/admin") || next.startsWith("//")) {
    return "/admin";
  }
  return next;
}
