"use client";

import React, { useReducer, useState, useMemo } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import {
  PAINTING_PRICING,
  calculateTotal,
  buildLineItems,
  resolveKitchenTier,
  resolveBathroomTier,
  resolveExteriorPrice,
  type Selections,
  type PricingTier,
} from "@/lib/pricing";

type Action =
  | { type: "ADD_KITCHEN" }
  | { type: "UPDATE_KITCHEN"; index: number; sqft: number }
  | { type: "REMOVE_KITCHEN"; index: number }
  | { type: "ADD_BATHROOM" }
  | { type: "UPDATE_BATHROOM"; index: number; sqft: number }
  | { type: "REMOVE_BATHROOM"; index: number }
  | { type: "SET_INTERIOR_WALLS"; count: number }
  | { type: "SET_COLOR_CHANGE"; value: boolean }
  | { type: "SET_EXTERIOR_SQFT"; sqft: number }
  | { type: "RESET" };

const initialSelections: Selections = {
  kitchens: [0],
  bathrooms: [],
  painting: { interiorWalls: 0, changingColors: false, exteriorSqft: 0 },
};

function selectionsReducer(state: Selections, action: Action): Selections {
  switch (action.type) {
    case "ADD_KITCHEN":
      return { ...state, kitchens: [...state.kitchens, 0] };
    case "UPDATE_KITCHEN": {
      const kitchens = [...state.kitchens];
      kitchens[action.index] = Math.max(0, action.sqft);
      return { ...state, kitchens };
    }
    case "REMOVE_KITCHEN":
      return { ...state, kitchens: state.kitchens.filter((_, i) => i !== action.index) };
    case "ADD_BATHROOM":
      return { ...state, bathrooms: [...state.bathrooms, 0] };
    case "UPDATE_BATHROOM": {
      const bathrooms = [...state.bathrooms];
      bathrooms[action.index] = Math.max(0, action.sqft);
      return { ...state, bathrooms };
    }
    case "REMOVE_BATHROOM":
      return { ...state, bathrooms: state.bathrooms.filter((_, i) => i !== action.index) };
    case "SET_INTERIOR_WALLS":
      return { ...state, painting: { ...state.painting, interiorWalls: Math.max(0, Math.min(100, action.count)) } };
    case "SET_COLOR_CHANGE":
      return { ...state, painting: { ...state.painting, changingColors: action.value } };
    case "SET_EXTERIOR_SQFT":
      return { ...state, painting: { ...state.painting, exteriorSqft: Math.max(0, action.sqft) } };
    case "RESET":
      return initialSelections;
    default:
      return state;
  }
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function QuoteCalculator() {
  const [selections, dispatch] = useReducer(selectionsReducer, initialSelections);
  const [openSections, setOpenSections] = useState({ kitchen: true, bathroom: false, painting: false });
  const [showDrawer, setShowDrawer] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    honeypot: "",
  });

  const total = useMemo(() => calculateTotal(selections), [selections]);
  const lineItems = useMemo(() => buildLineItems(selections), [selections]);

  const toggleSection = (section: "kitchen" | "bathroom" | "painting") => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContact((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const canSubmit = total > 0 && contact.name.length >= 2 && contact.email.includes("@") && contact.phone.length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitStatus === "loading") return;

    setSubmitStatus("loading");
    try {
      const res = await fetch("/api/send-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, selections }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
    }
  };

  const exteriorResolved = resolveExteriorPrice(selections.painting.exteriorSqft);

  const summaryAndForm = (
    <div className="walker-quote-sidebar-inner">
      <div className="walker-quote-summary-box">
        <h5 className="fw-bold mb-3">Your Quote Summary</h5>
        {lineItems.length === 0 ? (
          <p className="text-muted mb-0">Enter square footage above to build your quote.</p>
        ) : (
          <>
            {lineItems.map((item, i) => (
              <div key={i} className="d-flex justify-content-between mb-2">
                <span>{item.label}</span>
                <span className="fw-semibold">${item.amount.toLocaleString()}</span>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between">
              <span className="fw-bold fs-5">Estimated Total:</span>
              <span className="fw-bold fs-5 text_primary">${total.toLocaleString()}</span>
            </div>
          </>
        )}
      </div>

      {submitStatus === "success" ? (
        <div className="walker-quote-success mt-4">
          <div className="text-center p-4">
            <i className="ri-check-double-line fs-1 text-success"></i>
            <h5 className="fw-bold mt-2">Quote Sent!</h5>
            <p className="mb-0">Check your inbox for a confirmation copy.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="walker-quote-form mt-4">
          <h5 className="fw-bold mb-3">Send Your Quote</h5>

          <div className="walker-honeypot" aria-hidden="true">
            <input
              type="text"
              name="honeypot"
              value={contact.honeypot}
              onChange={handleContactChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="mb-3">
            <input type="text" name="name" className="form-control walker-form-input" placeholder="Full Name *" value={contact.name} onChange={handleContactChange} required />
          </div>
          <div className="mb-3">
            <input type="email" name="email" className="form-control walker-form-input" placeholder="Email Address *" value={contact.email} onChange={handleContactChange} required />
          </div>
          <div className="mb-3">
            <input type="tel" name="phone" className="form-control walker-form-input" placeholder="Phone Number *" value={contact.phone} onChange={handleContactChange} required />
          </div>
          <div className="mb-3">
            <input type="text" name="address" className="form-control walker-form-input" placeholder="Project Address (optional)" value={contact.address} onChange={handleContactChange} />
          </div>
          <div className="mb-3">
            <textarea name="notes" className="form-control walker-form-input" placeholder="Additional Notes (optional)" rows={3} value={contact.notes} onChange={handleContactChange} />
          </div>

          {submitStatus === "error" && (
            <div className="alert alert-danger py-2 mb-3">
              Something went wrong. Please call us at{" "}
              <a href="tel:+14058888888" className="fw-bold">+1 (405) 888-8888</a>.
            </div>
          )}

          <button type="submit" className="btn walker-cta-btn w-100" disabled={!canSubmit || submitStatus === "loading"}>
            <span className="btn-text">
              {submitStatus === "loading" ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Sending...
                </>
              ) : (
                "Submit Your Quote"
              )}
            </span>
          </button>

          {total === 0 && (
            <p className="text-muted text-center mt-2 mb-0" style={{ fontSize: "0.85rem" }}>
              Enter square footage to get started
            </p>
          )}
        </form>
      )}
    </div>
  );

  return (
    <>
      <div className="container walker-quote-calculator">
        <div className="row">
          {/* Left Column: Calculator */}
          <div className="col-lg-7">
            {/* Kitchen Section */}
            <div className="walker-quote-section mb-4">
              <button type="button" className="walker-quote-section-header" onClick={() => toggleSection("kitchen")}>
                <h4 className="mb-0 fw-bold">
                  <i className="ri-knife-line me-2"></i>Kitchen Renovation
                </h4>
                <i className={`ri-${openSections.kitchen ? "subtract" : "add"}-line fs-5`}></i>
              </button>
              {openSections.kitchen && (
                <div className="walker-quote-section-body">
                  {selections.kitchens.map((sqft, index) => {
                    const resolved = resolveKitchenTier(sqft);
                    return (
                      <SqftEntry
                        key={index}
                        index={index}
                        total={selections.kitchens.length}
                        label="kitchen"
                        sqft={sqft}
                        resolved={resolved?.tier ?? null}
                        onChange={(val) => dispatch({ type: "UPDATE_KITCHEN", index, sqft: val })}
                        onRemove={() => dispatch({ type: "REMOVE_KITCHEN", index })}
                        canRemove={selections.kitchens.length > 1 || sqft > 0}
                      />
                    );
                  })}
                  <button
                    type="button"
                    className="btn walker-add-btn mt-3"
                    onClick={() => dispatch({ type: "ADD_KITCHEN" })}
                  >
                    <i className="ri-add-line me-1"></i> Add Another Kitchen
                  </button>
                </div>
              )}
            </div>

            {/* Bathroom Section */}
            <div className="walker-quote-section mb-4">
              <button type="button" className="walker-quote-section-header" onClick={() => toggleSection("bathroom")}>
                <h4 className="mb-0 fw-bold">
                  <i className="ri-drop-line me-2"></i>Bathroom Renovation
                </h4>
                <i className={`ri-${openSections.bathroom ? "subtract" : "add"}-line fs-5`}></i>
              </button>
              {openSections.bathroom && (
                <div className="walker-quote-section-body">
                  {selections.bathrooms.length === 0 ? (
                    <p className="text-muted mb-0">No bathrooms added yet.</p>
                  ) : (
                    selections.bathrooms.map((sqft, index) => {
                      const resolved = resolveBathroomTier(sqft);
                      return (
                        <SqftEntry
                          key={index}
                          index={index}
                          total={selections.bathrooms.length}
                          label="bathroom"
                          sqft={sqft}
                          resolved={resolved?.tier ?? null}
                          onChange={(val) => dispatch({ type: "UPDATE_BATHROOM", index, sqft: val })}
                          onRemove={() => dispatch({ type: "REMOVE_BATHROOM", index })}
                          canRemove={true}
                        />
                      );
                    })
                  )}
                  <button
                    type="button"
                    className="btn walker-add-btn mt-3"
                    onClick={() => dispatch({ type: "ADD_BATHROOM" })}
                  >
                    <i className="ri-add-line me-1"></i> Add {selections.bathrooms.length > 0 ? "Another " : "a "}Bathroom
                  </button>
                </div>
              )}
            </div>

            {/* Painting Section */}
            <div className="walker-quote-section mb-4">
              <button type="button" className="walker-quote-section-header" onClick={() => toggleSection("painting")}>
                <h4 className="mb-0 fw-bold">
                  <i className="ri-paint-brush-line me-2"></i>Painting
                </h4>
                <i className={`ri-${openSections.painting ? "subtract" : "add"}-line fs-5`}></i>
              </button>
              {openSections.painting && (
                <div className="walker-quote-section-body">
                  {/* Interior */}
                  <h6 className="fw-bold mb-3">Interior Painting</h6>
                  <div className="walker-paint-card mb-4">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Number of walls</label>
                      <input
                        type="number"
                        className="form-control walker-form-input"
                        style={{ maxWidth: 140 }}
                        min={0}
                        max={100}
                        value={selections.painting.interiorWalls || ""}
                        onChange={(e) => dispatch({ type: "SET_INTERIOR_WALLS", count: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="colorChange"
                        checked={selections.painting.changingColors}
                        onChange={(e) => dispatch({ type: "SET_COLOR_CHANGE", value: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="colorChange">
                        Changing colors? <span className="text-muted">($125/wall instead of $100/wall)</span>
                      </label>
                    </div>
                    {selections.painting.interiorWalls > 0 && (
                      <div className="mt-2 text-end">
                        <span className="fw-semibold text_primary">
                          Subtotal: $
                          {(
                            (selections.painting.changingColors
                              ? PAINTING_PRICING.interiorColorChangePerWall
                              : PAINTING_PRICING.interiorPerWall) * selections.painting.interiorWalls
                          ).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Exterior */}
                  <h6 className="fw-bold mb-3">Exterior Painting</h6>
                  <div className="walker-sqft-entry">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <label className="form-label fw-semibold mb-0">Enter your home size (sq ft):</label>
                      <input
                        type="number"
                        className="form-control walker-form-input"
                        style={{ maxWidth: 160 }}
                        min={0}
                        max={50000}
                        value={selections.painting.exteriorSqft || ""}
                        placeholder="e.g. 2200"
                        onChange={(e) => dispatch({ type: "SET_EXTERIOR_SQFT", sqft: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    {exteriorResolved && (
                      <div className="walker-result-badge">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <i className="ri-arrow-right-line me-1 text_primary"></i>
                            <span className="fw-semibold">{exteriorResolved.label}</span>
                          </div>
                          <span className="fw-bold text_primary">${exteriorResolved.price.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Sidebar (desktop only) */}
          <div className="col-lg-5 d-none d-lg-block">
            <div className="walker-quote-sidebar">
              {summaryAndForm}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="walker-quote-bottom-bar d-lg-none">
        <div className="container d-flex align-items-center justify-content-between">
          <div>
            <span className="text-muted">Total: </span>
            <span className="fw-bold fs-5 text_primary">${total.toLocaleString()}</span>
          </div>
          <button type="button" className="btn walker-cta-btn" onClick={() => setShowDrawer(true)}>
            <span className="btn-text">Review &amp; Submit</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Offcanvas show={showDrawer} onHide={() => setShowDrawer(false)} placement="bottom" className="walker-quote-drawer">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold">Your Quote Summary</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {summaryAndForm}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

/* Reusable sq ft entry with resolved tier badge */
function SqftEntry({
  index,
  total,
  label,
  sqft,
  resolved,
  onChange,
  onRemove,
  canRemove,
}: {
  index: number;
  total: number;
  label: string;
  sqft: number;
  resolved: PricingTier | null;
  onChange: (sqft: number) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const displayLabel = label.charAt(0).toUpperCase() + label.slice(1);

  return (
    <div className="walker-sqft-entry mb-3">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <label className="form-label fw-semibold mb-0">
          {total > 1 ? `${displayLabel} #${index + 1}` : displayLabel} — size (sq ft):
        </label>
        <div className="d-flex align-items-center gap-2">
          <input
            type="number"
            className="form-control walker-form-input walker-sqft-input"
            min={0}
            max={10000}
            value={sqft || ""}
            placeholder="e.g. 180"
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          />
          {canRemove && (
            <button type="button" className="btn walker-remove-btn" onClick={onRemove} title="Remove">
              <i className="ri-close-line"></i>
            </button>
          )}
        </div>
      </div>
      {resolved && (
        <div className="walker-result-badge">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div>
                <i className="ri-arrow-right-line me-1 text_primary"></i>
                <span className="fw-semibold">{resolved.label}</span>
              </div>
              <small className="text-muted ms-4">{resolved.tip}</small>
            </div>
            <span className="fw-bold text_primary fs-5">${resolved.price.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
