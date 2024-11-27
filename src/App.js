// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MapComponent from './components/MapComponent'; 
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import SearchRide from './pages/SearchRide';
import PublishRide from './pages/PublishRide';
import RideBooking from './pages/RideBooking';
import NotificationsPage from './pages/NotificationsPage';
import Payment from './pages/Payment';
import YourRides from './pages/YourRides';
import AvailableRidesPage from './pages/AvailableRidesPage';
import Dashboard from './pages/Dashboard';
import { RideProvider } from './context/RideContext'; 

function App() {
  const [source, setSource] = useState({ lat: null, lng: null, address: '' });
  const [destination, setDestination] = useState({ lat: null, lng: null, address: '' });
  const googleMapsApiKey = "AlzaSyWFPE_9dvDHUYTj1KknvlTwA9C1_fSbSPB"; 
  return (
    <Router>
       <RideProvider> 
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search-ride" element={<SearchRide googleMapsApiKey={googleMapsApiKey} />} />
       
        <Route path="/publish-ride" element={
          <div>
            <PublishRide setSource={setSource} setDestination={setDestination} googleMapsApiKey={googleMapsApiKey} />
            {source.lat && destination.lat && (
              <MapComponent source={source} destination={destination} googleMapsApiKey={googleMapsApiKey} />
            )}
          </div>
        } />
        <Route path="/ride-booking/:rideId" element={<RideBooking />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/payment/:rideId" element={<Payment />} />
        <Route path="/your-rides" element={<YourRides />} />
        <Route path="/available-rides" element={<AvailableRidesPage />} />

      </Routes>
      </RideProvider> 
    </Router>
  );
}

export default App;
