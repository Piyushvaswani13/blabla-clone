import React, { useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import {  useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();  
  useEffect(() => {
    async function fetchUserData() {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        setUserInfo(userDoc.data());
      }
    }
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();  // Sign out the user
      navigate('/');  // Redirect to the dashboard page after sign out
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };
  return (
    <div className="profile-container">
      <img src="/profile.png" alt="Profile" className="profile-image" />
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
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
}

export default Profile;
