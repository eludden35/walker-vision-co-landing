"use client";

import React, { useEffect, useState } from "react";

const GoTop = () => {
  // The back-to-top button is hidden at the beginning
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 150) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    });
  }, []);

  // This function will scroll the window to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // for smoothly scrolling
    });
  };

  return (
    <>
      {showButton && (
        <div
          id="progress-wrap"
          className="progress-wrap style-one"
          onClick={scrollToTop}
        >
          <svg
            className="progress-circle svg-content"
            width="100%"
            height="100%"
            viewBox="-1 -1 102 102"
          >
            <path
              id="progress-path"
              d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
            />
          </svg>
        </div>
      )}
    </>
  );
};

export default GoTop;

