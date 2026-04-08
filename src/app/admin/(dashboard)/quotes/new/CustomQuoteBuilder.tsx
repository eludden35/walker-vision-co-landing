"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  computeQuoteTotals,
  roundMoney,
  type CustomQuotePayload,
} from "@/lib/customQuoteSchema";
import { customQuoteToEstimateData } from "@/lib/customQuoteToEstimate";
import { EstimatePdfDocument } from "@/lib/estimatePdf/EstimatePdfDocument";
import { getQuoteCatalogEntries, type QuoteCatalogEntry } from "@/lib/quoteCatalog";
import { buildLineItems, type Selections } from "@/lib/pricing";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="walker-admin-portal-muted p-4 text-center small">
        Loading preview…
      </div>
    ),
  },
);

type BuilderLine = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

type SavedLineRow = {
  id: string;
  label: string;
  unit_price: number;
  default_qty: number;
};

function newLine(): BuilderLine {
  return {
    id: crypto.randomUUID(),
    description: "",
    quantity: 1,
    unitPrice: 0,
  };
}

function money(n: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

type SendSuccess = {
  estimateNumber: string;
  customerEmail: string;
  customerName?: string;
};

type Props = {
  initialName?: string;
  initialEmail?: string;
  initialPhone?: string;
};

export default function CustomQuoteBuilder({
  initialName = "",
  initialEmail = "",
  initialPhone = "",
}: Props) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<BuilderLine[]>(() => [newLine()]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);

  const [kitchenSqfts, setKitchenSqfts] = useState<number[]>([]);
  const [bathSqfts, setBathSqfts] = useState<number[]>([]);
  const [interiorWalls, setInteriorWalls] = useState(0);
  const [changingColors, setChangingColors] = useState(false);
  const [exteriorSqft, setExteriorSqft] = useState(0);
  const [newKitchenSqft, setNewKitchenSqft] = useState("");
  const [newBathSqft, setNewBathSqft] = useState("");

  const [savedLines, setSavedLines] = useState<SavedLineRow[]>([]);
  const [quickFilter, setQuickFilter] = useState("");
  const [catalogId, setCatalogId] = useState("");

  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState<SendSuccess | null>(null);
  const successPanelRef = useRef<HTMLDivElement>(null);

  const catalog = useMemo(() => getQuoteCatalogEntries(), []);

  const payloadForTotals = useMemo((): CustomQuotePayload | null => {
    const validLines = lines.filter((l) => l.description.trim().length > 0);
    if (validLines.length === 0) return null;
    return {
      contact: {
        name: name.trim() || "Preview",
        email: email.trim() || "preview@example.com",
        phone: phone.trim() || "0000000000",
        address: address.trim() || undefined,
        notes: notes.trim() || undefined,
      },
      lines: validLines.map((l) => ({
        description: l.description.trim(),
        quantity: l.quantity,
        unitPrice: l.unitPrice,
      })),
      discountPercent,
      taxPercent,
    };
  }, [lines, name, email, phone, address, notes, discountPercent, taxPercent]);

  const totals = useMemo(() => {
    if (!payloadForTotals) return null;
    return computeQuoteTotals(
      payloadForTotals.lines,
      payloadForTotals.discountPercent,
      payloadForTotals.taxPercent,
    );
  }, [payloadForTotals]);

  const previewData = useMemo(() => {
    if (!payloadForTotals || !totals) return null;
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return customQuoteToEstimateData(
      payloadForTotals,
      totals,
      "PREVIEW",
      date,
    );
  }, [payloadForTotals, totals]);

  const loadSavedLines = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/saved-quote-lines");
      if (!res.ok) return;
      const data = (await res.json()) as { lines?: SavedLineRow[] };
      setSavedLines(data.lines ?? []);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void loadSavedLines();
  }, [loadSavedLines]);

  useEffect(() => {
    if (!sendSuccess) return;
    const el = successPanelRef.current;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => el?.focus({ preventScroll: true }), 400);
  }, [sendSuccess]);

  function updateLine(id: string, patch: Partial<BuilderLine>) {
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    );
  }

  function removeLine(id: string) {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((l) => l.id !== id)));
  }

  function addBlankLine() {
    setLines((prev) => [...prev, newLine()]);
  }

  function addFromCatalog(entry: QuoteCatalogEntry) {
    setLines((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        description: entry.label,
        quantity: entry.defaultQuantity,
        unitPrice: entry.unitPrice,
      },
    ]);
    setCatalogId("");
  }

  function addFromCalculator() {
    const selections: Selections = {
      kitchens: kitchenSqfts,
      bathrooms: bathSqfts,
      painting: {
        interiorWalls,
        changingColors,
        exteriorSqft,
      },
    };
    try {
      const built = buildLineItems(selections);
      if (built.length === 0) return;
      setLines((prev) => [
        ...prev,
        ...built.map((item) => ({
          id: crypto.randomUUID(),
          description: item.label,
          quantity: 1,
          unitPrice: item.amount,
        })),
      ]);
    } catch {
      /* invalid selections */
    }
  }

  function addKitchenSqft() {
    const n = parseInt(newKitchenSqft, 10);
    if (!Number.isFinite(n) || n <= 0) return;
    setKitchenSqfts((s) => [...s, n]);
    setNewKitchenSqft("");
  }

  function addBathSqft() {
    const n = parseInt(newBathSqft, 10);
    if (!Number.isFinite(n) || n <= 0) return;
    setBathSqfts((s) => [...s, n]);
    setNewBathSqft("");
  }

  async function saveLineToQuickAdd(line: BuilderLine) {
    if (!line.description.trim()) return;
    try {
      const res = await fetch("/api/admin/saved-quote-lines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: line.description.trim(),
          unitPrice: line.unitPrice,
          defaultQty: line.quantity,
          source: "manual",
        }),
      });
      if (res.ok) void loadSavedLines();
    } catch {
      /* ignore */
    }
  }

  async function handleSend() {
    setSendError(null);
    if (!payloadForTotals) {
      setSendError("Add at least one line with a description.");
      return;
    }
    const p: CustomQuotePayload = {
      contact: {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim() || undefined,
        notes: notes.trim() || undefined,
      },
      lines: payloadForTotals.lines,
      discountPercent,
      taxPercent,
    };
    if (p.contact.name.length < 2) {
      setSendError("Customer name is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.contact.email)) {
      setSendError("Valid customer email is required.");
      return;
    }
    if (p.contact.phone.replace(/\D/g, "").length < 10) {
      setSendError("Valid customer phone is required.");
      return;
    }
    if (!totals || totals.grandTotal <= 0) {
      setSendError("Grand total must be greater than zero.");
      return;
    }

    setSendSuccess(null);
    setSending(true);
    try {
      const res = await fetch("/api/admin/send-custom-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      const data = (await res.json()) as { ok?: boolean; estimateNumber?: string; error?: unknown };
      if (!res.ok) {
        setSendError(
          typeof data.error === "string"
            ? data.error
            : "Send failed. Check configuration and try again.",
        );
        return;
      }
      setSendSuccess({
        estimateNumber: data.estimateNumber ?? "—",
        customerEmail: p.contact.email,
        customerName: p.contact.name,
      });
      void loadSavedLines();
    } catch {
      setSendError("Network error.");
    } finally {
      setSending(false);
    }
  }

  const filteredQuick = useMemo(() => {
    const q = quickFilter.trim().toLowerCase();
    if (!q) return savedLines.slice(0, 40);
    return savedLines
      .filter((r) => r.label.toLowerCase().includes(q))
      .slice(0, 40);
  }, [savedLines, quickFilter]);

  const catalogByKind = useMemo(() => {
    const g: Record<string, QuoteCatalogEntry[]> = {};
    for (const e of catalog) {
      g[e.kind] ??= [];
      g[e.kind]!.push(e);
    }
    return g;
  }, [catalog]);

  return (
    <div>
      <Link href="/admin/quotes" className="walker-admin-portal-back-link">
        <i className="ri-arrow-left-line" aria-hidden />
        Back to quotes
      </Link>
      <p className="walker-admin-portal-eyebrow">Quotes</p>
      <h1 className="walker-admin-portal-page-title mb-4">Send custom quote</h1>

      {sendError ? (
        <div
          className="walker-admin-portal-alert walker-admin-portal-alert--error mb-3"
          role="alert"
        >
          {sendError}
        </div>
      ) : null}
      {sendSuccess ? (
        <div
          ref={successPanelRef}
          className="walker-admin-quote-success mb-4"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          tabIndex={-1}
        >
          <h2 className="walker-admin-quote-success-title">Quote sent</h2>
          <ul className="walker-admin-quote-success-list list-unstyled mb-3">
            <li>
              <span className="walker-admin-portal-muted">Estimate</span>{" "}
              <span className="font-monospace fw-semibold">
                {sendSuccess.estimateNumber}
              </span>
            </li>
            <li>
              <span className="walker-admin-portal-muted">Emailed to</span>{" "}
              <a href={`mailto:${sendSuccess.customerEmail}`}>
                {sendSuccess.customerEmail}
              </a>{" "}
              <span className="walker-admin-portal-muted">
                with PDF attachment.
              </span>
            </li>
            {sendSuccess.customerName ? (
              <li>
                <span className="walker-admin-portal-muted">Customer</span>{" "}
                {sendSuccess.customerName}
              </li>
            ) : null}
            <li className="walker-admin-portal-muted small">
              A copy was also sent to your internal quote inbox (if configured).
            </li>
          </ul>
          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-sm walker-hero-btn-primary"
              onClick={() => {
                setSendSuccess(null);
                setSendError(null);
              }}
            >
              Send another quote
            </button>
            <Link
              href="/admin/quotes"
              className="btn btn-sm walker-admin-portal-btn-page"
            >
              Back to quote requests
            </Link>
          </div>
        </div>
      ) : null}

      <div className="row g-4">
        <div className="col-xl-6">
          <div className="walker-admin-portal-panel mb-4">
            <div className="walker-admin-portal-panel-header">Customer</div>
            <div className="walker-admin-portal-panel-body">
              <div className="row g-2">
                <div className="col-md-6">
                  <label className="form-label small walker-admin-portal-muted">
                    Name
                  </label>
                  <input
                    className="form-control form-control-sm walker-admin-portal-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small walker-admin-portal-muted">
                    Email
                  </label>
                  <input
                    className="form-control form-control-sm walker-admin-portal-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small walker-admin-portal-muted">
                    Phone
                  </label>
                  <input
                    className="form-control form-control-sm walker-admin-portal-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small walker-admin-portal-muted">
                    Address
                  </label>
                  <input
                    className="form-control form-control-sm walker-admin-portal-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small walker-admin-portal-muted">
                    Notes
                  </label>
                  <textarea
                    className="form-control form-control-sm walker-admin-portal-input"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="walker-admin-portal-panel mb-4">
            <div className="walker-admin-portal-panel-header">
              Catalog &amp; calculator
            </div>
            <div className="walker-admin-portal-panel-body">
              <div className="mb-3">
                <label className="form-label small walker-admin-portal-muted">
                  Add from website price book
                </label>
                <div className="d-flex gap-2 flex-wrap">
                  <select
                    className="form-select form-select-sm walker-admin-portal-input flex-grow-1"
                    style={{ minWidth: "200px" }}
                    value={catalogId}
                    onChange={(e) => setCatalogId(e.target.value)}
                  >
                    <option value="">Choose tier or preset…</option>
                    {(["kitchen", "bathroom", "painting"] as const).map((kind) =>
                      catalogByKind[kind]?.length ? (
                        <optgroup
                          key={kind}
                          label={
                            kind === "kitchen"
                              ? "Kitchens"
                              : kind === "bathroom"
                                ? "Bathrooms"
                                : "Painting"
                          }
                        >
                          {catalogByKind[kind]!.map((e) => (
                            <option key={e.id} value={e.id}>
                              {e.label} — ${e.unitPrice.toLocaleString()}
                            </option>
                          ))}
                        </optgroup>
                      ) : null,
                    )}
                  </select>
                  <button
                    type="button"
                    className="btn btn-sm walker-hero-btn-primary"
                    disabled={!catalogId}
                    onClick={() => {
                      const e = catalog.find((c) => c.id === catalogId);
                      if (e) addFromCatalog(e);
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>

              <details className="walker-admin-portal-details">
                <summary className="small walker-admin-portal-muted">
                  Mini calculator (same logic as get-a-quote)
                </summary>
                <div className="mt-3 small">
                  <p className="walker-admin-portal-muted mb-2">
                    Kitchen / bath sqft lists and painting fields use{" "}
                    <code>buildLineItems</code> from the public tool.
                  </p>
                  <div className="mb-2">
                    <span className="text-muted">Kitchens (sq ft):</span>{" "}
                    {kitchenSqfts.map((sq, i) => (
                      <span key={i} className="badge bg-secondary me-1">
                        {sq}
                        <button
                          type="button"
                          className="btn btn-link btn-sm text-white p-0 ms-1"
                          aria-label="Remove"
                          onClick={() =>
                            setKitchenSqfts((s) => s.filter((_, j) => j !== i))
                          }
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <div className="d-flex gap-1 mt-1">
                      <input
                        className="form-control form-control-sm walker-admin-portal-input"
                        style={{ maxWidth: "100px" }}
                        inputMode="numeric"
                        placeholder="Sq ft"
                        value={newKitchenSqft}
                        onChange={(e) => setNewKitchenSqft(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={addKitchenSqft}
                      >
                        Add kitchen
                      </button>
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="text-muted">Bathrooms (sq ft):</span>{" "}
                    {bathSqfts.map((sq, i) => (
                      <span key={i} className="badge bg-secondary me-1">
                        {sq}
                        <button
                          type="button"
                          className="btn btn-link btn-sm text-white p-0 ms-1"
                          aria-label="Remove"
                          onClick={() =>
                            setBathSqfts((s) => s.filter((_, j) => j !== i))
                          }
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <div className="d-flex gap-1 mt-1">
                      <input
                        className="form-control form-control-sm walker-admin-portal-input"
                        style={{ maxWidth: "100px" }}
                        inputMode="numeric"
                        placeholder="Sq ft"
                        value={newBathSqft}
                        onChange={(e) => setNewBathSqft(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={addBathSqft}
                      >
                        Add bath
                      </button>
                    </div>
                  </div>
                  <div className="row g-2 align-items-end mb-2">
                    <div className="col-auto">
                      <label className="form-label small mb-0 text-muted">
                        Interior walls
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        className="form-control form-control-sm walker-admin-portal-input"
                        style={{ width: "88px" }}
                        value={interiorWalls}
                        onChange={(e) =>
                          setInteriorWalls(
                            Math.max(0, parseInt(e.target.value, 10) || 0),
                          )
                        }
                      />
                    </div>
                    <div className="col-auto">
                      <label className="form-check-label small d-flex align-items-center gap-1">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={changingColors}
                          onChange={(e) => setChangingColors(e.target.checked)}
                        />
                        Color change
                      </label>
                    </div>
                    <div className="col-auto">
                      <label className="form-label small mb-0 text-muted">
                        Exterior sq ft
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={50000}
                        className="form-control form-control-sm walker-admin-portal-input"
                        style={{ width: "100px" }}
                        value={exteriorSqft}
                        onChange={(e) =>
                          setExteriorSqft(
                            Math.max(0, parseInt(e.target.value, 10) || 0),
                          )
                        }
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm walker-hero-btn-primary"
                    onClick={addFromCalculator}
                  >
                    Add lines from calculator
                  </button>
                </div>
              </details>
            </div>
          </div>

          <div className="walker-admin-portal-panel mb-4">
            <div className="walker-admin-portal-panel-header">Quick add</div>
            <div className="walker-admin-portal-panel-body">
              <input
                type="search"
                className="form-control form-control-sm walker-admin-portal-input mb-2"
                placeholder="Filter saved lines…"
                value={quickFilter}
                onChange={(e) => setQuickFilter(e.target.value)}
              />
              <div
                className="d-flex flex-column gap-1"
                style={{ maxHeight: "200px", overflowY: "auto" }}
              >
                {filteredQuick.length === 0 ? (
                  <span className="small walker-admin-portal-muted">
                    No saved lines yet. They appear after you send quotes or use
                    &quot;Save to quick add&quot; on a row.
                  </span>
                ) : (
                  filteredQuick.map((row) => (
                    <button
                      key={row.id}
                      type="button"
                      className="btn btn-sm btn-outline-secondary text-start"
                      onClick={() =>
                        setLines((prev) => [
                          ...prev,
                          {
                            id: crypto.randomUUID(),
                            description: row.label,
                            quantity: row.default_qty,
                            unitPrice: row.unit_price,
                          },
                        ])
                      }
                    >
                      {row.label}{" "}
                      <span className="text-muted">
                        ×{row.default_qty} @ ${money(row.unit_price)}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="walker-admin-portal-panel mb-4">
            <div className="walker-admin-portal-panel-header">Line items</div>
            <div className="walker-admin-portal-panel-body">
              <div className="d-flex gap-2 mb-3">
                <button
                  type="button"
                  className="btn btn-sm walker-hero-btn-primary"
                  onClick={addBlankLine}
                >
                  + Add line
                </button>
              </div>
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0 walker-admin-portal-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th className="text-end" style={{ width: "72px" }}>
                        Qty
                      </th>
                      <th className="text-end" style={{ width: "100px" }}>
                        Unit $
                      </th>
                      <th className="text-end" style={{ width: "100px" }}>
                        Line
                      </th>
                      <th style={{ width: "1%" }} />
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line) => {
                      const lineTotal = roundMoney(
                        line.quantity * line.unitPrice,
                      );
                      return (
                        <tr key={line.id}>
                          <td>
                            <input
                              className="form-control form-control-sm walker-admin-portal-input"
                              value={line.description}
                              onChange={(e) =>
                                updateLine(line.id, {
                                  description: e.target.value,
                                })
                              }
                              placeholder="Description"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              min={1}
                              className="form-control form-control-sm walker-admin-portal-input text-end"
                              value={line.quantity}
                              onChange={(e) =>
                                updateLine(line.id, {
                                  quantity: Math.max(
                                    1,
                                    parseInt(e.target.value, 10) || 1,
                                  ),
                                })
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              className="form-control form-control-sm walker-admin-portal-input text-end"
                              value={line.unitPrice}
                              onChange={(e) =>
                                updateLine(line.id, {
                                  unitPrice: Math.max(
                                    0,
                                    parseFloat(e.target.value) || 0,
                                  ),
                                })
                              }
                            />
                          </td>
                          <td className="text-end text-nowrap small">
                            ${money(lineTotal)}
                          </td>
                          <td className="text-nowrap">
                            <button
                              type="button"
                              className="btn btn-link btn-sm text-danger p-0 me-2"
                              title="Remove"
                              onClick={() => removeLine(line.id)}
                            >
                              <i className="ri-delete-bin-line" aria-hidden />
                            </button>
                            <button
                              type="button"
                              className="btn btn-link btn-sm p-0 walker-admin-portal-muted"
                              title="Save to quick add"
                              onClick={() => void saveLineToQuickAdd(line)}
                            >
                              <i className="ri-bookmark-line" aria-hidden />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="walker-admin-portal-panel mb-4">
            <div className="walker-admin-portal-panel-header">Totals</div>
            <div className="walker-admin-portal-panel-body">
              <div className="row g-2 mb-2">
                <div className="col-md-6">
                  <label className="form-label small walker-admin-portal-muted">
                    Discount %
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step="0.1"
                    className="form-control form-control-sm walker-admin-portal-input"
                    value={discountPercent}
                    onChange={(e) =>
                      setDiscountPercent(
                        Math.min(
                          100,
                          Math.max(0, parseFloat(e.target.value) || 0),
                        ),
                      )
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small walker-admin-portal-muted">
                    Tax %
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step="0.1"
                    className="form-control form-control-sm walker-admin-portal-input"
                    value={taxPercent}
                    onChange={(e) =>
                      setTaxPercent(
                        Math.min(
                          100,
                          Math.max(0, parseFloat(e.target.value) || 0),
                        ),
                      )
                    }
                  />
                </div>
              </div>
              {totals ? (
                <table className="table table-sm mb-0">
                  <tbody>
                    <tr>
                      <td>Subtotal</td>
                      <td className="text-end">${money(totals.subtotal)}</td>
                    </tr>
                    {discountPercent > 0 ? (
                      <tr>
                        <td>Discount</td>
                        <td className="text-end">
                          -${money(totals.discountAmount)}
                        </td>
                      </tr>
                    ) : null}
                    {taxPercent > 0 ? (
                      <tr>
                        <td>Tax</td>
                        <td className="text-end">${money(totals.taxAmount)}</td>
                      </tr>
                    ) : null}
                    <tr className="walker-admin-portal-total-row">
                      <td>
                        <strong>Grand total</strong>
                      </td>
                      <td className="text-end">
                        <strong>${money(totals.grandTotal)}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p className="small walker-admin-portal-muted mb-0">
                  Enter line descriptions to see totals.
                </p>
              )}
              <button
                type="button"
                className="btn walker-hero-btn-primary mt-3"
                disabled={sending || !totals || totals.grandTotal <= 0}
                onClick={() => void handleSend()}
              >
                {sending ? "Sending…" : "Send email with PDF"}
              </button>
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="walker-admin-portal-panel sticky-top" style={{ top: "1rem" }}>
            <div className="walker-admin-portal-panel-header">Preview</div>
            <div
              className="walker-admin-portal-panel-body walker-admin-portal-panel-body--flush p-0"
              style={{ minHeight: "560px", background: "#2b2b2b" }}
            >
              {previewData ? (
                <PDFViewer
                  width="100%"
                  height={560}
                  showToolbar
                  className="border-0"
                >
                  <EstimatePdfDocument data={previewData} />
                </PDFViewer>
              ) : (
                <div className="p-4 walker-admin-portal-muted small">
                  Add customer info and line items to preview the PDF.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
