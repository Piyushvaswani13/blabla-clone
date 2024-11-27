// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

function Profile() {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    async function fetchUserData() {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        setUserInfo(userDoc.data());
      }
    }
    fetchUserData();
  }, []);

  return (
    <div>
      <h2>Your Profile</h2>
      <p>Name: {userInfo.name}</p>
      <p>Email: {userInfo.email}</p>
    </div>
  );
}

export default Profile;
