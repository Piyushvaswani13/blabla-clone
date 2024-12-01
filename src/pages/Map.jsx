import React, { useState } from 'react';
import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import './Map.css';

const mapContainerStyle = { width: '100%', height: '400px' };

function Map({ sourceLat, sourceLng, destinationLat, destinationLng }) {
  const [directions, setDirections] = useState(null);

  const handleMapLoad = (map) => {
    if (window.google && window.google.maps) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: { lat: sourceLat, lng: sourceLng },
          destination: { lat: destinationLat, lng: destinationLng },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    } else {
      console.error('Google Maps API is not loaded');
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={{ lat: sourceLat, lng: sourceLng }}
      zoom={10}
      onLoad={handleMapLoad}
    >
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
}

export default Map;
