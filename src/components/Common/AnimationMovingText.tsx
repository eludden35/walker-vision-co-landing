import React from "react";

const AnimationMovingText = () => {
  // Dynamic data for moving text items
  const textItems = [
    "BRINGING YOUR VISION TO LIFE",
    "TRANSPARENT PRICING",
    "MODERN DESIGN SOLUTIONS",
    "QUALITY GUARANTEED",
    "ON-TIME DELIVERY",
    "LICENSED & INSURED PROFESSIONALS",
    "PRECISION BUILDS",
    "$0 HIDDEN FEES",
  ];

  // Duplicate the items to create the seamless loop effect
  const duplicatedItems = [...textItems, ...textItems];

  return (
    <>
      <div className="move-text-wrapper overflow-hidden">
        <div className="move-text style-two position-relative z-1">
          <ul className="list-unstyled mb-0">
            {duplicatedItems.map((item, index) => (
              <li key={index} className="position-relative font-secondary">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default AnimationMovingText;
