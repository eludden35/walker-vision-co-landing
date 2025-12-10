import React from "react";
import Image from "next/image";
import Link from "next/link";

// SVG Icon Components
const Icon8PointStar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#af9e6d"
    width={28}
    height={28}
  >
    <polygon points="12 2 14.7 7.3 19.1 4.9 16.7 10.1 22 12 16.7 13.9 19.1 19.1 14.7 16.7 12 22 9.3 16.7 4.9 19.1 7.3 13.9 2 12 7.3 10.1 4.9 4.9 9.3 7.3" />
  </svg>
);

const Icon4PointStar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#af9e6d"
    width={28}
    height={28}
  >
    <polygon points="12 2 14.5 9.5 22 12 14.5 14.5 12 22 9.5 14.5 2 12 9.5 9.5" />
  </svg>
);

const IconQuatrefoil = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#af9e6d"
    width={28}
    height={28}
  >
    <path d="M12 2C14.76 2 17 4.24 17 7C17 9.76 14.76 12 12 12C9.24 12 7 9.76 7 7C7 4.24 9.24 2 12 2ZM17 7C19.76 7 22 9.24 22 12C22 14.76 19.76 17 17 17C14.76 17 12.5 14.76 12.5 12C12.5 9.24 14.76 7 17 7ZM12 12C14.76 12 17 14.24 17 17C17 19.76 14.76 22 12 22C9.24 22 7 19.76 7 17C7 14.24 9.24 12 12 12ZM7 7C9.76 7 12 9.24 12 12C12 14.76 9.76 17 7 17C4.24 17 2 14.76 2 12C2 9.24 4.24 7 7 7Z" />
  </svg>
);

const IconAsterisk = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#af9e6d"
    strokeWidth="2"
    strokeLinecap="round"
    width={28}
    height={28}
  >
    <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M4.9 19.1L19.1 4.9" />
  </svg>
);

// Configuration data
const commitmentData = {
  subtitle: {
    icon: "/images/icons/star-5.svg",
    text: "OUR COMMITMENT",
  },
  title: {
    main: "Built To Last – Reliable",
    highlighted: "Renovation With Professional",
    suffix: "Pride Guaranteed",
  },
  description:
    "At Walker Vision Co, our commitment goes beyond construction — it's about trust, transparency, and delivering exceptional results.",
  features: [
    {
      icon: Icon8PointStar,
      title: "Corporate Responsibility",
    },
    {
      icon: Icon4PointStar,
      title: "Experts With Team Spirit",
    },
    {
      icon: IconQuatrefoil,
      title: "Diversity, Equity & Inclusion",
    },
    {
      icon: IconAsterisk,
      title: "Trusted & Transparent",
    },
  ],
  button: {
    text: "More About Us",
    url: "/about-us/",
  },
};

const OurCommitment = () => {
  const { subtitle, title, description, features, button } = commitmentData;

  return (
    <>
      <div className="wh-area style-one position-relative z-1 ptb-120">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-md-30">
              <div className="wh-content">
                {/* SEMANTIC FIX: Changed h6 to p. Subtitles are not headings. */}
                <p className="section-subtitle style-one d-inline-flex align-items-center fs-13 ls-1 font-optional fw-semibold position-relative text_secondary mb-20 gap-2">
                  <Image
                    src={subtitle.icon}
                    alt="" // ACCESSIBILITY: Empty alt for decorative icon
                    width={17}
                    height={17}
                  />
                  {subtitle.text}
                </p>

                <h2 className="section-title style-one text-white mb-12">
                  {title.main}{" "}
                  <span className="fw-black">{title.highlighted}</span>{" "}
                  {title.suffix}
                </h2>

                <p className="pe-xxl-5 me-xxl-5 mb-25 text-white">
                  {description}
                </p>

                {/* Features Grid */}
                <div className="row gx-md-5 pe-xxl-5 me-xxl-4">
                  {features.map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <div className="col-md-6" key={index}>
                        <div className="feature-item d-flex flex-wrap align-items-center mb-35 gap-3">
                          <IconComponent />
                          <h3 className="fs-18 fw-semibold text-alto mb-0">
                            {feature.title}
                          </h3>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Button */}
                <Link
                  href={button.url}
                  className="btn style-one d-inline-flex align-items-center p-0 mt-4 group"
                >
                  <span className="btn-text fw-semibold position-relative transition me-3 text-white">
                    {button.text}
                  </span>
                  <span className="btn-icon position-relative d-flex align-items-center justify-content-center rounded-circle transition bg-primary">
                    <i className="ri-arrow-right-up-line"></i>
                  </span>
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="wh-img-wrap position-relative z-1">
                <Image
                  src="/images/about/devon-tower.png"
                  alt="Devon Tower - Walker Vision Co project"
                  width={412}
                  height={473}
                  className="wh-img d-block mx-auto round-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurCommitment;
