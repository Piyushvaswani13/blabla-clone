import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import { db } from "../services/firebase";
import { updateDoc, doc, getDoc } from "firebase/firestore";

function RateDriver() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { tripId, passengerId } = state || {}; // Make sure state is being passed correctly
  const [rating, setRating] = useState(0); // State to store the rating
  const [driverName, setDriverName] = useState(""); // State to store driver's name

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
          console.log("Fetched trip data:", tripData); // Debugging the fetched trip data
          setDriverName(tripData.driverName || "Driver name not available"); // Store the driver's name in state
        } else {
          console.error("No such trip!");
        }
      } catch (error) {
        console.error("Error fetching driver name:", error);
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

  if (!tripId || !driverName) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Rate Your Driver</h2>
      <div>
        <p>
          <strong>Driver:</strong> {driverName}
        </p>
        <p>Rate the driver for trip {tripId}</p>
        <ReactStars
          count={5}
          value={rating} // Set the value to the rating state
          onChange={handleRatingChange} // Use the handleRatingChange to update the rating
          size={30}
          isHalf={true}
          activeColor="#ffd700"
        />
      </div>
    </div>
  );
}

export default RateDriver;
