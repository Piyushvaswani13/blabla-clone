import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import RideCard from "../components/RideCard";
import "./AvailableRidesPage.css";
import MapUtils from "./MapUtils";

function AvailableRidesPage() {
  const location = useLocation();
  const { results: initialRides } = location.state || { results: [] };
const {sourceLat, sourceLng, destinationLat, destinationLng} = location.state ||  {sourceLat:0.0, sourceLng:0.0, destinationLat:0.0, destinationLng:0.0} ;
  const [rides, setRides] = useState(initialRides);
  const [filters, setFilters] = useState({
    max2InTheBack: false,
    smokingAllowed: false,
    petsAllowed: false,
  });
  const [isFilterVisible, setFilterVisible] = useState(false); 
  const [sortBy, setSortBy] = useState("");

  const applyFilters = useCallback(() => {
    const filteredRides = initialRides.filter((ride) => {
      const max2InTheBackMatch = !filters.max2InTheBack || ride.max2InTheBack;
      const smokingAllowedMatch = !filters.smokingAllowed || ride.smokingAllowed;
      const petsAllowedMatch = !filters.petsAllowed || ride.petsAllowed;

      return max2InTheBackMatch && smokingAllowedMatch && petsAllowedMatch;
    });
    setRides(filteredRides);
  }, [filters, initialRides]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSort = (criteria) => {
    const sortedRides = [...rides].sort((a, b) => {
      if (criteria === "seats") return parseInt(b.seats) - parseInt(a.seats);
      if (criteria === "price") return parseFloat(a.price) - parseFloat(b.price);
      if (criteria === "date") return new Date(a.date) - new Date(b.date);
      if (criteria === "departure") {
        const bDistance= MapUtils.calculateDistance(sourceLat,sourceLng,b.sourceLat, b.sourceLng) ;
        const aDistance= MapUtils.calculateDistance(sourceLat,sourceLng,a.sourceLat, a.sourceLng);
        console.log(a.carModel,b.carModel,bDistance,aDistance,b.sourceLat,b.sourceLng,a.sourceLat,a.sourceLng);
        return aDistance - bDistance ;
      } 
      if (criteria === "arrival") {
        const bDistance= MapUtils.calculateDistance(destinationLat,destinationLng,b.destinationLat, b.destinationLng) ;
        const aDistance= MapUtils.calculateDistance(destinationLat,destinationLng,a.destinationLat, a.destinationLng);
        console.log(a.carModel,b.carModel,bDistance,aDistance,b.sourceLat,b.sourceLng,a.sourceLat,a.sourceLng);
        return aDistance - bDistance ;
      } 
      return 0;
    });
    setRides(sortedRides);
    setSortBy(criteria);
  };

  const toggleFilterVisibility = () => {
    setFilterVisible((prev) => !prev);
  };

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  return (
    <div>
      <h2>Available Rides</h2>

      {/* Sort and Filter Section */}
      <div className="filter-sort-section">
        <div className="sort-options">
          <label>
            Sort By:
            <select value={sortBy} onChange={(e) => handleSort(e.target.value)}>
              <option value="">None</option>
              <option value="departure">Close to departure</option>
              <option value="arrival">Close to Arrival</option>
              <option value="seats">Seats high to low</option>
              <option value="price">Price low to high</option>
              <option value="date">Date</option>
            </select>
          </label>
        </div>

        {/* Filter Button */}
        <button className="filter-button" onClick={toggleFilterVisibility}>
          {isFilterVisible ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters Section */}
      {isFilterVisible && (
        <div className="filters">
          <label>
            <input
              type="checkbox"
              name="max2InTheBack"
              checked={filters.max2InTheBack}
              onChange={handleFilterChange}
            />
            Max 2 in the Back
          </label>
          <label>
            <input
              type="checkbox"
              name="smokingAllowed"
              checked={filters.smokingAllowed}
              onChange={handleFilterChange}
            />
            Smoking Allowed
          </label>
          <label>
            <input
              type="checkbox"
              name="petsAllowed"
              checked={filters.petsAllowed}
              onChange={handleFilterChange}
            />
            Pets Allowed
          </label>
        </div>
      )}

      {/* Rides Display Section */}
      {rides.length > 0 ? (
        rides.map((ride) => <RideCard key={ride.id} ride={ride} />)
      ) : (
        <p>No rides found.</p>
      )}
    </div>
  );
}

export default AvailableRidesPage;

