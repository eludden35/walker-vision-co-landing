import React from "react";
import Link from "next/link";

// Dynamic footer data
const footerData = {
  sections: [
    {
      title: "Quick Links",
      menuItems: [
        { text: "Service", url: "/services" },
        { text: "Pricing", url: "/pricing-plan" },
        { text: "Projects", url: "/projects" },
        { text: "Team", url: "/team" },
        { text: "About", url: "/about-us" },
      ],
    },
    {
      title: "Explore",
      menuItems: [
        { text: "Privacy Policy", url: "/privacy-policy" },
        { text: "Terms of Service", url: "/terms-conditions" },
        { text: "FAQ", url: "/faq" },
        { text: "Careers", url: "/careers" },
        { text: "Contact Us", url: "/contact-us" },
      ],
    },
    {
      title: "Company",
      menuItems: [
        { text: "Location", url: "/location" },
        { text: "Works", url: "/projects" },
        { text: "Studio", url: "/projects" },
        { text: "News", url: "/blogs" },
        { text: "Categories", url: "/properties" },
      ],
    },
    {
      title: "Address",
      contactInfo: [
        {
          label: "Address:",
          value: "952 Bad Hill St, Asheville, NC 28, USA",
          type: "text",
        },
        {
          label: "Email:",
          value: "hello@edifico.com",
          type: "email",
        },
        {
          label: "Phone:",
          value: "+96 76867 8869",
          type: "tel",
        },
      ],
    },
  ],
  socialLinks: [
    {
      icon: "ri-facebook-fill",
      url: "https://www.facebook.com/",
    },
    {
      icon: "ri-twitter-x-line",
      url: "https://x.com/?lang=en",
    },
    {
      icon: "ri-instagram-line",
      url: "https://www.instagram.com/",
    },
    {
      icon: "ri-linkedin-fill",
      url: "https://www.linkedin.com/",
    },
  ],
  copyright: {
    text: "is Proudly Owned by",
    owner: "EnvyTheme",
    ownerUrl: "https://support.envytheme.com/",
  },
};

const Footer = () => {
  return (
    <>
      <footer className="footer-area style-one bg-optional position-relative z-1 pt-120">
        <div className="container">
          <div className="row justify-content-center pb-90">
            {footerData.sections.map((section, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="footer-widget mb-30">
                  <h4 className="footer-widget-title position-relative fs-20 font-primary fw-bold text-white">
                    {section.title}
                  </h4>

                  {section.menuItems && (
                    <ul className="footer-menu style-one list-unstyled mb-0">
                      {section.menuItems.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <Link href={item.url}>{item.text}</Link>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.contactInfo && (
                    <ul className="contact-info-list list-unstyled mb-0">
                      {section.contactInfo.map((info, infoIndex) => (
                        <li key={infoIndex}>
                          <span className="fw-bold text-white me-1">
                            {info.label}
                          </span>
                          {info.type === "email" ? (
                            <a href={`mailto:${info.value}`}>{info.value}</a>
                          ) : info.type === "tel" ? (
                            <a href={`tel:${info.value}`}>{info.value}</a>
                          ) : (
                            info.value
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="footer-large-text font-optional fw-black round-10">
                <span>W</span>
                <span>A</span>
                <span>L</span>
                <span>K</span>
                <span>E</span>
                <span>R</span>
              </div>
            </div>

            <div className="col-md-5">
              <div className="social-share d-flex flex-wrap align-items-center justify-content-md-start justify-content-center mb-sm-10">
                <span className="text-alto fw-semibold me-2">Follow Us: </span>
                <ul className="social-profile style-two list-unstyled mb-0">
                  {footerData.socialLinks.map((social, index) => (
                    <li key={index}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-flex flex-column align-items-center justify-content-center rounded-circle"
                      >
                        <i className={social.icon}></i>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-md-7 text-md-end text-center">
              <p className="copyright-text mb-0 text-white">
                <i className="ri-copyright-line"></i>
                <span className="text_secondary fw-medium">Walker Vision Co</span>{" "}
                {footerData.copyright.text}{" "}
                <a
                  href={footerData.copyright.ownerUrl}
                  className="link style-three fw-medium"
                >
                  {footerData.copyright.owner}
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

