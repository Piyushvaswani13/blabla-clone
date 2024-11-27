// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Blabla Ride Sharing</h1>
      <p>Find and book a ride or offer one to others!</p>
      <Link to="/publish-ride" className="home-link">Publish a Ride</Link>
      <Link to="/search-ride" className="home-link">Search for a Ride</Link>
      <Link to="/profile" className="home-link">Profile</Link>
      <Link to="/your-rides" className="home-link">Your Rides</Link>
    </div>
  );
}

export default Home;
