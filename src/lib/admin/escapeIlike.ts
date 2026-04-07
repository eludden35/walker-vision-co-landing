/** Escape % and _ for PostgREST ilike patterns. */
export function escapeIlikePattern(q: string): string {
  return q.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}
