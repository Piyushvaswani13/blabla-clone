// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state to handle async operations

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch user-specific data from Firestore
          const userDocRef = doc(db, "users", user.uid); // Assuming users collection
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            // Combine Auth user and Firestore user data
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              ...userDoc.data(), // Add additional fields from Firestore (e.g., role)
            });
          } else {
            console.error("No Firestore document found for user.");
            setCurrentUser(user); // Fall back to Auth user if Firestore data is missing
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
          setCurrentUser(user); // Fall back to Auth user on error
        }
      } else {
        setCurrentUser(null); // No user is signed in
      }
      setLoading(false); // Set loading to false after async operations
    });

    return unsubscribe; // Cleanup the listener
  }, []);

  function logout() {
    return signOut(auth);
  }

  const value = { currentUser, logout, loading }; // Include loading state in context
  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children only when not loading */}
    </AuthContext.Provider>
  );
}
