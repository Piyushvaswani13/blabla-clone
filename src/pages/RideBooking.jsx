// src/pages/RideBooking.jsx

import { useLocation, useNavigate } from 'react-router-dom';
import { useRides } from '../context/RideContext';

function RideBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { rides } = useRides();
  const { ride: rideFromState } = location.state || {};

  // Find ride by ID in case state does not persist
  const ride = rideFromState || rides.find((r) => r.id === location.state?.rideId);

 

  const handleProceedToPayment = () => {
    navigate('/payment', { state: { ride } });
  };

  if (!ride) return <p>No ride selected</p>;

  return (
    <div>
      <h2>Confirm Ride Details</h2>
      <p>From: {ride.source}</p>
      <p>To: {ride.destination}</p>
      <p>Car Model: {ride.carModel}</p>
      <p>Date: {ride.date}</p>
      <button onClick={handleProceedToPayment}>Proceed to Payment</button>
    </div>
  );
}

export default RideBooking;
