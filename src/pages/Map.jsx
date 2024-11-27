// src/components/Map.jsx
import React, { useRef, useState } from 'react';
import { GoogleMap, LoadScript, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';
import './Map.css';

const libraries = ['places']; // Needed for Autocomplete
const mapContainerStyle = { width: '100%', height: '400px' };

function Map({ googleMapsApiKey }) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [directions, setDirections] = useState(null);
  const sourceRef = useRef(null);
  const destinationRef = useRef(null);

  const handleSearch = () => {
    if (sourceRef.current && destinationRef.current) {
      const origin = sourceRef.current.getPlace().geometry.location;
      const dest = destinationRef.current.getPlace().geometry.location;
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin,
          destination: dest,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Error fetching directions ${result}`);
          }
        }
      );
    }
  };

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Autocomplete onLoad={(ref) => (sourceRef.current = ref)} onPlaceChanged={() => setSource(sourceRef.current.getPlace().formatted_address)}>
          <input type="text" placeholder="Source" value={source} onChange={(e) => setSource(e.target.value)} />
        </Autocomplete>

        <Autocomplete onLoad={(ref) => (destinationRef.current = ref)} onPlaceChanged={() => setDestination(destinationRef.current.getPlace().formatted_address)}>
          <input type="text" placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
        </Autocomplete>

        <button onClick={handleSearch}>Get Route</button>

        <GoogleMap mapContainerStyle={mapContainerStyle} center={{ lat: 40.748817, lng: -73.985428 }} zoom={13}>
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>
    </LoadScript>
  );
}

export default Map;
