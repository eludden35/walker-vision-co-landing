import type { Metadata } from "next";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import QuoteCalculator from "@/components/Quote/QuoteCalculator";

export const metadata: Metadata = {
  title: "Get a Quote | Walker Vision Co",
  description:
    "Get an instant estimate for your kitchen renovation, bathroom renovation, or painting project. Build your quote and send it directly to our team.",
};

export default function GetAQuotePage() {
  return (
    <>
      <Navbar />

      <div className="walker-page-header">
        <div className="container text-center">
          <h1 className="fw-bold mb-3">
            Instant Quote <span className="text_primary">Calculator</span>
          </h1>
          <p className="text-muted mx-auto" style={{ maxWidth: 560 }}>
            Select your services, adjust quantities, and get an immediate cost
            estimate. When you&apos;re ready, send the quote directly to our team.
          </p>
        </div>
      </div>

      <div className="pb-120">
        <QuoteCalculator />
      </div>

      <Footer />
    </>
  );
}
