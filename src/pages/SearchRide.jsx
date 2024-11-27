// src/pages/SearchRide.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRides } from '../context/RideContext';

function SearchRide({ googleMapsApiKey }) {
  const [source, setSource] = useState('kichha, uttarakhand, india');
  const [destination, setDestination] = useState('delhi, india');
  const [date, setDate] = useState('');
  const [seats, setSeats] = useState(1);
  const { rides, fetchRides } = useRides();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    };

    loadScript(`https://maps.gomaps.pro/maps/api/js?key=${googleMapsApiKey}&libraries=places`)
      .then(() => {
        const autocompleteSource = new window.google.maps.places.Autocomplete(
          document.getElementById('autocomplete-source'),
          { types: ['(cities)'], componentRestrictions: { country: 'IN' } }
        );

        const autocompleteDestination = new window.google.maps.places.Autocomplete(
          document.getElementById('autocomplete-destination'),
          { types: ['(cities)'], componentRestrictions: { country: 'IN' } }
        );

        autocompleteSource.addListener('place_changed', () => {
          const place = autocompleteSource.getPlace();
          setSource(place.formatted_address);
        });

        autocompleteDestination.addListener('place_changed', () => {
          const place = autocompleteDestination.getPlace();
          setDestination(place.formatted_address);
        });
      });
  }, [googleMapsApiKey]);

  const handleSearch = () => {
    const normalizedSource = source.trim().toLowerCase();
    const normalizedDestination = destination.trim().toLowerCase();
    const normalizedDate = date; // Assuming date format is correct (YYYY-MM-DD)
    const seatCount = parseInt(seats, 10); // Convert to integer

    console.log("Normalized Search Criteria:", normalizedSource, normalizedDestination, normalizedDate, seatCount);

    const filteredRides = rides.filter((ride) => {
      const rideSource = ride.source.trim().toLowerCase();
      const rideDestination = ride.destination.trim().toLowerCase();
      const rideDate = ride.date; // Assuming date is string format (YYYY-MM-DD)
      const rideSeats = ride.seats; // Assuming seats is a number

      console.log("Comparing Ride:", rideSource, rideDestination, rideDate, rideSeats); // Log for debugging

      return (
        rideSource === normalizedSource &&
        rideDestination === normalizedDestination &&
        rideDate === normalizedDate &&
        rideSeats >= seatCount // Check if seats are enough
      );
    });

    console.log("Filtered Results:", filteredRides); // Log filtered results to check

    if (filteredRides.length > 0) {
      navigate('/available-rides', { state: { results: filteredRides } });
    } else {
      alert("No rides found matching your search criteria.");
    }
  };

  return (
    <div>
      <h2>Search for a Ride</h2>
      <input
        id="autocomplete-source"
        type="text"
        placeholder="Enter source"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        style={{ width: '100%', height: '40px', margin: '10px 0' }}
      />
      <input
        id="autocomplete-destination"
        type="text"
        placeholder="Enter destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        style={{ width: '100%', height: '40px', margin: '10px 0' }}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="number"
        placeholder="Seats"
        value={seats}
        onChange={(e) => setSeats(e.target.value)}
        min="1"
      />
      <button onClick={handleSearch}>Search Ride</button>
    </div>
  );
}

export default SearchRide;
