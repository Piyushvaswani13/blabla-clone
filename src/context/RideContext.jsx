// src/context/RideContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { db, realTimeDb } from "../services/firebase";
import { collection, addDoc, getDocs, doc,updateDoc } from "firebase/firestore";
import { ref, push, onValue, update, off } from "firebase/database";
import { useAuth } from "./AuthContext";

const RideContext = createContext();

export function RideProvider({ children }) {
  const { currentUser } = useAuth();
  const [rides, setRides] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Publish a ride to Firestore
  const publishRide = async (rideDetails) => {
    try {
      const docRef = await addDoc(collection(db, "rides"), rideDetails);
      console.log("Ride published with ID: ", docRef.id);
      fetchRides(); // Refresh rides after publishing a new one
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  //add ride req
  const addRideRequest = async (userRide) => {
    try {
      const docRef = await addDoc(collection(db, "userRide"), userRide);
      console.log("Ride added with ID: ", docRef.id);
      
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // Send a notification to the Realtime Database
  const sendNotification = (notification) => {
    if (currentUser?.uid) {
      push(ref(realTimeDb, `notifications/${currentUser.uid}`), notification);
    } else {
      console.error("Driver ID (currentUser) is not available.");
    }
  };

  // Fetch rides from Firestore
// Fetch rides from Firestore with added console logging
const fetchRides = useCallback(async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "rides"));
    const fetchedRides = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
  
    
    setRides(fetchedRides); // Update state with fetched data
  } catch (error) {
    console.error("Error fetching rides: ", error);
  }
}, []);


  // Fetch notifications from Realtime Database
  const fetchNotifications = useCallback(() => {
    if (currentUser?.uid) {
      const notificationsRef = ref(realTimeDb, `notifications/${currentUser.uid}`);
      
      onValue(notificationsRef, (snapshot) => {
        const notificationsData = snapshot.val();
        const fetchedNotifications = notificationsData
          ? Object.keys(notificationsData).map((key) => ({
              id: key,
              ...notificationsData[key],
            }))
          : [];
        setNotifications(fetchedNotifications);
      });

      // Cleanup listener on unmount
      return () => off(notificationsRef);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchRides(); // Fetch rides whenever the context mounts or user logs in
      fetchNotifications(); // Fetch notifications for the current user
    }
  }, [currentUser, fetchNotifications, fetchRides]);

  // Update the notification status
  const updateNotificationStatus = (notificationId, status) => {
    if (currentUser?.uid) {
      const notificationRef = ref(realTimeDb, `notifications/${currentUser.uid}/${notificationId}`);
      update(notificationRef, { status });
    }
  };

  //
  // Fetch ride requests for the publisher
const fetchRideRequests = async () => {
  if (currentUser?.uid) {
    try {
      const querySnapshot = await getDocs(collection(db, "userRide"));
      const fetchedRequests = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((request) => request.publisherId === currentUser.uid);
      return fetchedRequests;
    } catch (error) {
      console.error("Error fetching ride requests:", error);
      return [];
    }
  }
};

// Update ride request status
const updateRideRequestStatus = async (requestId, newStatus) => {
  try {
    const requestRef = doc(db, "userRide", requestId);
    await updateDoc(requestRef, { status: newStatus });
    console.log(`Request ${requestId} status updated to ${newStatus}`);
  } catch (error) {
    console.error("Error updating request status:", error);
  }
};


  return (
    <RideContext.Provider
      value={{
        rides,
        notifications,
       
        publishRide,
        sendNotification,
        fetchRides,
        fetchNotifications,
        updateNotificationStatus,
        addRideRequest,
        fetchRideRequests,
        updateRideRequestStatus,
      }}
    >
      {children}
    </RideContext.Provider>
  );
}

export const useRides = () => useContext(RideContext);
