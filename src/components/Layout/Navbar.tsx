"use client";

import React, { useState, useEffect } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
// Menus data
import { menus } from "@/components/Layout/Menus";

// Define types for menu items
type MenuItem = {
  id?: string;
  label: string;
  href?: string;
  children?: MenuItem[];
};

// Recursive menu component for desktop
type MenuItemsProps = { items: MenuItem[]; pathname: string };
const MenuItems = ({ items, pathname }: MenuItemsProps) => {
  return (
    <>
      {items.map((item, index) => (
        <li
          key={index}
          className={item.children ? "menu-item-has-children" : ""}
        >
          {item.href ? (
            <Link
              href={item.href}
              className={`nav-link ${pathname === item.href ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ) : (
            <Link href="#" onClick={(e) => e.preventDefault()}>
              {item.label} <i className="ri-add-line"></i>
            </Link>
          )}
          {item.children && (
            <ul className="menu-subs menu-column-1">
              <MenuItems items={item.children} pathname={pathname} />
            </ul>
          )}
        </li>
      ))}
    </>
  );
};

// Recursive menu component for mobile
type MobileMenuItemsProps = {
  items: MenuItem[];
  pathname: string;
  openDropdowns: string[];
  toggleDropdown: (id: string) => void;
  handleClose: () => void;
  parentPath?: string;
};
const MobileMenuItems = ({
  items,
  pathname,
  openDropdowns,
  toggleDropdown,
  handleClose,
  parentPath = "",
}: MobileMenuItemsProps) => {
  return (
    <>
      {items.map((item, index) => {
        // Generate unique ID for each menu item
        const itemId = parentPath ? `${parentPath}-${index}` : `${index}`;
        const isOpen = openDropdowns.includes(itemId);
        const hasChildren = item.children && item.children.length > 0;
        
        return (
          <li key={itemId} className="nav-item">
            {hasChildren ? (
              <>
                <div
                  className="dropdown-toggle nav-link"
                  onClick={() => toggleDropdown(itemId)}
                >
                  <span>{item.label}</span>{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="8"
                    viewBox="0 0 14 8"
                    fill="none"
                    className={`transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      d="M13 1.5L7 6.5L1 1.5"
                      stroke="#af9e6d"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {/* Always render dropdown but control visibility with CSS */}
                <ul className={`dropdown-menu ${isOpen ? "show" : ""}`}>
                  <MobileMenuItems
                    items={item.children!}
                    pathname={pathname}
                    openDropdowns={openDropdowns}
                    toggleDropdown={toggleDropdown}
                    handleClose={handleClose}
                    parentPath={itemId}
                  />
                </ul>
              </>
            ) : (
              <Link
                href={item.href || "#"}
                className={`nav-link ${pathname === item.href ? "active" : ""}`}
                onClick={handleClose}
              >
                {item.label}
              </Link>
            )}
          </li>
        );
      })}
    </>
  );
};

function Navbar() {
  const pathname = usePathname();
  
  // Sticky navbar effect
  useEffect(() => {
    const el = document.getElementById("navbar");
    if (!el) return;
    const onScroll = () => {
      if (window.scrollY > 170) {
        el.classList.add("sticky");
      } else {
        el.classList.remove("sticky");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // set initial state
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Offcanvas state
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Dropdown states
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const toggleDropdown = (dropdownId: string) => {
    setOpenDropdowns((prev) => {
      if (prev.includes(dropdownId)) {
        // Close this dropdown and all its children
        return prev.filter((id) => !id.startsWith(dropdownId));
      } else {
        // Open this dropdown
        return [...prev, dropdownId];
      }
    });
  };

  return (
    <>
      <div className="navbar-area style-one position-relative walker-dark-navbar" id="navbar">
        <div className="container-fluid">
          <div className="navbar-wrapper d-flex justify-content-between align-items-center">
            <Link href="/" className="navbar-brand">
              <div className="d-flex align-items-center gap-2">
                <div className="walker-logo-box">
                  <span className="walker-logo-text">W</span>
                </div>
                <span className="walker-brand-text">
                  WALKER <span className="walker-brand-gold">VISION</span> CO.
                </span>
              </div>
            </Link>
            
            {/* For Desktop Menu */}
            <div className="menu-area me-auto">
              <div className="overlay"></div>
              <nav className="menu">
                <div className="menu-mobile-header">
                  <button
                    type="button"
                    className="menu-mobile-arrow bg-transparent border-0"
                  >
                    <i className="ri-arrow-left-s-line"></i>
                  </button>
                  <div className="menu-mobile-title"></div>
                  <button
                    type="button"
                    className="menu-mobile-close bg-transparent border-0"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
                <ul className="menu-section p-0 mb-0 lh-1">
                  <MenuItems items={menus} pathname={pathname} />
                </ul>
              </nav>
            </div>
            
            {/* Other Options */}
            <div className="other-options d-flex flex-wrap align-items-center justify-content-end">
              <div className="option-item">
                <Link
                  href="/contact-us"
                  className="btn walker-cta-btn"
                >
                  <span className="btn-text">Get a Quote</span>
                </Link>
              </div>
              <div className="option-item d-lg-none">
                <button
                  type="button"
                  className="menu-mobile-trigger walker-mobile-menu"
                  onClick={handleShow}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* For Mobile Menu */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        className="walker-mobile-offcanvas"
        style={{ width: "300px" }}
      >
        <Offcanvas.Header closeButton className="walker-offcanvas-header">
          <Offcanvas.Title>
            <div className="d-flex align-items-center gap-2">
              <div className="walker-logo-box">
                <span className="walker-logo-text">W</span>
              </div>
              <span className="walker-brand-text">
                WALKER <span className="walker-brand-gold">VISION</span> CO.
              </span>
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="walker-offcanvas-body">
          <div className="mobile-menu">
            <ul className="mobile-menu-list">
              <MobileMenuItems
                items={menus}
                pathname={pathname}
                openDropdowns={openDropdowns}
                toggleDropdown={toggleDropdown}
                handleClose={handleClose}
              />
            </ul>
            <Link
              href="/contact-us"
              className="btn walker-mobile-cta-btn w-100 mt-4"
              onClick={handleClose}
            >
              Get a Quote
            </Link>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Navbar;

