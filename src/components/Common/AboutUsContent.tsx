import React from "react";
import Image from "next/image";
import Link from "next/link";

const AboutUsContent = () => {
  // Guarantee cards data (replacing counters)
  const guaranteeData = [
    {
      id: 1,
      title: "QUALITY",
      value: "100%",
      description: "Commitment to Craftsmanship",
      bgClass: "bg-1",
    },
    {
      id: 2,
      title: "TRANSPARENCY",
      value: "$0",
      description: "Hidden Fees or Surprises",
      bgClass: "bg-2",
    },
    {
      id: 3,
      title: "SERVICE",
      value: "24H",
      description: "Response Time Guarantee",
      bgClass: "bg-3",
    },
  ];

  return (
    <>
      <div className="about-area style-one pb-120">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-5 col-lg-6">
              <div className="about-img-wrap position-relative pe-xxl-4 mb-md-30">
                <Image
                  src="/images/about/altered-crane.png"
                  alt="about"
                  width={890}
                  height={1036}
                  className="about-img round-30 tilt-img"
                />
              </div>
            </div>
            <div className="col-xl-7 col-lg-6 ps-xxl-4">
              <div className="about-content">
                <h6 className="section-subtitle style-one d-inline-block fs-13 ls-1 font-optional fw-semibold position-relative text_primary mb-20">
                  <Image
                    src="/images/icons/star-3.svg"
                    alt="Icon"
                    width={17}
                    height={16}
                  />
                  WHO WE ARE
                </h6>
                <div className="about-subcontent">
                  <h2 className="section-title style-one text-title mb-4">
                    Built on Precision.{" "}
                    <span className="fw-black">
                      Defined by <span className="text_primary">Vision.</span>
                    </span>
                  </h2>
                  <p className="pe-xxl-5 mb-3">
                    At <strong className="text-title">Walker Vision Co.</strong>
                    , we are defining the new standard for home renovation. We
                    believe that modern craftsmanship requires more than just
                    tools—it requires a vision.
                  </p>
                  <p className="pe-xxl-5 mb-4">
                    We founded this company to bridge the gap between reliable
                    construction and high-end design. Whether you are updating a
                    kitchen or reimagining your entire home, we bring a fresh
                    perspective, unwavering attention to detail, and a
                    contemporary approach to every project. We don&apos;t just build;
                    we bring your vision to life.
                  </p>

                  <Link
                    href="/about-us/"
                    className="link style-one fw-semibold d-inline-block mb-4"
                  >
                    Read Our Story{" "}
                    <Image
                      src="/images/icons/right-arrow-long.svg"
                      alt="Icon"
                      width={21}
                      height={16}
                      className="d-inline-block"
                    />
                  </Link>

                  <div className="row justify-content-center mt-4">
                    {guaranteeData.map((guarantee) => (
                      <div
                        key={guarantee.id}
                        className="col-xl-4 col-lg-6 col-md-6"
                      >
                        <div
                          className={`counter-card style-one ${guarantee.bgClass} position-relative z-1 round-10`}
                        >
                          <Image
                            src="/images/about/star-group.png"
                            alt="Icon"
                            width={141}
                            height={36}
                            className="position-absolute card-shape z-1"
                          />
                          <h6 className="fs-12 font-primary fw-semibold text-title ls-1">
                            {guarantee.title}
                          </h6>
                          <h4 className="font-secondary fw-black fs-36 text_primary ls-1">
                            {guarantee.value}
                          </h4>
                          <p className="fw-medium d-block mb-0">
                            {guarantee.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUsContent;
