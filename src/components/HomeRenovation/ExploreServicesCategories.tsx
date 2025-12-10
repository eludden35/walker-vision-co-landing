import React from "react";
import Image from "next/image";
import Link from "next/link";

const ExploreServicesCategories = () => {
  // Dynamic data for service categories
  const serviceCategories = [
    {
      id: 1,
      iconSrc: "/images/icons/kitchen.svg",
      title: "Kitchen Renovation",
    },
    {
      id: 2,
      iconSrc: "/images/icons/bathroom.svg",
      title: "Bathroom Remodeling",
    },
    {
      id: 3,
      iconSrc: "/images/icons/home-renovation.svg",
      title: "Whole-Home Renovation",
    },
    {
      id: 4,
      iconSrc: "/images/icons/outdoor-project.svg",
      title: "Outdoor & Deck Projects",
    },
    {
      id: 5,
      iconSrc: "/images/icons/interior.svg",
      title: "Interior Design & Decor",
    },
    {
      id: 6,
      iconSrc: "/images/icons/painting.svg",
      title: "Painting & Finishes",
    },
  ];

  return (
    <>
      <div className="container pt-120 pb-90">
        <div className="row">
          <div className="col-xl-8 offset-xl-2 col-md-10 offset-md-1 text-center">
            <h6 className="section-subtitle style-two d-inline-block fs-13 ls-1 font-optional fw-semibold position-relative text_primary mb-25">
              <Image
                src="/images/icons/star-3.svg"
                alt="Icon"
                width={17}
                height={16}
              />
              EXPLORE CATEGORIES
            </h6>
            <h2 className="section-title style-one text-center text-title px-xxl-5 mb-40">
              Full-Home{" "}
              <span className="fw-black">
                Makeovers That Completely Reimagine
              </span>{" "}
              Your Living Space
            </h2>
          </div>
        </div>

        <div className="row justify-content-center">
          {serviceCategories.map((category, index) => (
            <div key={index} className="col-xxl-2 col-xl-3 col-md-4 col-sm-6">
              <div className="category-card style-one position-relative z-1 text-center round-20 mb-30 transition">
                <span className="category-icon bg-white d-flex flex-column align-items-center justify-content-center rounded-circle transition">
                  <Image
                    src={category.iconSrc}
                    alt={category.title}
                    width={40}
                    height={40}
                    className="transition"
                  />
                </span>
                <h6 className="fs-18 fw-semibold mb-0">{category.title}</h6>
                <Link
                  href="/services"
                  className="position-absolute top-0 start-0 w-100 h-100"
                ></Link>
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
              width={20}
              height={10}
            />
          </Link>
        </p>
      </div>
    </>
  );
};

export default ExploreServicesCategories;
