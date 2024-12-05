import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="header-text">
        <img src="/BlaBlaCar.png" alt="Logo" className="logos" />
     
     
        <h1>Welcome to Blabla Ride Sharing</h1>
        
      </div>
      <p className="para">Find and book a ride or offer one to others!</p>
      <div className="link-container">
        <Link to="/publish-ride" className="home-link">Publish a Ride</Link>
        <Link to="/search-ride" className="home-link">Search for a Ride</Link>
        <Link to="/profile" className="home-link">Profile</Link>
        <Link to="/your-rides" className="home-link">Your Rides</Link>
      </div>
    </div>
  );
}

export default Home;
