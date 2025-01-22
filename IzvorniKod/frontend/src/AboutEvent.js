import React, { useState, useEffect } from 'react';
import { useNavigate , useLocation } from 'react-router-dom';
import './stilovi/AboutEvent.css';
import logo1 from './Components/Assets/logo1.png';
import event1 from './Components/Assets/event1.jpg';

const AboutEvent = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('role');
    const location = useLocation();
    const [eventDetails, setEventDetails] = useState(null);
    const [loading, setLoading] = useState(true);


    // Dohvaćamo eventId iz location state
    const eventId = location.state?.eventId;

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!eventId) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/events/${eventId}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch event details');
                }

                const data = await response.json();
                setEventDetails(data);
            } catch (error) {
                console.error('Error fetching event details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [eventId]);

    if (loading) {
        return <div>Učitavanje...</div>;
    }

    if (!eventId) {
        return <div>Nije naveden ID događaja</div>;
    }

    if (!eventDetails) {
        return <div>Podaci o događaju nisu pronađeni</div>;
    }



    return (
        <div className="aboutEvent-page">
            <div className="aboutEvent-container">
                <div className="left-panel-event">
                    <div className="aboutEvent-card">
                        <div className="aboutEvent-image">
                            <img src={eventDetails.imagePath} alt={eventDetails.name}/>
                        </div>
                        <h2>{eventDetails.name}</h2>
                        <p className="ulica-event"><b>Lokacija: </b>{eventDetails.address}</p>
                        <p className="datum-event"><b>Datum:</b>{new Date(eventDetails.dateTime).toLocaleDateString()}</p>
                        <p className="vrijeme-event"><b>Vrijeme:</b>{new Date(eventDetails.dateTime).toLocaleTimeString()}</p>
                    </div>
                </div>

                <div className="right-panel">
                    <div className="logo1">
                        <img src={logo1} onClick={() => navigate(userRole === 'owner' ? '/ownerhome' : '/userhome')}
                             style={{cursor: 'pointer'}}/>
                    </div>
                    <h3 className="opisDogadaja">Opis događaja:</h3>
                    <p className="opisDogadajaTekst"> {eventDetails.description} </p>

                    {userRole === 'owner' && (
                        <button
                            className="edit-button"
                            onClick={() => navigate(`/editEvent/${eventId}`, { state: { eventDetails } })}
                        >
                            Uredi događaj
                        </button>
                    )}
                    <button className="goToEvents" onClick={() => navigate('/events')}>Vrati se na popis događaja</button>

                </div>
            </div>
        </div>
    );
};

export default AboutEvent;