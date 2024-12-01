import React, { useEffect, useState } from "react";
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

function YourRides() {
  const { currentUser } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  // const [isTripAccepted, setIsTripAccepted] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchUserRole();
    }
  }, [currentUser]);

  useEffect(() => {
    if (userRole) {
      fetchBookingRequests();
    }
  }, [userRole]);

  const fetchUserRole = async () => {
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        console.log("User Role:", userData.role);
        setUserRole(userData.role);
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
            where("tripId", "==", ride.id)
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
                prefrences: userSnapshot.data().prefrences || [],
                status: request.data().status,
              });
            }
          }
        }
        setBookingRequests(requests);
        console.log("Driver Booking Requests:", requests);
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
            };
  
            // Update only if it matches the 'accepted' status
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
  

  const handleAccept = async (requestId) => {
    try {
      const requestRef = doc(db, "userRide", requestId);
      await updateDoc(requestRef, { status: "accepted" });

      const requestSnapshot = await getDoc(requestRef);

      if (requestSnapshot.exists()) {
        const requestData = requestSnapshot.data();

        const userRef = doc(db, "users", requestData.userId);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const passengerDetails = {
            ...requestData,
            id: requestId,
            name: userSnapshot.data().name,
            contact: userSnapshot.data().contact,
            prefrences: userSnapshot.data().prefrences || [],
          };

          setSelectedProfile(passengerDetails);
          // setIsTripAccepted(true);

          setBookingRequests((prev) =>
            prev.filter((request) => request.id !== requestId)
          );

          alert("Ride request accepted!");
        }
      }
    } catch (error) {
      console.error("Error accepting ride request:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const requestRef = doc(db, "userRide", requestId);
      await updateDoc(requestRef, { status: "rejected" });

      setBookingRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      );
      alert("Ride request rejected!");
    } catch (error) {
      console.error("Error rejecting ride request:", error);
    }
  };

  const handleCancelTrip = async () => {
    try {
      if (selectedProfile?.id) {
        const requestRef = doc(db, "userRide", selectedProfile.id);
        await updateDoc(requestRef, { status: "cancelled" });

        setSelectedProfile((prev) => ({ ...prev, status: "cancelled" }));
        alert("Trip cancelled successfully!");
      }
    } catch (error) {
      console.error("Error cancelling trip:", error);
    }
  };

  return (
    <div>
      <h2>Your Rides</h2>

      {selectedProfile?.status === "cancelled" && (
        <p style={{ color: "red", fontWeight: "bold" }}>Trip Cancelled</p>
      )}

      {selectedProfile && selectedProfile.status === "accepted" && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ddd",
          }}
        >
          {userRole === "driver" ? (
            <>
              <h3>Passenger Details</h3>
              <p>
                <strong>Name:</strong> {selectedProfile.name}
              </p>
              <p>
                <strong>Contact:</strong> {selectedProfile.contact}
              </p>
              <p>
                <strong>Preferences:</strong>{" "}
                {selectedProfile.prefrences.join(", ") || "No preferences set"}
              </p>
            </>
          ) : (
            <>
              <h3>Trip Details</h3>
              <p>
                <strong>Driver Name:</strong> {selectedProfile.driverName}
              </p>
              <p>
                <strong>Contact:</strong> {selectedProfile.driverContact}
              </p>
              <p>
                <strong>Preferences:</strong>{" "}
                {selectedProfile.prefrences &&
                selectedProfile.prefrences.length > 0
                  ? selectedProfile.prefrences.join(", ")
                  : "No preferences set"}
              </p>
            </>
          )}
          <button
            onClick={handleCancelTrip}
            style={{ color: "white", backgroundColor: "red" }}
          >
            Cancel Trip
          </button>
        </div>
      )}

      {userRole === "driver" &&
        bookingRequests.length > 0 &&
        bookingRequests.map((request) => (
          <div
            key={request.id}
            style={{
              marginBottom: "20px",
              padding: "10px",
              border: "1px solid #ddd",
            }}
          >
            <p>
              <strong>Name:</strong> {request.name}
            </p>
            <p>
              <strong>Email:</strong> {request.email}
            </p>
            <button
              onClick={() => handleAccept(request.id)}
              style={{
                marginRight: "10px",
                color: "white",
                backgroundColor: "green",
              }}
            >
              Accept
            </button>
            <button
              onClick={() => handleReject(request.id)}
              style={{ color: "white", backgroundColor: "red" }}
            >
              Reject
            </button>
          </div>
        ))}

      {(!selectedProfile && bookingRequests.length === 0) && (
        <p>No rides or requests found.</p>
      )}
    </div>
  );
}

export default YourRides;
