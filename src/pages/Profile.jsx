// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import './Profile.css';

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
    
    <div className="profile-container">
       <img src="/BlaBlaCar.png" alt="Logo" className="logo" />
      <div className="profile-card">
        <h2 className="profile-heading">Your Profile</h2>
        <div className="profile-info">
          <p>
            <strong>Name:</strong> {userInfo.name}
          </p>
          <p>
            <strong>Email:</strong> {userInfo.email}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
