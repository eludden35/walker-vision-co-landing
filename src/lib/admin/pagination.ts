export const ADMIN_PAGE_SIZE = 25;

export function parsePage(raw: string | string[] | undefined): number {
  const n = typeof raw === "string" ? Number.parseInt(raw, 10) : NaN;
  if (!Number.isFinite(n) || n < 1) return 1;
  return n;
}
