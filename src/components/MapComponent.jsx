import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';

function MapComponent({ googleMapsApiKey, sourceLat, sourceLng, destinationLat, destinationLng }) {
  const [directions, setDirections] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const directionsService = new window.google.maps.DirectionsService();
    const request = {
      origin: new window.google.maps.LatLng(sourceLat, sourceLng),
      destination: new window.google.maps.LatLng(destinationLat, destinationLng),
      travelMode: window.google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        setDirections(result);
      } else {
        console.error(`Error fetching directions: ${status}`);
      }
    });
  }, [isLoaded,sourceLat, sourceLng, destinationLat, destinationLng]);

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey} onLoad={() => setIsLoaded(true)}>
      <div>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '400px' }}
          zoom={10}
          center={{ lat: sourceLat, lng: sourceLng }} // Default center to source location
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>
    </LoadScript>
  );
}

export default MapComponent;