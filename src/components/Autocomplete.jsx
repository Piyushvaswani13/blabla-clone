// src/components/Autocomplete.jsx
import React, { useEffect, useState } from 'react';

const Autocomplete = ({ onPlaceSelected }) => {
  const [autocomplete, setAutocomplete] = useState(null);
  
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google) {
        initAutocomplete();
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.gomaps.pro/maps/api/js?key=YOUR_API_KEY&libraries=places`;
        script.onload = initAutocomplete;
        document.body.appendChild(script);
      }
    };

    const initAutocomplete = () => {
      const input = document.getElementById('autocomplete');
      const options = {
        // Your options here
      };
      const newAutocomplete = new window.google.maps.places.Autocomplete(input, options);
      newAutocomplete.addListener('place_changed', () => {
        const place = newAutocomplete.getPlace();
        if (place && place.geometry) {
          onPlaceSelected(place);
        }
      });
      setAutocomplete(newAutocomplete);
    };

    loadGoogleMapsScript();
  }, [onPlaceSelected]);

  return (
    <input id="autocomplete" type="text" placeholder="Enter a location" />
  );
};

export default Autocomplete;
