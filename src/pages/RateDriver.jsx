import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import { db } from "../services/firebase";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import "./RateDriver.css"; // Assuming you will add styles in a separate CSS file

function RateDriver() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { tripId, passengerId } = state || {}; // Ensure state is being passed correctly
  const [rating, setRating] = useState(0); // State to store the rating
  const [driverName, setDriverName] = useState(""); // State to store the driver's name
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch the driver's name when the component mounts
  useEffect(() => {
    if (!tripId) {
      console.error("No tripId available.");
      return;
    }

    const fetchDriverName = async () => {
      try {
        const tripRef = doc(db, "rides", tripId); // Reference to the specific trip document
        const tripSnap = await getDoc(tripRef);

        if (tripSnap.exists()) {
          const tripData = tripSnap.data();
          setDriverName(tripData.driverName || "Driver name not available"); // Store the driver's name in state
        } else {
          console.error("No such trip!");
        }
      } catch (error) {
        console.error("Error fetching driver name:", error);
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };

    fetchDriverName();
  }, [tripId]); // Re-run when tripId changes

  const handleRatingChange = async (newRating) => {
    setRating(newRating); // Update the rating state

    try {
      // Update the rating in the Firestore database
      const tripRef = doc(db, "rides", tripId);
      await updateDoc(tripRef, {
        driverRating: newRating,
      });

      // Optionally navigate back or show a success message
      alert("Rating submitted successfully!");
      navigate("/your-rides"); // Navigate back to the rides list
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div> {/* Add a loading spinner */}
        <p>Loading driver details...</p>
      </div>
    );
  }

  return (
    <div className="rate-driver-container">
      <h2 className="rate-driver-title">Rate Your Driver</h2>
      <div className="rate-driver-card">
        <p className="driver-name">
          <strong>Driver:</strong> {driverName}
        </p>
        <p className="trip-info">Rate the driver for trip {tripId}</p>

        <div className="rating-container">
          <ReactStars
            count={5}
            value={rating} // Set the value to the rating state
            onChange={handleRatingChange} // Use the handleRatingChange to update the rating
            size={30}
            isHalf={true}
            activeColor="#ffd700"
          />
        </div>

        <div className="submit-rating">
          <button className="submit-button" onClick={() => handleRatingChange(rating)}>
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  );
}

export default RateDriver;
