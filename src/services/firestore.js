// src/services/firestore.js
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export const createRide = async (rideDetails) => {
  try {
    const docRef = await addDoc(collection(db, 'rides'), rideDetails);
    return docRef.id;
  } catch (error) {
    console.error("Error creating ride: ", error);
  }
};

export const searchRides = async (source, destination, date) => {
  const ridesRef = collection(db, 'rides');
  const q = query(ridesRef, where('source', '==', source), where('destination', '==', destination), where('date', '==', date));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
};

// Get user's rides
export const getUserRides = async (userId) => {
  const userRidesRef = collection(db, 'rides');
  const q = query(userRidesRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
};
