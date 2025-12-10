"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const HeroBanner = () => {
  return (
    <div className="walker-hero-section position-relative">
      {/* Background Image with Overlay */}
      <div className="walker-hero-bg position-absolute w-100 h-100">
        <div className="walker-hero-overlay position-absolute w-100 h-100"></div>
        <Image
          src="/images/hero/hero-bg-1.jpg"
          alt="Luxury Kitchen Renovation"
          fill
          className="object-cover"
          priority
          style={{ opacity: 0.5 }}
        />
      </div>

      {/* Content */}
      <div className="container-fluid position-relative">
        <div className="row align-items-center">
          <div className="col-12">
            <div className="walker-hero-content text-center">
              <h6 className="walker-hero-subtitle mb-4">
                Design • Build • Renovate
              </h6>

              <h1 className="walker-hero-title mb-4">
                Elevating Homes with <br className="d-none d-md-block" />
                <span className="walker-hero-title-gradient">
                  Vision & Precision
                </span>
              </h1>

              <p className="walker-hero-description mx-auto mb-5">
                Walker Vision Co. specializes in high-end kitchen remodeling,
                flooring, and full-home transformations. We turn your concepts
                into structural reality.
              </p>

              <div className="d-flex flex-column flex-md-row gap-4 justify-content-center align-items-center">
                <Link href="/services" className="btn walker-hero-btn-primary">
                  <span className="d-flex align-items-center gap-2">
                    Start Your Project
                    <i className="ri-arrow-right-line"></i>
                  </span>
                </Link>

                <Link
                  href="/projects"
                  className="btn walker-hero-btn-secondary"
                >
                  View Our Work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
