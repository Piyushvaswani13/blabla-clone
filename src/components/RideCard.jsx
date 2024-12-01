import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRides } from "../context/RideContext";
import "./RideCard.css";
import Map from "../pages/Map";

// Helper function to get a cookie value
const getCookie = (name) => {
  const cookieArr = document.cookie.split(";");
  for (let cookie of cookieArr) {
    const [key, value] = cookie.trim().split("=");
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
};

function RideCard({ ride, googleMapsApiKey }) {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();
  const { sendNotification, addRideRequest } = useRides();
  const uid = getCookie("uid"); // Get UID from cookies



  const handleRequestBooking = async () => {
    if (!uid) {
      alert("Please log in to book a ride.");
      return;
    }

    if (ride.approvaltype === "instant") {
      sendNotification({
        message: "Ride Booking Request",
        rideId: ride.id,
        userId: uid,
        timestamp: Date.now(),
      });
      alert("Booking request sent to driver!");
      navigate("/notifications");
    } else {
      // Add ride request to Firestore
      const userRide = {
        tripId: ride.id,
        userId: uid,
        status: "pending",
        timestamp: Date.now(),
      };
      await addRideRequest(userRide);
      alert("Booking request submitted for approval!");
    }
  };

  // const handleMapView = () => {
  //   navigate(`/map-view/${ride.sourceLat}/${ride.sourceLng}/${ride.destinationLat}/${ride.destinationLng}`);
  // };

  return (
    <div className="ride-card">
      {showDetails ? (
        <>
          <h3>{ride.driverName}</h3>
          <p>From: {ride.source}</p>
          <p>To: {ride.destination}</p>
          <p>Date: {ride.date}</p>
          <p>Driver Contact: {ride.driverContact}</p>
          <p>Car Model: {ride.carModel}</p>
          <p>Seats Available: {ride.seats}</p>
          <p>Price: {ride.price}</p>
          <p>Approval Type: {ride.approvaltype}</p>
          <button onClick={handleRequestBooking}>Request to Book</button>
          {/* <button onClick={handleMapView}>Map View</button> */}
          <Map
            googleMapsApiKey={googleMapsApiKey}
            sourceLat={ride.sourceLat}
            sourceLng={ride.sourceLng}
            destinationLat={ride.destinationLat}
            destinationLng={ride.destinationLng}
          />
          <button onClick={() => setShowDetails(false)}>Hide Details</button>
        </>
      ) : (
        <>
          <h3>{ride.driverName}</h3>
          <p>From: {ride.source}</p>
          <p>To: {ride.destination}</p>
          <p>Date: {ride.date}</p>
          <button onClick={() => setShowDetails(true)}>More Details</button>
        </>
      )}
    </div>
  );
}

export default RideCard;
