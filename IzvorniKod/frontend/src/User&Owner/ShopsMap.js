import React, { useState, useEffect } from 'react';
import {GoogleMap, LoadScript, MarkerF, InfoWindow, InfoWindowF} from '@react-google-maps/api';

const ShopsMap = () => {
  const [locations, setLocations] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 45.815399, lng: 15.966568 }); // Default center

  // Fetch shop data from /getShops
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getMarkerInfo`);
        if (!response.ok) {
          throw new Error('Failed to fetch shops data');
        }
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
    };

    fetchShops();
  }, []);

  const handleMarkerClick = (location) => {
    if (selectedMarker === location) {
      setSelectedMarker(null); // Deselect if the same marker is clicked
    } else {
      setSelectedMarker(location); // Select the clicked marker
      setMapCenter({ lat: location.latitude, lng: location.longitude }); // Center map on selected marker
    }
  };

  return (
      <div style={{ height: "900px", width: "100%" }}>
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
          <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              zoom={13}
              center={mapCenter} // Set map center dynamically based on selected marker
          >
            {locations.map((location, index) => (
                <MarkerF
                    key={index}
                    position={{ lat: location.latitude, lng: location.longitude }}
                    onClick={() => handleMarkerClick(location)} // Open info window on click
                    label={{
                      text: location.name,
                      fontSize: "16px",
                      color: "black", // Black text color
                      fontWeight: "bold",
                      padding: "5px",
                      position: { lat: location.latitude + 0.01, lng: location.longitude }, // Adjust position below the marker
                    }}
                >
                  {selectedMarker === location && (
                      <InfoWindowF
                          position={{ lat: location.latitude, lng: location.longitude }}
                          onCloseClick={() => setSelectedMarker(null)} // Close info window when closed
                      >
                        <div>
                          <h3>{location.shopName}</h3>
                          {location.imagePath && (
                              <img
                                  src={`${location.imagePath}`}
                                  alt={location.shopName}
                                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                              />
                          )}
                          <p>{location.description}</p>
                        </div>
                      </InfoWindowF>
                  )}
                </MarkerF>
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
  );
};

export default ShopsMap;
