"use client";

import React, { useState } from "react";

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    honeypot: "",
  });
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const canSubmit =
    form.name.length >= 2 &&
    form.email.includes("@") &&
    form.subject.length >= 2 &&
    form.message.length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || status === "loading") return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="walker-contact-form-card">
        <div className="text-center p-5">
          <i className="ri-check-double-line fs-1 text-success"></i>
          <h4 className="fw-bold mt-3">Message Sent!</h4>
          <p className="text-muted mb-0">
            Thank you for reaching out. We&apos;ll get back to you shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="walker-contact-form-card">
      <h4 className="fw-bold mb-4">Send Us a Message</h4>
      <form onSubmit={handleSubmit}>
        {/* Honeypot */}
        <div className="walker-honeypot" aria-hidden="true">
          <input
            type="text"
            name="honeypot"
            value={form.honeypot}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              name="name"
              className="form-control walker-form-input"
              placeholder="Your Name *"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="email"
              name="email"
              className="form-control walker-form-input"
              placeholder="Email Address *"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="tel"
              name="phone"
              className="form-control walker-form-input"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              name="subject"
              className="form-control walker-form-input"
              placeholder="Subject *"
              value={form.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12">
            <textarea
              name="message"
              className="form-control walker-form-input"
              placeholder="Your Message *"
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {status === "error" && (
          <div className="alert alert-danger py-2 mt-3 mb-0">
            Something went wrong. Please call us at{" "}
            <a href="tel:+14058888888" className="fw-bold">+1 (405) 888-8888</a>.
          </div>
        )}

        <button
          type="submit"
          className="btn walker-cta-btn mt-4"
          disabled={!canSubmit || status === "loading"}
        >
          <span className="btn-text">
            {status === "loading" ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </span>
        </button>
      </form>
    </div>
  );
}
