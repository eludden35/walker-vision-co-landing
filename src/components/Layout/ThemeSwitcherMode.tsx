"use client";

import React, { useState, useEffect } from "react";

const ThemeSwitcherMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (storedTheme === "dark" || (!storedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("theme-dark");
    }
  }, []);

  // Toggle theme and save preference
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("theme-dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("theme-dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <>
      <div className="switch-theme-mode">
        <label htmlFor="slider" className="switch">
          <input
            type="checkbox"
            id="slider"
            checked={isDarkMode}
            onChange={toggleTheme}
          />
          <span className="slider round"></span>
        </label>
      </div>
    </>
  );
};

export default ThemeSwitcherMode;

