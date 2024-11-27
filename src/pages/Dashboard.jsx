// src/pages/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Import CSS file for styling

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1>Welcome to the Ride Sharing App</h1>
      <div className="button-container">
        <Link to="/login" className="button">Login</Link>
        <Link to="/signup" className="button">Signup</Link>
      </div>
    </div>
  );
}

export default Dashboard;
