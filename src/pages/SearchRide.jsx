import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRides } from '../context/RideContext';
import MapComponent from '../components/MapComponent';

function SearchRide({ googleMapsApiKey }) {
  const [source, setSource] = useState('Kichha, Uttarakhand, India');
  const [destination, setDestination] = useState('Delhi, India');
  const [sourceLat, setSourceLat] = useState(28.9115087);
  const [sourceLng, setSourceLng] = useState(79.5153705);
  const [destinationLat, setDestinationLat] = useState(28.7040592);
  const [destinationLng, setDestinationLng] = useState(77.10249019999999);
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
          setSourceLat(place.geometry.location.lat());
          setSourceLng(place.geometry.location.lng());
        });

        autocompleteDestination.addListener('place_changed', () => {
          const place = autocompleteDestination.getPlace();
          setDestination(place.formatted_address);   

          setDestinationLat(place.geometry.location.lat());
          setDestinationLng(place.geometry.location.lng());
        });
      });
  }, [googleMapsApiKey]);

  const handleSearch = async () => {
   

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371e3; // meters (Earth's radius)
      const φ1 = toRadians(lat1);
      const φ2 = toRadians(lat2);
      const Δφ = φ2 - φ1;
      const λ1 = toRadians(lon1);
      const λ2 = toRadians(lon2);
      const Δλ = λ2 - λ1;

      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return Math.round(R * c); // Distance in meters, round to nearest meter
    };

    const toRadians = (degrees) => degrees * Math.PI / 180;

  
    const nearbyRides = [];
    const thresholdDistance = 50000; // 50 km in meters (adjust as needed)

    for (const ride of rides) {
      const distanceToRideSource = calculateDistance(
        sourceLat, sourceLng, ride.sourceLat, ride.sourceLng
      );
      const distanceToRideDest = calculateDistance(
        destinationLat, destinationLng, ride.destinationLat, ride.destinationLng
      );

      if (distanceToRideSource <= thresholdDistance || distanceToRideDest <= thresholdDistance) {
        nearbyRides.push(ride);
      }
    }

    if (nearbyRides.length > 0) {
      navigate('/available-rides', { state: { results: nearbyRides,sourceLat,sourceLng,destinationLat,destinationLng } });
    } else {
      alert('No rides found matching your search criteria and nearby locations.');
    }
    
  <MapComponent
  googleMapsApiKey={googleMapsApiKey}
  sourceLat={sourceLat}
  sourceLng={sourceLng}
  destinationLat={destinationLat}
  destinationLng={destinationLng}
/>

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