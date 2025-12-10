"use client";

import React, { useEffect, useRef } from "react";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorInner = cursorInnerRef.current;

    if (!cursor || !cursorInner) return;

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
      cursorInner.style.left = `${x}px`;
      cursorInner.style.top = `${y}px`;
    };

    // Handle mouse down
    const handleMouseDown = () => {
      cursor.classList.add("click");
      cursorInner.classList.add("cursorinnerhover");
    };

    // Handle mouse up
    const handleMouseUp = () => {
      cursor.classList.remove("click");
      cursorInner.classList.remove("cursorinnerhover");
    };

    // Handle link hover
    const handleLinkHover = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "A") {
        cursor.classList.add("hover");
      }
    };

    const handleLinkLeave = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "A") {
        cursor.classList.remove("hover");
      }
    };

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    // Add event listeners to all links
    const links = document.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("mouseover", handleLinkHover);
      link.addEventListener("mouseleave", handleLinkLeave);
    });

    // Cleanup function
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);

      links.forEach((link) => {
        link.removeEventListener("mouseover", handleLinkHover);
        link.removeEventListener("mouseleave", handleLinkLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor">
        <span className="cursor-text"></span>
      </div>
      <div ref={cursorInnerRef} className="cursor-inner"></div>
    </>
  );
};

export default CustomCursor;

