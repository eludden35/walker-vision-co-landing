"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

// Dynamic properties data
const propertiesData = [
  {
    id: 1,
    title: "Apartment Building",
    type: "Apartment",
    location: "123 Maplewood CA 90210, USA",
    imageUrl: "/images/properties/property-10.jpg",
    capacity: "1200",
    entry: "1",
  },
  {
    id: 2,
    title: "Villa Residence",
    type: "Villa",
    location: "134 strette, New York, USA",
    imageUrl: "/images/properties/property-11.jpg",
    capacity: "2500",
    entry: "2",
  },
  {
    id: 3,
    title: "Condominium Complex",
    type: "Condominium",
    location: "23rd St Lois Ave, CA 900, USA",
    imageUrl: "/images/properties/property-10.jpg",
    capacity: "1800",
    entry: "1",
  },
  // Add more properties as needed
];
// Property type options
const propertyTypes = [
  { value: "0", label: "Type Of Properties" },
  { value: "1", label: "Apartment" },
  { value: "2", label: "Villa" },
  { value: "3", label: "Condominium" },
];
// Entry options
const entryOptions = [
  { value: "0", label: "Entry" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
];
const AreasWeServe = () => {
  // State for form inputs
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("0");
  const [capacity, setCapacity] = useState("");
  const [entry, setEntry] = useState("0");
  // State for filtered properties
  const [filteredProperties, setFilteredProperties] = useState(propertiesData);
  // Handle form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterProperties();
  };
  // Filter properties based on form inputs
  const filterProperties = useCallback(() => {
    let result = propertiesData;
    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (property) =>
          property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Filter by property type
    if (propertyType !== "0") {
      const selectedType = propertyTypes.find(
        (type) => type.value === propertyType
      )?.label;
      if (selectedType) {
        result = result.filter((property) => property.type === selectedType);
      }
    }
    // Filter by capacity
    if (capacity) {
      result = result.filter((property) => property.capacity >= capacity);
    }
    // Filter by entry
    if (entry !== "0") {
      result = result.filter((property) => property.entry === entry);
    }
    setFilteredProperties(result);
  }, [searchTerm, propertyType, capacity, entry]);
  // Filter properties when any filter value changes
  useEffect(() => {
    filterProperties();
  }, [filterProperties]);
  return (
    <>
      <div className="location-area style-one position-relative z-1 mx-xxl-4 ptb-120">
        <div className="container">
          <div className="row align-items-end mb-40">
            <div className="col-xxl-6 col-md-7 mb-sm-20">
              <h6 className="section-subtitle style-one d-inline-block fs-13 ls-1 font-optional fw-semibold position-relative text_primary mb-20">
                <Image
                  src="/images/icons/star-3.svg"
                  alt="Icon"
                  width={17}
                  height={16}
                />
                AREAS WE SERVE
              </h6>
              <h2 className="section-title style-one text-title mb-0">
                Trusted{" "}
                <span className="fw-black">
                  Renovation Experts In Your Neighborhood
                </span>{" "}
                And Beyond
              </h2>
            </div>

            <div className="col-xxl-6 col-md-5 text-md-end">
              <Link
                href="/location"
                className="btn style-one d-inline-flex flex-wrap align-items-center p-0"
              >
                <span className="btn-text d-inline-block fw-semibold position-relative transition">
                  View All Location
                </span>
                <span className="btn-icon position-relative d-flex flex-column align-items-center justify-content-center rounded-circle transition">
                  <i className="ri-arrow-right-up-line"></i>
                </span>
              </Link>
            </div>
          </div>

          <div className="location-box style-one bg-white round-10">
            <form
              className="location-filter d-flex flex-wrap mb-15"
              onSubmit={handleSearch}
            >
              <div className="form-group position-relative">
                <input
                  type="search"
                  className="w-100 ht-48 bg-gray round-10 border-0 text-para outline-0"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="position-absolute top-0 end-0 h-100 pe-3 border-0 bg-transparent"
                  type="submit"
                >
                  <Image
                    src="/images/icons/search-gray.svg"
                    alt="Icon"
                    width={21}
                    height={21}
                  />
                </button>
              </div>
              <div className="form-group">
                <select
                  className="w-100 ht-48 bg-gray round-10 border-0 text-para outline-0"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  {propertyTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group position-relative">
                <input
                  type="text"
                  className="w-100 ht-48 bg-gray round-10 border-0 text-para outline-0"
                  placeholder="Capacity(Sq ft)"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>
              <div className="form-group">
                <select
                  className="w-100 ht-48 bg-gray round-10 border-0 text-para outline-0"
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                >
                  {entryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </form>

            <div className="row">
              <div className="col-xxl-5 col-xl-6 col-lg-7 mb-md-20">
                <p className="fw-semibold text-title text-title mb-20">
                  Found {filteredProperties.length} Places Around You
                </p>
                <div className="property-result-wrap scrollable-container">
                  {filteredProperties.length > 0 ? (
                    filteredProperties.map((property) => (
                      <div
                        key={property.id}
                        className="property-card style-two d-flex flex-wrap align-items-center mb-15"
                      >
                        <div className="property-img position-relative round-10">
                          <Image
                            src={property.imageUrl}
                            alt={property.title}
                            width={570}
                            height={562}
                            className="round-10"
                          />
                          <Link
                            href="/properties/details"
                            className="position-absolute top-0 start-0 w-100 h-100"
                          ></Link>
                        </div>
                        <div className="property-info">
                          <span className="property-category bg_secondary text-title transition">
                            {property.type}
                          </span>
                          <h3 className="fs-20 fw-semibold">
                            <Link
                              href="/properties/details"
                              className="text-title link-hover-primary transition"
                            >
                              {property.title}
                            </Link>
                          </h3>
                          <p className="position-relative mb-0">
                            <Image
                              src="/images/icons/pin-pink.svg"
                              alt="Icon"
                              width={17}
                              height={21}
                            />
                            {property.location}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-para">
                        No properties found matching your criteria.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-xxl-7 col-xl-6 col-lg-5">
                <div className="map-wrap round-10">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2843.633897069592!2d-72.06176842322485!3d44.54312817107391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cb434034d654acf%3A0xd3f30445e8230f9a!2s401%20Town%20Hwy%2024%2C%20Lyndonville%2C%20VT%2005851%2C%20USA!5e0!3m2!1sen!2sbd!4v1757832399321!5m2!1sen!2sbd"
                    title="Map"
                    width="100%"
                    height="445"
                    style={{ border: 0, borderRadius: "10px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AreasWeServe;
