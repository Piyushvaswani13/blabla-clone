import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import './YourRides.css';

function YourRides() {
  const { currentUser } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [completedTrips, setCompletedTrips] = useState([]); 
  const [canceledTrips, setCanceledTrips] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      fetchUserRole();
    }
  }, [currentUser]);

  useEffect(() => {
    if (userRole) {
      fetchBookingRequests();
      fetchCompletedTrips();  
      fetchCanceledTrips();
    }
  }, [userRole]);

  const fetchUserRole = async () => {
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        setUserRole(userSnapshot.data().role);
      } else {
        console.error("User document not found");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const fetchBookingRequests = async () => {
    try {
      if (!currentUser?.uid || !userRole) return;

      const requests = [];
     
      if (userRole === "driver") {
        const driverRidesQuery = query(
          collection(db, "rides"),
          where("driverId", "==", currentUser.uid)
        );
        const ridesSnapshot = await getDocs(driverRidesQuery);

        for (const ride of ridesSnapshot.docs) {
          const userRideQuery = query(
            collection(db, "userRide"),
            where("tripId", "==", ride.id),
            where("status", "in", ["pending", "accepted"]) 
          );
          const userRideSnapshot = await getDocs(userRideQuery);

          for (const request of userRideSnapshot.docs) {
            const userRef = doc(db, "users", request.data().userId);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
              requests.push({
                ...request.data(),
                id: request.id,
                name: userSnapshot.data().name,
                email: userSnapshot.data().email,
                contact: userSnapshot.data().contact,
                preferences: userSnapshot.data().preferences || [],
                status: request.data().status,
                tripId: ride.id,  // Ensure you have the correct tripId
              });
            }
          }
        }
        setBookingRequests(requests);
      }

      if (userRole === "passenger") {
        const passengerQuery = query(
          collection(db, "userRide"),
          where("userId", "==", currentUser.uid)
        );
        const passengerSnapshot = await getDocs(passengerQuery);

        for (const rideRequest of passengerSnapshot.docs) {
          const tripRef = doc(db, "rides", rideRequest.data().tripId);
          const tripSnapshot = await getDoc(tripRef);

          if (tripSnapshot.exists()) {
            const tripData = {
              ...rideRequest.data(),
              id: rideRequest.id,
              driverName: tripSnapshot.data().driverName,
              driverContact: tripSnapshot.data().driverContact,
              status: rideRequest.data().status,
              tripId: rideRequest.data().tripId,  // Ensure you have the correct tripId
            };
            if (rideRequest.data().status === "accepted") {
              setSelectedProfile(tripData);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching booking requests:", error);
    }
  };

  const fetchCompletedTrips = async () => {
    try {
      if (!currentUser?.uid || !userRole) return;

      const completedTripsData = [];
      if (userRole === "driver") {
        const driverRidesQuery = query(
          collection(db, "rides"),
          where("driverId", "==", currentUser.uid)
        );
        const ridesSnapshot = await getDocs(driverRidesQuery);

        for (const ride of ridesSnapshot.docs) {
          const userRideQuery = query(
            collection(db, "userRide"),
            where("tripId", "==", ride.id),
            where("status", "==", "completed") // Filter for completed trips
          );
        
          const userRideSnapshot = await getDocs(userRideQuery);

          for (const request of userRideSnapshot.docs) {
            const userRef = doc(db, "users", request.data().userId);
            const userSnapshot = await getDoc(userRef);
            if (userSnapshot.exists()) {
              completedTripsData.push({
                ...request.data(),
                id: request.id,
                name: userSnapshot.data().name,
                email: userSnapshot.data().email,
                contact: userSnapshot.data().contact,
                preferences: userSnapshot.data().preferences || [],
                status: request.data().status,
                tripId: ride.id, // Ensure you have the correct tripId for the completed trip
              });
            }
          }
        }
        setCompletedTrips(completedTripsData);
      }

      if (userRole === "passenger") {
        const passengerQuery = query(
          collection(db, "userRide"),
          where("userId", "==", currentUser.uid),
          where("status", "==", "completed") // Filter for completed trips for passengers
        );
        const passengerSnapshot = await getDocs(passengerQuery);

        for (const rideRequest of passengerSnapshot.docs) {
          const tripRef = doc(db, "rides", rideRequest.data().tripId);
          const tripSnapshot = await getDoc(tripRef);

          if (tripSnapshot.exists()) {
            const tripData = {
              ...rideRequest.data(),
              id: rideRequest.id,
              driverName: tripSnapshot.data().driverName,
              driverContact: tripSnapshot.data().driverContact,
              status: rideRequest.data().status,
              tripId: rideRequest.data().tripId,  // Ensure you have the correct tripId for the completed trip
            };
            setCompletedTrips((prevTrips) => [...prevTrips, tripData]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching completed trips:", error);
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      const requestRef = doc(db, "userRide", requestId);
      await updateDoc(requestRef, { status: action });

      if (action === "accepted") {
        const requestSnapshot = await getDoc(requestRef);
        const requestData = requestSnapshot.data();
        const userRef = doc(db, "users", requestData.userId);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          setSelectedProfile({
            ...requestData,
            id: requestId,
            name: userSnapshot.data().name,
            contact: userSnapshot.data().contact,
            preferences: userSnapshot.data().preferences || [],
            tripId: requestData.tripId,  // Ensure tripId is included
          });
        }
      }

      setBookingRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      );
      alert(`Ride request ${action}!`);
    } catch (error) {
      console.error(`Error ${action} ride request:`, error);
    }
  };

  const handleCompleteTrip = async () => {
    try {
      if (selectedProfile?.id) {
        await updateDoc(doc(db, "userRide", selectedProfile.id), {
          status: "completed",
        });
        navigate("/ratings", {
          state: {
            driverId: currentUser.uid,
            userId: selectedProfile.userId,
            tripId: selectedProfile.tripId,  // Pass the correct tripId here
          },
        });
      }
    } catch (error) {
      console.error("Error completing trip:", error);
    }
  };

  const fetchCanceledTrips = async () => {
    try {
      if (!currentUser?.uid || !userRole) return;
  
      const canceledTrips = [];
  
      if (userRole === "driver") {
        const driverQuery = query(
          collection(db, "rides"),
          where("driverId", "==", currentUser.uid)
        );
        const ridesSnapshot = await getDocs(driverQuery);
  
        for (const ride of ridesSnapshot.docs) {
          const userRideQuery = query(
            collection(db, "userRide"),
            where("tripId", "==", ride.id),
            where("status", "==", "canceled")
          );
          const userRideSnapshot = await getDocs(userRideQuery);
  
          userRideSnapshot.forEach((doc) => {
            canceledTrips.push({
              ...doc.data(),
              id: doc.id,
            });
          });
        }
      }
  
      if (userRole === "passenger") {
        const passengerQuery = query(
          collection(db, "userRide"),
          where("userId", "==", currentUser.uid),
          where("status", "==", "canceled")
        );
        const passengerSnapshot = await getDocs(passengerQuery);
  
        passengerSnapshot.forEach((doc) => {
          canceledTrips.push({
            ...doc.data(),
            id: doc.id,
          });
        });
      }
  
      setCanceledTrips(canceledTrips);
    } catch (error) {
      console.error("Error fetching canceled trips:", error);
    }
  };
  
  
  

  const handleCancelTrip = async () => {
    try {
      if (selectedProfile?.id) {
        await updateDoc(doc(db, "userRide", selectedProfile.id), {
          status: "canceled",
        });
        setSelectedProfile(null); // Clear the selected trip details
        alert("Trip has been canceled.");
        fetchBookingRequests();
        fetchCanceledTrips(); // Refresh canceled trips list
      }
    } catch (error) {
      console.error("Error canceling trip:", error);
    }
  };
  

  const handleRateDriver = async (tripId) => {
    try {
      navigate("/rate-driver", {
        state: {
          tripId,  // Ensure the correct tripId is passed here
          passengerId: currentUser.uid,
        },
      });
    } catch (error) {
      console.error("Error navigating to rating page:", error);
    }
  };

  const handleTripRated = async (tripId) => {
    try {
      // Update the ride status to "rated" after the trip has been rated
      const tripRef = doc(db, "userRide", tripId);
      await updateDoc(tripRef, { status: "rated" });

      // Filter out the rated trip from the completed trips list
      setCompletedTrips((prevTrips) =>
        prevTrips.filter((trip) => trip.tripId !== tripId)
      );
    } catch (error) {
      console.error("Error marking trip as rated:", error);
    }
  };

  return (
    <div className="your-rides">
      <h1 className="title">Your Rides</h1>

      {/* Booking Requests Section */}
      <div className="section">
        <h2 className="section-title">Booking Requests</h2>
        {bookingRequests.length > 0 ? (
          bookingRequests.map((request) => (
            <div key={request.id} className="card">
              <p><strong>Passenger:</strong> {request.name}</p>
              <p><strong>Status:</strong> {request.status}</p>
              {request.status === "pending" && (
                <div className="button-group">
                  <button
                    className="btn accept"
                    onClick={() => handleAction(request.id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="btn reject"
                    onClick={() => handleAction(request.id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="placeholder">No booking requests.</p>
        )}
      </div>

      {/* Completed Trips Section */}
      <div className="section">
        <h2 className="section-title">Completed Trips</h2>
        {completedTrips.length > 0 ? (
          completedTrips.map((trip) => (
            <div key={trip.tripId} className="card">
              <p><strong>Driver Name:</strong> {trip.driverName}</p>
              <p><strong>Status:</strong> {trip.status}</p>
              {trip.status !== "rated" && (
                <button
                  className="btn rate"
                  onClick={() => { handleRateDriver(trip.tripId) 
                     handleTripRated(trip.id);}}
                >
                  Rate Driver
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="placeholder">No completed trips.</p>
        )}
      </div>
      
{/* Canceled Trips Section */}
<div className="section">
  <h2 className="section-title">Canceled Trips</h2>
  {canceledTrips.length > 0 ? (
    canceledTrips.map((trip) => (
      <div key={trip.id} className="card">
        <p><strong>Trip ID:</strong> {trip.tripId}</p>
        <p><strong>Status:</strong> {trip.status}</p>
        {trip.driverName && (
          <p><strong>Driver Name:</strong> {trip.driverName}</p>
        )}
      </div>
    ))
  ) : (
    <p className="placeholder">No canceled trips.</p>
  )}
</div>



      {/* Trip Details Section */}
      {selectedProfile && (
        <div className="section trip-details">
          <h2 className="section-title">Trip Details</h2>
          <p><strong>Passenger:</strong> {selectedProfile.name}</p>
          <p><strong>Contact:</strong> {selectedProfile.contact}</p>
          <div className="button-group">
      <button className="btn complete" onClick={handleCompleteTrip}>
        Complete Trip
      </button>
      <button className="btn cancel" onClick={handleCancelTrip}>
        Cancel Trip
      </button>
    </div>
        </div>
      )}
    </div>
  );
}

export default YourRides;

