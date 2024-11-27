import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRides } from "../context/RideContext";
import "./PublishRide.css";

function PublishRide({ googleMapsApiKey }) {
  const [source, setSource] = useState('kichha, uttarakhand, india');
  const [destination, setDestination] = useState('delhi, india');
  const [carModel, setCarModel] = useState("");
  const [date, setDate] = useState("");
  const [seats, setSeats] = useState("");
  const [price, setPrice] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverContact, setDriverContact] = useState("");
  const [approvalType, setApprovalType] = useState("instant"); // New state for approval type
  const { publishRide } = useRides();
  const navigate = useNavigate();

  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    };

    loadScript(
      `https://maps.gomaps.pro/maps/api/js?key=${googleMapsApiKey}&libraries=places`
    ).then(() => {
      const autocompleteSource = new window.google.maps.places.Autocomplete(
        document.getElementById("autocomplete-source"),
        { types: ["(cities)"], componentRestrictions: { country: "IN" } }
      );

      const autocompleteDestination = new window.google.maps.places.Autocomplete(
        document.getElementById("autocomplete-destination"),
        { types: ["(cities)"], componentRestrictions: { country: "IN" } }
      );

      autocompleteSource.addListener("place_changed", () => {
        const place = autocompleteSource.getPlace();
        setSource(place.formatted_address);
      });

      autocompleteDestination.addListener("place_changed", () => {
        const place = autocompleteDestination.getPlace();
        setDestination(place.formatted_address);
      });
    });
  }, [googleMapsApiKey]);

  const handlePublish = async () => {
    if (
      !source ||
      !destination ||
      !carModel ||
      !date ||
      !seats ||
      !price ||
      !driverName ||
      !driverContact
    ) {
      alert("Please fill in all fields!");
      return;
    }

    const rideDetails = {
      source,
      destination,
      carModel,
      date,
      seats,
      price,
      driverName,
      driverContact,
      approvaltype: approvalType, // Include approval type
      status: "available",
    };

    await publishRide(rideDetails);
    alert("Ride Published!");
    navigate("/home");
  };

  return (
    <div>
      <h2>Publish a Ride</h2>
      <input
        id="autocomplete-source"
        type="text"
        placeholder="Enter Source"
        style={{ width: "100%", height: "40px", margin: "10px 0" }}
      />
      <input
        id="autocomplete-destination"
        type="text"
        placeholder="Enter Destination"
        style={{ width: "100%", height: "40px", margin: "10px 0" }}
      />
      <input
        type="text"
        placeholder="Car Model"
        value={carModel}
        onChange={(e) => setCarModel(e.target.value)}
      />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input
        type="number"
        placeholder="Number of Seats"
        value={seats}
        onChange={(e) => setSeats(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price per Seat (₹)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="text"
        placeholder="Driver's Name"
        value={driverName}
        onChange={(e) => setDriverName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Driver's Contact"
        value={driverContact}
        onChange={(e) => setDriverContact(e.target.value)}
      />
      <select
        value={approvalType}
        onChange={(e) => setApprovalType(e.target.value)} // Handle approval type selection
      >
        <option value="instant">Instant Approval</option>
        <option value="requestcycle">Request Cycle</option>
      </select>
      <button onClick={handlePublish}>Publish Ride</button>
    </div>
  );
}

export default PublishRide;
