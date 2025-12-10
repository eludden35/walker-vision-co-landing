"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

// Dynamic testimonials data
const testimonialsData = [
  {
    id: 1,
    quote:
      "From the first consultation to the final reveal, Walker Vision Co made our exciting. They truly listened to our ideas and brought them to life with incredible attention to detail.",
    author: "Ramu Biharilal",
    title: "Manager",
    titleDisplay: "block", // Different display style for first testimonial
  },
  {
    id: 2,
    quote:
      "They truly listened to our ideas and brought them to life with incredible attention to detail.From the first consultation to the final reveal, Walker Vision Co made our exciting.",
    author: "Jhon Richards",
    title: "Entreprenuer",
    titleDisplay: "inline",
  },
  {
    id: 3,
    quote:
      "Awosome services from first consultation to the final reveal, Walker Vision Co made us amazed. They truly listened to our ideas and brought them live with incredible attention to detail.",
    author: "Emily Watson",
    title: "Teacher",
    titleDisplay: "inline",
  },
];

const Testimonials = () => {
  return (
    <>
      <div className="container pb-120">
        <div className="row">
          <div className="col-xxl-7 col-lg-7 order-xl-1 order-lg-1 order-2 pe-xl-2">
            <Swiper
              navigation={true}
              autoHeight={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              modules={[Navigation, Autoplay]}
              className="testimonial-slider-one style-two position-relative z-1 pt-1"
            >
              {testimonialsData.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="testimonial-card style-two">
                    <span className="quote-icon bg_secondary d-flex flex-wrap align-items-center justify-content-center rounded-circle">
                      <Image
                        src="/images/icons/quote-large.svg"
                        alt="Icon"
                        width={38}
                        height={34}
                      />
                    </span>
                    <p className="fw-medium text-title">
                      <q>{testimonial.quote}</q>
                    </p>
                    <h6 className="fs-20 font-primary fw-semibold position-relative text-title mb-0">
                      {testimonial.author}
                      <span
                        className={`fs-15 fw-normal text-para ${
                          testimonial.titleDisplay === "block"
                            ? "d-block mt-2"
                            : "ms-2"
                        }`}
                      >
                        {testimonial.title}
                      </span>
                    </h6>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="col-xxl-5 col-lg-5 order-xl-2 order-lg-2 order-1 ps-xxl-5 mb-md-30">
            <h6 className="section-subtitle style-one fs-13 ls-1 font-optional fw-semibold position-relative text_primary mb-16">
              <Image
                src="/images/icons/star-3.svg"
                alt="Icon"
                width={17}
                height={16}
              />
              TESTIMONIALS
            </h6>
            <h2 className="section-title style-one fw-normal text-title mb-35">
              Reliable,{" "}
              <span className="fw-black">
                Professional, And Truly Cared About
              </span>{" "}
              Every Detail
            </h2>

            <div className="testimonial-bg-wrap d-flex flex-wrap align-items-end justify-content-between">
              <div className="testimonial-bg round-10">
                <Image
                  src="/images/clients/testimonial-bg.jpg"
                  alt="testimonial"
                  width={302}
                  height={160}
                  className="round-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Testimonials;
