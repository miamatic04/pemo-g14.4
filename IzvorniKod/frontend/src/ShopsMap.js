import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, MarkerF, InfoWindow } from '@react-google-maps/api';

const ShopsMap = () => {
  const [locations, setLocations] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Fetch shop data from /getShops
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getMarkerInfo`); // Replace with your API endpoint
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

  return (
      <div style={{ height: "900px", width: "100%" }}>
        <LoadScript googleMapsApiKey="AIzaSyBf-Vi6_kp1obZy5Oklf0j2V86V8XXGx2U">
          <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              zoom={12}
              center={{ lat: 45.815399, lng: 15.966568 }} // Default center to your preferred location
          >
            {locations.map((location, index) => (
                <MarkerF
                    key={index}
                    position={{ lat: location.latitude, lng: location.longitude }}
                    onClick={() => setSelectedMarker(location)} // Show info window on click
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
                      <InfoWindow
                          position={{ lat: location.latitude, lng: location.longitude }}
                          onCloseClick={() => setSelectedMarker(null)}
                      >
                        <div>{location.shopName}</div>
                      </InfoWindow>
                  )}
                </MarkerF>
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
  );
};

export default ShopsMap;
