import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom"; // Import useLocation
import ReactStars from "react-rating-stars-component";

function RatingsPage() {
  const { currentUser } = useAuth();
  const location = useLocation(); // Access state from navigation
  const [completedTrips, setCompletedTrips] = useState([]);
  const [ratings, setRatings] = useState({}); // Store ratings for trips
  const [passengerList, setPassengerList] = useState({}); // Store passenger list for each trip

  // Get driverId and userId from the state passed during navigation
  const { driverId, userId } = location.state || {};

  useEffect(() => {
    fetchCompletedTrips();
  }, [driverId, userId]); // Re-fetch trips whenever driverId or userId changes

  const fetchCompletedTrips = async () => {
    try {
      const allTrips = [];

      // Step 1: Get trips where the currentUser is the passenger
      const passengerQuery = query(
        collection(db, "userRide"),
        where("userId", "==", userId), // Use userId passed from location state
        where("status", "==", "completed")
      );

      const passengerSnapshot = await getDocs(passengerQuery);
      passengerSnapshot.forEach((doc) => {
 // Fetch passenger list for the trip
 fetchPassengerList(userId).then((passengers) => {
  setPassengerList((prevList) => ({
    ...prevList,
    [userId]: passengers,
  }));
});

        allTrips.push({
          id: doc.id,
          role: "driver",
          tripId: doc.data().tripId,
          source: doc.data().source,
          destination: doc.data().destination,
          driverName: doc.data().driverName,
          ...doc.data(),
        });
      });
     

      // Step 2: Get trips where the currentUser is the driver
      const driverQuery = query(
        collection(db, "rides"),
        where("driverId", "==", driverId), // Use driverId passed from location state
        where("status", "==", "completed")
      );

      const driverSnapshot = await getDocs(driverQuery);
      driverSnapshot.forEach((doc) => {
        const tripData = doc.data();
        const tripId = doc.id;

       

        allTrips.push({
          id: doc.id,
          role: "passenger",
          tripId: tripId, // Assuming document ID as trip ID
          source: tripData.source,
          destination: tripData.destination,
          driverName: tripData.driverName || "You",
          ...tripData,
        });
      });

      setCompletedTrips(allTrips);
    } catch (error) {
      console.error("Error fetching completed trips:", error);
    }
  };

  // Function to fetch passengers for a specific trip
  const fetchPassengerList = async (userId) => {
    try {
      const passengers = [];
      const passengerQuery = query(
        collection(db, "userRide"),
        where("userId", "==", userId)
      );

      const passengerSnapshot = await getDocs(passengerQuery);
      passengerSnapshot.forEach((doc) => {
        console.log(doc.data())
        passengers.push(doc.data().userId);
      });

      console.log("Fetched passengers for trip:", userId, passengers); // Debugging log
      return passengers;
    } catch (error) {
      console.error("Error fetching passenger list:", error);
      return [];
    }
  };

  const handleRatingChange = async (tripId, newRating, role) => {
    setRatings((prevRatings) => ({ ...prevRatings, [tripId]: newRating }));

    try {
      if (role === "driver") {
        // Update rating in userRide collection
        const tripRef = doc(db, "userRide", tripId);
        await updateDoc(tripRef, { passengerRating: newRating });
      } else if (role === "passenger") {
        // Update rating in rides collection
        const tripRef = doc(db, "rides", tripId);
        await updateDoc(tripRef, { driverRating: newRating });
      }
      alert("Rating submitted successfully!");
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating. Please try again.");
    }
  };

  return (
    <div>
      <h2>Rate Your Rides</h2>
      {completedTrips.length === 0 ? (
        <p>No completed trips to rate.</p>
      ) : (
        completedTrips.map((trip) => (
          console.log(trip),
          <div key={trip.id} style={{ marginBottom: "20px" }}>
            <h3>Trip: {trip.tripId}</h3>
            <p>
              <strong>Role:</strong> {trip.role}
            </p>
            {trip.role === "passenger" ? (
              <p>
                <strong>Driver:</strong> {trip.driverName || currentUser.name}
              </p>
            ) : (
              <div>
                <p>
                  <strong>Passengers:</strong>
                </p>
                <ul>
                  {passengerList[trip.userId]?.map((passenger, index) => (
                    <li key={index}>{passenger}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* <p>
              <strong>Source:</strong> {trip.source}
            </p>
            <p>
              <strong>Destination:</strong> {trip.destination}
            </p> */}
            <div style={{ marginTop: "10px" }}>
              <ReactStars
                count={5}
                value={ratings[trip.id] || 0}
                onChange={(newRating) =>
                  handleRatingChange(trip.id, newRating, trip.role)
                }
                size={30}
                isHalf={true}
                activeColor="#ffd700"
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default RatingsPage;