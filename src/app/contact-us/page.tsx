import type { Metadata } from "next";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import ContactForm from "@/components/Quote/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Walker Vision Co",
  description:
    "Get in touch with Walker Vision Co. Reach out for questions, consultations, or to start your next renovation project.",
};

export default function ContactUsPage() {
  return (
    <>
      <Navbar />

      <div className="walker-page-header">
        <div className="container text-center">
          <h1 className="fw-bold mb-3">
            Get In <span className="text_primary">Touch</span>
          </h1>
          <p className="text-muted mx-auto" style={{ maxWidth: 560 }}>
            We&apos;d love to hear from you. Reach out anytime for questions,
            consultations, or to start your next project.
          </p>
        </div>
      </div>

      <div className="container pb-120">
        <div className="row g-4">
          {/* Left: Contact Info */}
          <div className="col-lg-5">
            <div className="walker-contact-info-card">
              <h4 className="fw-bold mb-4">Contact Information</h4>

              <div className="d-flex align-items-start mb-4">
                <div className="walker-contact-icon me-3">
                  <i className="ri-map-pin-2-fill"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Address</h6>
                  <p className="text-muted mb-0">123 Main St, Anytown, USA</p>
                </div>
              </div>

              <div className="d-flex align-items-start mb-4">
                <div className="walker-contact-icon me-3">
                  <i className="ri-mail-fill"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Email</h6>
                  <a href="mailto:hello@walkervisionco.com" className="walker-contact-link">
                    hello@walkervisionco.com
                  </a>
                </div>
              </div>

              <div className="d-flex align-items-start mb-4">
                <div className="walker-contact-icon me-3">
                  <i className="ri-phone-fill"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Phone</h6>
                  <a href="tel:+14058888888" className="walker-contact-link">
                    +1 (405) 888-8888
                  </a>
                </div>
              </div>

              <hr />

              <h6 className="fw-bold mb-3">Follow Us</h6>
              <div className="d-flex gap-2">
                <a href="https://www.facebook.com/walker_vision_co" target="_blank" rel="noopener noreferrer" className="walker-social-icon">
                  <i className="ri-facebook-fill"></i>
                </a>
                <a href="https://x.com/walker_vision_co" target="_blank" rel="noopener noreferrer" className="walker-social-icon">
                  <i className="ri-twitter-x-line"></i>
                </a>
                <a href="https://www.instagram.com/walker_vision_co/" target="_blank" rel="noopener noreferrer" className="walker-social-icon">
                  <i className="ri-instagram-line"></i>
                </a>
                <a href="https://www.linkedin.com/company/walker-vision-co/" target="_blank" rel="noopener noreferrer" className="walker-social-icon">
                  <i className="ri-linkedin-fill"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="col-lg-7">
            <ContactForm />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
