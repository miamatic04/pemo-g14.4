import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../stilovi/Events.css';
import logo1 from '../Components/Assets/logo1.png';

const Events = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('role');
    const [currentPage, setCurrentPage] = useState(1);
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const eventsPerPage = 3;
    const totalPages = Math.ceil(allEvents.length / eventsPerPage);

    const getCurrentEvents = () => {
        const startIndex = (currentPage - 1) * eventsPerPage;
        return allEvents.slice(startIndex, startIndex + eventsPerPage);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getEvents`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }

                const events = await response.json();
                setAllEvents(events);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    const handleSignup = async (eventId) => {
        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/signup/${eventId}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ userId: localStorage.getItem("userId") })
            });

            if (!response.ok) {
                throw new Error('Failed to sign up for the event');
            }

            setRegisteredEvents([...registeredEvents, eventId]);
            alert('Uspješno ste se prijavili na događaj!');
        } catch (error) {
            console.error('Error signing up for the event:', error);
            alert('Došlo je do greške prilikom prijave na događaj.');
        }
    };

    const generateGoogleCalendarLink = (event) => {
        const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";

        const startDate = new Date(event.dateTime);
        const endDate = new Date(
            startDate.getTime() + event.duration * 60 * 1000 // Convert minutes to milliseconds
        );

        const formatDate = (date) =>
            date.toISOString().replace(/[-:]/g, "").split(".")[0]; // Format date for Google Calendar

        const params = new URLSearchParams({
            text: event.name,
            details: event.description,
            location: event.address,
            dates: `${formatDate(startDate)}/${formatDate(endDate)}`, // Start and end times
        });

        return `${baseUrl}&${params.toString()}`;
    };

    const handleUnregisterClick = (eventId) => {
        setRegisteredEvents(registeredEvents.filter(id => id !== eventId));
    };

    const handleAddEventClick = () => {
        // Navigiraj na stranicu za dodavanje događaja
        navigate('/addEvent');
    };

    return (
        <div className="event-page">
            <div className="header-events">
                <div className="logo-container">
                    <img src={logo1} alt="Logo" className="logo" onClick={() => navigate(userRole === 'owner' ? '/ownerhome' : '/userhome')}
                         style={{ cursor: 'pointer' }} />
                </div>
                <h1 className="header-title">Događaji</h1>
                {userRole === 'owner' && (
                    <button className="add-event-btn" onClick={handleAddEventClick}>
                        Dodaj događaj
                    </button>
                )}
            </div>
            <div className="spacer"></div>
            <div className="event-container">
                {getCurrentEvents().map(event => (
                    <div key={event.id} className="event-card">
                        <div className="event-column-left-column">
                            <h2 className="event-name">{event.name}</h2>
                            <img src={event.imagePath} alt={event.name} className="event-image" />
                        </div>
                        <div className="event-column middle-column">
                            <p className="event-info"><b>Informacije o događaju:</b></p>
                            <p className="event-infos">{event.description}</p>
                            <p className="event-location"><b>Lokacija:</b> {event.address}</p>
                            <p className="event-date"><b>Datum:</b> {event.dateTime.split("T")[0]}</p>
                            <p className="event-time"><b>Vrijeme:</b>{event.dateTime.split("T")[1]}</p>
                        </div>
                        <div className="event-column right-column">
                            <button className="learn-more"
                                    onClick={() => navigate('/shop', {state: {shopId: event.shopId}})}>
                                Otiđi na profil trgovine
                            </button>
                            {registeredEvents.includes(event.id) ? (
                                <div>
                                <p className="uspjesnaPrijava">Uspješna prijava!</p>

                                </div>
                            ) : (
                                <button
                                    className="register"
                                    onClick={() => handleSignup(event.id)}
                                >
                                    Prijavi se
                                </button>
                            )}
                            <button
                                className="add-to-calendar"
                                onClick={() => window.open(generateGoogleCalendarLink(event), "_blank")}
                            >
                                Dodaj u kalendar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <button
                    className="navigation-btn"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>
                <span className="page-number">
                    {[...Array(totalPages)].map((_, index) => (
                        <span
                            key={index + 1}
                            className={currentPage === index + 1 ? "active" : ""}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </span>
                    ))}
                </span>
                <button
                    className="navigation-btn"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default Events;
