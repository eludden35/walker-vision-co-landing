"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Dynamic projects data
const projectsData = [
  {
    id: 1,
    imageUrl: "/images/project/project-stock.jpg",
    title: "Apartment Building",
    location: "123 Maplewood Brookville, CA 90210, USA",
    link: "/projects/details/",
  },
  {
    id: 2,
    imageUrl: "/images/project/project-stock.jpg",
    title: "Vista at Councill Square",
    location: "56 Cedar Hill Drive, Ashton, USA",
    link: "/projects/details/",
  },
  {
    id: 3,
    imageUrl: "/images/project/project-stock.jpg",
    title: "Modern Office Complex",
    location: "789 Sunset Blvd, Los Angeles, CA 90028, USA",
    link: "/projects/details/",
  },
  {
    id: 4,
    imageUrl: "/images/project/project-stock.jpg",
    title: "Luxury Shopping Mall",
    location: "45 Grand Central Ave, New York, NY 10017, USA",
    link: "/projects/details/",
  },
  {
    id: 5,
    imageUrl: "/images/project/project-stock.jpg",
    title: "Eco-friendly Housing Estate",
    location: "210 Green Park Road, Austin, TX 73301, USA",
    link: "/projects/details/",
  },
];

const OurProjects = () => {
  return (
    <>
      <div className="container pt-120">
        <div className="row">
          <div className="col-xl-8 offset-xl-2 col-md-10 offset-md-1 text-center px-xxl-5">
            <h6 className="section-subtitle style-one d-inline-block fs-13 ls-1 font-optional fw-semibold position-relative text_primary mb-20">
              <Image
                src="/images/icons/star-3.svg"
                alt="Icon"
                width={17}
                height={16}
              />
              OUR PROJECTS
            </h6>
            {/* <h2 className="section-title style-one text-title px-xxl-5 mb-40">
              Basement To{" "}
              <span className="fw-black">Beautiful-Finished Basement</span>{" "}
              Project
            </h2> */}
          </div>
        </div>
      </div>

      <Swiper
        spaceBetween={25}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 1.1,
            spaceBetween: 25,
          },
          992: {
            slidesPerView: 1.4,
            spaceBetween: 25,
          },
          1200: {
            slidesPerView: 1.5,
            spaceBetween: 25,
          },
          1300: {
            slidesPerView: 1.9,
            spaceBetween: 25,
          },
          1400: {
            slidesPerView: 1.8,
            spaceBetween: 25,
          },
          1600: {
            slidesPerView: 2.2,
            spaceBetween: 30,
          },
          1920: {
            slidesPerView: 1.98,
            spaceBetween: 35,
          },
        }}
        modules={[Autoplay]}
        className="project-slider-one pb-120"
      >
        {projectsData.map((project, index) => (
          <SwiperSlide key={project.id}>
            <div className="project-card style-one d-flex flex-wrap align-items-center">
              <div className="project-img position-relative z-1 round-10">
                <div
                  className="position-relative project-image-wrapper"
                  style={{
                    width: "450px",
                    height: "500px",
                    display: "inline-block",
                  }}
                >
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    width={450}
                    height={500}
                    className="round-10"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <Link
                    href={project.link}
                    className="circle-text-wrap position-absolute d-flex flex-column align-items-center justify-content-center rounded-circle transition"
                    style={{
                      width: "168px",
                      height: "168px",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 1,
                    }}
                  >
                    <Image
                      src="/images/project/circle-text.png"
                      alt="Circle text"
                      width={168}
                      height={168}
                      className="d-block mx-auto rotate"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                    <Image
                      src="/images/icons/up-right-arrow-yellow.svg"
                      alt="Icon"
                      width={31}
                      height={31}
                      className="circle-text-icon position-absolute"
                    />
                  </Link>
                </div>
              </div>
              <div className="project-info">
                <span className="project-counter font-secondary fw-black d-block">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="fw-bold">
                  <Link
                    href={project.link}
                    className="text-title link-hover-primary transition"
                  >
                    {project.title}
                  </Link>
                </h3>
                <p className="position-relative mb-0">
                  <Image
                    src="/images/icons/pin-pink.svg"
                    alt="Icon"
                    width={17}
                    height={21}
                  />{" "}
                  {project.location}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default OurProjects;
