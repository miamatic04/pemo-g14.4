import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './stilovi/addEvent.css';

const AddEvent = () => {
    const [eventName, setEventName] = useState('');
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [shops, setShops] = useState([]);
    const [selectedShop, setSelectedShop] = useState('');
    const [frequency, setFrequency] = useState('');
    const [customFrequencyValue, setCustomFrequencyValue] = useState('');

    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/shops`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setShops(data);
                } else {
                    console.error('Failed to fetch shops');
                }
            } catch (error) {
                console.error('Error fetching shops:', error);
            }
        };

        fetchShops();
    }, []);

    const handleMapClick = (e) => {
        const newLocation = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        };

        setLocation(newLocation);

        if (markerRef.current) {
            markerRef.current.setMap(null); // Ukloni stari marker
        }

        const marker = new window.google.maps.Marker({
            position: newLocation,
            map: mapRef.current,
        });

        markerRef.current = marker;
        mapRef.current.setCenter(newLocation);
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!eventName || !location.lat || !location.lng || !date || !time || !duration || !description || !image || !selectedShop || !frequency) {
            alert('Molimo ispunite sva polja i označite lokaciju na karti.');
            return;
        }

        const eventData = new FormData();
        eventData.append('name', eventName);
        eventData.append('latitude', location.lat);
        eventData.append('longitude', location.lng);
        eventData.append('date', date);
        eventData.append('time', time);
        eventData.append('duration', duration);
        eventData.append('description', description);
        eventData.append('image', image);
        eventData.append('shopId', selectedShop);
        eventData.append('frequency', frequency === 'custom' ? `${customFrequencyValue}` : frequency);

        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/addEvent`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: eventData,
            });

            if (response.ok) {
                alert('Događaj je uspješno dodan.');
                navigate('../events');
            } else {
                alert('Dodavanje događaja nije uspjelo.');
            }
        } catch (error) {
            console.error('Greška:', error);
            alert('Dodavanje događaja nije uspjelo.');
        }
    };

    return (
        <div className="pozadina3">
            <div className="event-creator">
                <h1 className="dodajDogadjaj">Dodaj novi događaj</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="eventName">Ime događaja:</label>
                        <input
                            className="unosZaDogadjaj"
                            id="eventName"
                            type="text"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            required
                            placeholder="Unesite ime događaja"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="date">Datum:</label>
                        <input
                            className="unosZaDogadjaj"
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="time">Vrijeme:</label>
                        <input
                            className="unosZaDogadjaj"
                            id="time"
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="duration">Trajanje (u satima):</label>
                        <input
                            className="unosZaDogadjaj"
                            id="duration"
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                            placeholder="Unesite trajanje događaja"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Opis događaja:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder="Opišite događaj"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Dodajte sliku događaja:</label>
                        <input
                            id="image"
                            type="file"
                            onChange={handleFileChange}
                            required
                            accept="image/*"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="shop">Odaberite trgovinu:</label>
                        <select
                            id="shop"
                            value={selectedShop}
                            onChange={(e) => setSelectedShop(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Odaberite trgovinu
                            </option>
                            {shops.map((shop) => (
                                <option key={shop.id} value={shop.id}>
                                    {shop.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="frequency">Frekvencija ponavljanja:</label>
                        <select
                            id="frequency"
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Odaberite frekvenciju
                            </option>
                            <option value="daily">Dnevno</option>
                            <option value="weekly">Tjedno</option>
                            <option value="customWeeks">Jednom u [unesite broj] tjedana</option>
                            <option value="monthly">Mjesečno</option>
                            <option value="customMonths">Jednom u [unesite broj] mjeseci</option>
                            <option value="yearly">Godišnje</option>
                        </select>
                        {(frequency === 'customWeeks' || frequency === 'customMonths') && (
                            <input
                                type="number"
                                min="1"
                                className="unosZaDogadjaj"
                                placeholder="Unesite broj"
                                value={customFrequencyValue}
                                onChange={(e) => setCustomFrequencyValue(e.target.value)}
                                required
                            />
                        )}
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
                                Odabrano: {location.lat}, {location.lng}
                            </p>
                        )}
                    </div>

                    <button type="submit" className="submit-button">
                        Dodaj događaj
                    </button>
                </form>

                <button className="back-button" onClick={() => navigate('../events')}>
                    Natrag
                </button>
            </div>
        </div>
    );
};

export default AddEvent;

                   