// src/components/MapComponent.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';

function MapComponent({ googleMapsApiKey, source, destination }) {
  const [directions, setDirections] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Function to load directions when source and destination are provided
  const calculateRoute = useCallback(() => {
    if (isLoaded && source && destination) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: new window.google.maps.LatLng(source.lat, source.lng),
          destination: new window.google.maps.LatLng(destination.lat, destination.lng),
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Error fetching directions: ${status}`);
            setDirections(null); // Clear directions on error
          }
        }
      );
    }
  }, [isLoaded, source, destination]);

  // Effect to calculate route whenever source or destination changes
  useEffect(() => {
    if (isLoaded) {
      calculateRoute();
    }
  }, [isLoaded, source, destination, calculateRoute]);

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey} onLoad={() => setIsLoaded(true)}>
      <div>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '400px' }}
          zoom={10}
          center={source.lat && source.lng ? { lat: source.lat, lng: source.lng } : { lat: -34.397, lng: 150.644 }} // Default center if source is not provided
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>
    </LoadScript>
  );
}

export default MapComponent;
