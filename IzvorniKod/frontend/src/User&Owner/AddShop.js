import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import '../stilovi/addShops.css';

const AddShop = () => {
    const [shopName, setShopName] = useState('');
    const [file, setFile] = useState(null);
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [description, setDescription] = useState(null);
    const [kvart, setKvart] = useState('');
    const [authenticationTried, setAuthenticationTried] = useState(false);

    const mapRef = useRef(null);
    const markerRef = useRef(null); // Store marker reference to update/remove it

    const navigate = useNavigate();

    const checkTokenValidation = async () => {
        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/validateToken`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok || !(localStorage.getItem('role') === 'owner')) {
                if (localStorage.getItem('role') === 'user') navigate('/userhome');
                else if (localStorage.getItem('role') === 'mod') navigate('/modhome');
                else if (localStorage.getItem('role') === 'admin') navigate('/adminhome');
                else navigate('/');
            }
        } catch (error) {
            console.log(error);
            navigate('/');
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleMapClick = (e) => {
        const newLocation = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        };

        setLocation(newLocation);

        // Ensure only one marker is placed by updating/removing old marker
        if (markerRef.current) {
            markerRef.current.setMap(null); // Remove old marker
        }

        const marker = new window.google.maps.Marker({
            position: newLocation,
            map: mapRef.current,
        });

        markerRef.current = marker; // Store reference to the new marker
        mapRef.current.setCenter(newLocation); // Center map on new location
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!shopName || !file || !location.lat || !location.lng || !kvart) {
            alert('Please fill in all fields and select a location.');
            return;
        }

        const formData = new FormData();
        formData.append('shopName', shopName);
        formData.append('file', file);
        formData.append('latitude', location.lat);
        formData.append('longitude', location.lng);
        formData.append('description', description);
        formData.append('hood', kvart);

        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/addShop`, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                alert('Shop created successfully');
                navigate('../myShops');
            } else alert('Failed to create shop.');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create shop.');
        }
    };

    return (
        <div className="pozadina1">
            <div className="shop-creator">
                <h1 className="registrirajTrgovinu">Registriraj trgovinu</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="shopName">Naziv trgovine:</label>
                        <input
                            className="unosZaTrgovinu"
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
                        <label htmlFor="hood">Odaberite kvart:</label>
                        <select
                            id="hood"
                            value={kvart}
                            onChange={(e) => setKvart(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Odaberite kvart
                            </option>
                            {/* List of neighborhoods */}
                            <option value="GORNJI_GRAD">Gornji Grad</option>
                            <option value="DONJI_GRAD">Donji Grad</option>
                            <option value="KAPTOL">Kaptol</option>
                            <option value="MEDVESCAK">Medveščak</option>
                            <option value="TRESNJEVKA_SJEVER">Trešnjevka - Sjever</option>
                            <option value="TRESNJEVKA_JUG">Trešnjevka - Jug</option>
                            <option value="JARUN">Jarun</option>
                            <option value="PRECKO">Prečko</option>
                            <option value="VRBANI">Vrbani</option>
                            <option value="STENJEVEC">Stenjevec</option>
                            <option value="SPANSKO">Špansko</option>
                            <option value="MALESNICA">Malešnica</option>
                            <option value="MAKSIMIR">Maksimir</option>
                            <option value="DONJA_DUBRAVA">Donja Dubrava</option>
                            <option value="GORNJA_DUBRAVA">Gornja Dubrava</option>
                            <option value="RAVNICE">Ravnice</option>
                            <option value="PESCENICA">Peščenica</option>
                            <option value="BORONGAJ">Borongaj</option>
                            <option value="ZITNJAK">Žitnjak</option>
                            <option value="TRNJE">Trnje</option>
                            <option value="PANTOVCAK">Pantovčak</option>
                            <option value="SESTINE">Šestine</option>
                            <option value="MLINOVI">Mlinovi</option>
                            <option value="GRACANI">Gračani</option>
                            <option value="REMETE">Remete</option>
                            <option value="PODSLJEME">Podsljeme</option>
                            <option value="NOVI_ZAGREB_ZAPAD">Novi Zagreb - Zapad</option>
                            <option value="NOVI_ZAGREB_ISTOK">Novi Zagreb - Istok</option>
                            <option value="LANISTE">Lanište</option>
                            <option value="REMETINEC">Remetinec</option>
                            <option value="SAVSKI_GAJ">Savski Gaj</option>
                            <option value="TROKUT">Trokut</option>
                            <option value="SOPOT">Sopot</option>
                            <option value="DUGAVE">Dugave</option>
                            <option value="SLOBOSTINA">Sloboština</option>
                            <option value="ZAPRUDE">Zapruđe</option>
                            <option value="TRAVNO">Travno</option>
                            <option value="UTRINE">Utrine</option>
                            <option value="BUZIN">Buzin</option>
                            <option value="CRNOMEREC">Črnomerec</option>
                            <option value="KNEZIJA">Knežija</option>
                            <option value="VOLTINO">Voltino</option>
                            <option value="KUSTOSIJA">Kustošija</option>
                            <option value="RUDES">Rudeš</option>
                            <option value="SAVICA">Savica</option>
                            <option value="SIGET">Siget</option>
                            <option value="KAJZERICA">Kajzerica</option>
                            <option value="GAJNICE">Gajnice</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Lokacija:</label>
                        <div className="map-container">
                            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
                                <GoogleMap
                                    mapContainerStyle={{ width: '100%', height: '300px' }}
                                    center={{ lat: 0, lng: 0 }}
                                    zoom={2}
                                    onClick={handleMapClick}
                                    onLoad={(map) => {
                                        mapRef.current = map;
                                    }}
                                >
                                    {location.lat && location.lng && <Marker position={location} />}
                                </GoogleMap>
                            </LoadScript>
                        </div>
                        {location.lat && location.lng && (
                            <p className="selected-location">
                                Selected: {location.lat}, {location.lng}
                            </p>
                        )}
                    </div>

                    <button type="submit" className="submit-button-dodaj-trgovinu">
                        Predaj registraciju
                    </button>
                </form>

                <a href="../myShops" className="back-button">
                    Natrag na popis trgovina
                </a>
            </div>
        </div>
    );
};

export default AddShop;
