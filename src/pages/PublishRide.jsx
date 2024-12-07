import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRides } from "../context/RideContext";
import { auth, db } from '../services/firebase';
import { doc, getDoc } from "firebase/firestore";
import "./PublishRide.css";

function PublishRide({ googleMapsApiKey }) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [sourceLat, setSourceLat] = useState(null);
  const [sourceLng, setSourceLng] = useState(null);
  const [destinationLat, setDestinationLat] = useState(null);
  const [destinationLng, setDestinationLng] = useState(null);
  const [carModel, setCarModel] = useState("");
  const [date, setDate] = useState("");
  const [seats, setSeats] = useState("");
  const [price, setPrice] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverContact, setDriverContact] = useState("");
  const [approvalType, setApprovalType] = useState("");
  const { publishRide } = useRides();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setDriverName(userData.name);
          setDriverContact(userData.contact);
        }
      }
    };

    loadUserDetails();
  }, []);

  useEffect(() => {
    const loadScript = async (src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
      await new Promise((resolve) => (script.onload = resolve));
    };

    const initializeAutocomplete = async () => {
      await loadScript(
        `https://maps.gomaps.pro/maps/api/js?key=${googleMapsApiKey}&libraries=places`
      );

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
        setSourceLat(place.geometry.location.lat());
        setSourceLng(place.geometry.location.lng());
      });

      autocompleteDestination.addListener("place_changed", () => {
        const place = autocompleteDestination.getPlace();
        setDestination(place.formatted_address);
        setDestinationLat(place.geometry.location.lat());
        setDestinationLng(place.geometry.location.lng());
      });
    };

    initializeAutocomplete();
  }, [googleMapsApiKey]);

  const handlePublish = async () => {
    if (!source || !destination || !carModel || !date || !seats || !price) {
      alert("Please fill in all fields!");
      return;
    }

    if (seats <= 0) {
      alert("Number of seats must be greater than zero!");
      return;
    }

    if (seats > 10) {
      alert("Number of seats cannot exceed 10!");
      return;
    }

    const rideDetails = {
      sourceLat,
      sourceLng,
      destinationLat,
      destinationLng,
      source,
      destination,
      carModel,
      date,
      seats,
      price,
      driverName,
      driverContact,
      approvaltype: approvalType,
      status: "available",
    };

    await publishRide(rideDetails);
    alert("Ride Published!");
    navigate("/home");
  };

  return (
    <div className="publish-ride-container">
      <img src="/BlaBlaCar_logo.png" alt="Banner" className="banner-img" />
      <div className="form-container">
        <h2>Publish a Ride</h2>
        <input
          id="autocomplete-source"
          type="text"
          placeholder="Enter Source"
          className="input-field"
        />
        <input
          id="autocomplete-destination"
          type="text"
          placeholder="Enter Destination"
          className="input-field"
        />
        <input
          type="text"
          placeholder="Car Model"
          value={carModel}
          onChange={(e) => setCarModel(e.target.value)}
          className="input-field"
        />
        <input
          type="date"
          placeholder="Trip Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Number of Seats"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Price per Seat (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="input-field"
        />
        
        <select
          id="trip-type"
          value={approvalType}
          onChange={(e) => setApprovalType(e.target.value)}
          className="select-field"
        >
           <option value="" disabled>Trip Type</option>
          <option value="instant">Instant Approval</option>
          <option value="requestcycle">Request Cycle</option>
        </select>
        <button onClick={handlePublish} className="publish-btn">
          Publish Ride
        </button>
      </div>
    </div>
  );
}
export default PublishRide;
