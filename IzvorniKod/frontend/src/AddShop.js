import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';

const AddShop = () => {

    const [shopName, setShopName] = useState('');
    const [file, setFile] = useState(null);
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [description, setDescription] = useState(null);
    const [authenticationTried, setAuthenticationTried] = useState(false);

    const mapRef = useRef(null);
    const markerRef = useRef(null);

    const navigate = useNavigate();

    const checkTokenValidation = async () => {
        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/validateToken`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok || !(localStorage.getItem("role") === "owner")) {
                if(localStorage.getItem("role") === "user")
                    navigate("/userhome");
                else if(localStorage.getItem("role") === "mod")
                    navigate("/modhome");
                else if(localStorage.getItem("role")=== "admin")
                    navigate("/adminhome");
                else
                    navigate("/");
            }

        } catch (error) {
            console.log(error);
            navigate("/");
        }
    };

    useEffect(() => {
        if(!authenticationTried) {
            setAuthenticationTried(true);
            checkTokenValidation();
        }
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleMapClick = (e) => {
        setLocation({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        });
    };

    useEffect(() => {
        // If location is updated, add the marker to the map
        if (location.lat && location.lng && mapRef.current) {
            // Create the marker element
            const marker = new window.google.maps.Marker({
                position: { lat: location.lat, lng: location.lng },
                map: mapRef.current, // Add the marker to the map
            });

            // Store the marker in the ref so we can access it later if needed
            markerRef.current = marker;

            // Update the map center to the marker's position
            mapRef.current.setCenter({ lat: location.lat, lng: location.lng });
        }
    }, [location]); // Run this effect when location changes

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!shopName || !file || !location.lat || !location.lng) {
            alert('Please fill in all fields and select a location.');
            return;
        }

        const formData = new FormData();
        formData.append('shopName', shopName);
        formData.append('file', file);
        formData.append('latitude', location.lat);
        formData.append('longitude', location.lng);
        formData.append('description', description);

        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/addShop`, {
                method: 'POST',
                body: formData,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if(response.ok) {
                alert('Shop created successfully');
                navigate("../myShops");
            }
            else
                alert('Failed to create shop.');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create shop.');
        }
    };

    return (
        <div className="shop-creator">
            <h1>Registriraj trgovinu</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="shopName">Naziv trgovine:</label>
                    <input
                        id="shopName"
                        type="text"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        required
                        placeholder="Unesite ime trgovine"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Opis trgovine:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        placeholder="Opišite svoju trgovinu"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="shopImage">Dodajte sliku trgovine:</label>
                    <input
                        id="shopImage"
                        type="file"
                        onChange={handleFileChange}
                        required
                        accept="image/*"
                    />
                </div>

                <div className="form-group">
                    <label>Lokacija:</label>
                    <div className="map-container">
                        <LoadScript googleMapsApiKey="AIzaSyC7uHI1oQLBtcgG_wpxtQ6D_-CyPmGtXS4">
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '300px' }}
                                center={{ lat: 0, lng: 0 }}
                                zoom={2}
                                onClick={handleMapClick}
                                onLoad={(map) => {
                                    mapRef.current = map;
                                }}
                            >
                                {location.lat !== 0 && location.lng !== 0 && (
                                    <Marker position={location} />
                                )}
                            </GoogleMap>
                        </LoadScript>
                    </div>
                    {location.lat !== 0 && location.lng !== 0 && (
                        <p className="selected-location">
                            Selected: {location.lat}, {location.lng}
                        </p>
                    )}
                </div>

                <button type="submit" className="submit-button">Predaj registraciju</button>
            </form>

            {/* Back Button */}
            <a href="../myShops" className="back-button">
                Natrag na popis trgovina
            </a>

            <style jsx>{`
                .shop-creator {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }

                h1 {
                    text-align: center;
                    color: #333;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                }

                input[type="text"],
                textarea,
                input[type="file"] {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 16px;
                }

                textarea {
                    height: 100px;
                    resize: vertical;
                }

                .map-container {
                    margin-top: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    overflow: hidden;
                }

                .selected-location {
                    margin-top: 10px;
                    font-size: 14px;
                    color: #666;
                }

                .submit-button {
                    display: block;
                    width: 100%;
                    padding: 10px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .submit-button:hover {
                    background-color: #45a049;
                }
                
                textarea {
                    font-family: Arial, sans-serif;
                }

                /* Back Button Styles */
                .back-button {
                    display: block;
                    width: 100%;
                    padding: 10px;
                    background-color: #f44336;
                    color: white;
                    text-align: center;
                    text-decoration: none;
                    border: none;
                    border-radius: 4px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    margin-top: 20px; /* Add some space above the back button */
                    font-family: Arial, sans-serif;
                }

                .back-button:hover {
                    background-color: #e53935;
                }
            `}</style>
        </div>
    );
};

export default AddShop;