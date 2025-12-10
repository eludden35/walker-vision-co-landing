import React from "react";
import Image from "next/image";
import Link from "next/link";

const WhatWeOffers = () => {
  // Dynamic data for service cards
  const serviceData = [
    {
      id: 1,
      counter: "01",
      title: "Kitchen Renovation",
      description: "Renovation is one of the most the heart of your home.",
      icon: "/images/services/kitchen-renovation-service.png",
      link: "/services/details/",
    },
    {
      id: 2,
      counter: "02",
      title: "Full-Home Makeovers",
      description: "Renovation is one of the most the heart of your home.",
      icon: "/images/services/full-home-renovation-service.png",
      link: "/services/details/",
    },
    {
      id: 3,
      counter: "03",
      title: "Flooring & Painting",
      description: "Renovation is one of the most the heart of your home.",
      icon: "/images/services/flooring-renovation-service.png",
      link: "/services/details/",
    },
    {
      id: 4,
      counter: "04",
      title: "Deck Renovation",
      description: "Renovation is one of the most the heart of your home.",
      icon: "/images/services/deck-renovation-service.png",
      link: "/services/details/",
    },
  ];

  return (
    <>
      <div className="service-area style-one position-relative z-2 pt-120 pb-90 mx-xxl-4 round-40">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 offset-xl-2 col-md-10 offset-md-1 text-center px-xxl-5">
              <h6 className="section-subtitle style-one d-inline-block fs-13 ls-1 font-optional fw-semibold position-relative text_primary mb-20">
                <Image
                  src="/images/icons/star-3.svg"
                  alt="Icon"
                  width={17}
                  height={16}
                />
                WHAT WE OFFER
              </h6>
              <h2 className="section-title style-one text-title px-xxl-5 mb-40">
                Take A Brief{" "}
                <span className="fw-black">Look At Some Of The Services</span>{" "}
                We Offer
              </h2>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className="row justify-content-center">
            {serviceData.map((service) => (
              <div key={service.id} className="col-xxl-3 col-xl-4 col-md-6">
                <div className="service-card style-one bg-white round-10 mb-30 transition">
                  <span className="service-counter fw-semibold d-block transition">
                    {service.counter}
                  </span>
                  <h3 className="fw-semibold">
                    <Link
                      href={service.link}
                      className="text-title link-hover-primary transition"
                    >
                      {service.title}
                    </Link>
                  </h3>
                  <Image
                    src={service.icon}
                    alt={service.title}
                    width={170}
                    height={170}
                    className="service-icon d-block"
                  />
                  <div className="service-para d-flex flex-wrap align-items-center justify-content-between">
                    <p className="mb-0">{service.description}</p>
                    <Link
                      href={service.link}
                      className="service-link d-flex flex-column align-items-center justify-content-center rounded-circle"
                    >
                      <Image
                        src="/images/icons/up-right-arrow-orange.svg"
                        alt="Icon"
                        width={16}
                        height={16}
                        className="transition"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center mt-xl-4">
            Discover top-tier real estate development services{" "}
            <Link href="/services" className="link style-one fw-semibold">
              View All Categories{" "}
              <Image
                src="/images/icons/right-arrow-long.svg"
                alt="Icon"
                width={21}
                height={16}
              />
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default WhatWeOffers;
