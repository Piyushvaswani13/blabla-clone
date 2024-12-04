import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Map from './pages/Map';
import MapComponent from './components/MapComponent'; // MapComponent for handling maps and directions
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
import RatingsPage from './pages/RatingsPage';
import AvailableRidesPage from './pages/AvailableRidesPage';
import Dashboard from './pages/Dashboard';
import { RideProvider } from './context/RideContext';
import { LoadScript } from '@react-google-maps/api';
import RateDriver from './pages/RateDriver';

function App() {
  const [source, setSource] = useState({ lat: null, lng: null, address: '' });
  const [destination, setDestination] = useState({ lat: null, lng: null, address: '' });

  const googleMapsApiKey = "AlzaSyCfIZ_pMopID6nYkLALRIaWoXGuKb8esJq"; // Replace with a valid key

  return (
    
       <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={['places']}>
      <RideProvider>
      <Router>
        <Routes>
          {/* Core Pages */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />

          {/* Search Ride */}
          <Route
            path="/search-ride"
            element={
              <div>
                <SearchRide 
               
                  googleMapsApiKey={googleMapsApiKey}
                  source={source}
                  destination={destination}
                  />
              </div>
            }
          />

          {/* Publish Ride */}
          <Route
            path="/publish-ride"
            element={
              <div>
                <PublishRide
                  setSource={setSource}
                  setDestination={setDestination}
                  googleMapsApiKey={googleMapsApiKey}
                />
                {source.lat && destination.lat && (
                  <MapComponent
                    googleMapsApiKey={googleMapsApiKey}
                    source={source}
                    destination={destination}
                  />
                )}
              </div>
            }
          />

          {/* Other Routes */}
          <Route path="/ride-booking/:rideId" element={<RideBooking />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/payment/:rideId" element={<Payment />} />
          <Route path="/your-rides" element={<YourRides />} />
          <Route path="/ratings" element={<RatingsPage />} />
          <Route path="/rate-driver" element={<RateDriver />} />
          <Route path="/available-rides" element={<AvailableRidesPage />} />
          <Route path="/map-view/:sourceLat/:sourceLng/:destinationLat/:destinationLng" element={<Map />} />
        </Routes>
        </Router>
      </RideProvider>
      </LoadScript>
   
  );
}

export default App;
