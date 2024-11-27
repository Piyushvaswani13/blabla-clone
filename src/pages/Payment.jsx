// src/pages/Payment.jsx
import React from 'react';
import {  useNavigate } from 'react-router-dom';

function Payment() {
  // const { rideId } = useParams(); // Get rideId from route parameters
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Fetch payment details or perform any actions needed with the rideId
  //   console.log("Ride ID for payment:", rideId);
  // }, [rideId]);

  const handlePayment = () => {
    // Perform payment process or navigate to a success page
    console.log('Proceeding to Payment for Ride');
    alert('Payment successful!');
    navigate('/your-rides'); // Navigate to Your Rides page or a confirmation page
  };

  return (
    <div>
      <h2>Payment Page</h2>
      <p>Processing payment for ride.........</p>
      <button onClick={handlePayment}>
        Proceed to Payment
      </button>
    </div>
  );
}

export default Payment;
