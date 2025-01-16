import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/Events.css'
import logo1 from './Components/Assets/logo1.png';
import event1 from './Components/Assets/event1.jpg';
import event2 from './Components/Assets/event2.jpg';

const Events = () => {
    const navigate = useNavigate();

    const allEvents = [
        { id: 1, name: "Ime Događaja 1", image: event1, info: "Prvo izdanje shopping utrke. Dođite, zabavite se i osvojite vrijedne nagrade.", location: "Mjesto 1", date: "Datum 1", time: "Vrijeme 1"},
        { id: 2, name: "Ime Događaja 2", image: event2, info: "Prvo izdanje shopping utrke. Dođite, zabavite se i osvojite vrijedne nagrade.", location: "Mjesto 2", date: "Datum 2", time: "Vrijeme 2"},
        { id: 3, name: "Ime Događaja 3", image: event1, info: "Prvo izdanje shopping utrke. Dođite, zabavite se i osvojite vrijedne nagrade.", location: "Mjesto 3", date: "Datum 3", time: "Vrijeme 3"},
        { id: 4, name: "Ime Događaja 4", image: event2, info: "Prvo izdanje shopping utrke. Dođite, zabavite se i osvojite vrijedne nagrade.", location: "Mjesto 4", date: "Datum 4", time: "Vrijeme 4"},
        { id: 5, name: "Ime Događaja 5", image: event1, info: "Prvo izdanje shopping utrke. Dođite, zabavite se i osvojite vrijedne nagrade.", location: "Mjesto 5", date: "Datum 5", time: "Vrijeme 5"},
        { id: 6, name: "Ime Događaja 6", image: event2, info: "Prvo izdanje shopping utrke. Dođite, zabavite se i osvojite vrijedne nagrade.", location: "Mjesto 6", date: "Datum 6", time: "Vrijeme 6"},
        { id: 7, name: "Ime Događaja 7", image: event1, info: "Prvo izdanje shopping utrke. Dođite, zabavite se i osvojite vrijedne nagrade.", location: "Mjesto 7", date: "Datum 7", time: "Vrijeme 7"},
        { id: 8, name: "Ime Događaja 8", image: event2, info: "Prvo izdanje shopping utrke. Dođite, zabavite se i osvojite vrijedne nagrade.", location: "Mjesto 8", date: "Datum 8", time: "Vrijeme 8"},
        { id: 9, name: "Ime Događaja 9", image: event1, info: "Prvo izdanje shopping utrke. Dođite, zabavite se i osvojite vrijedne nagrade.", location: "Mjesto 9", date: "Datum 9", time: "Vrijeme 9"},
        { id: 10, name: "Ime Događaja 10", image: event2, info: "Prvo izdanje shopping utrke. Dođite, zabavite se i osvojite vrijedne nagrade.", location: "Mjesto 10", date: "Datum 10", time: "Vrijeme 10"},
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const [registeredEvents, setRegisteredEvents] = useState([]); // Niz za spremanje ID-eva registriranih događaja
    const eventsPerPage = 3; // Promijenjeno na broj događaja po stranici (možete prilagoditi)
    const totalPages = Math.ceil(allEvents.length / eventsPerPage); // Ukupan broj stranica

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

    const handleSignup = async (eventId) => {
        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/signup/${eventId}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ userId: localStorage.getItem("userId") }) // Ako je potrebno poslati ID korisnika
            });

            if (!response.ok) {
                throw new Error('Failed to sign up for the event');
            }

            // Ako je uspješno prijavljen, dodaj ID u registrirane događaje
            setRegisteredEvents([...registeredEvents, eventId]);
            alert('Uspješno ste se prijavili na događaj!');
        } catch (error) {
            console.error('Error signing up for the event:', error);
            alert('Došlo je do greške prilikom prijave na događaj.');
        }
    };

    const handleRegisterClick = (eventId) => {
        if (!registeredEvents.includes(eventId)) {
            setRegisteredEvents([...registeredEvents, eventId]); // Dodaj ID u niz registriranih događaja
        }
    };

    const handleUnregisterClick = (eventId) => {
        setRegisteredEvents(registeredEvents.filter(id => id !== eventId)); // Ukloni ID iz niza registriranih događaja
    };

    return (
        <div className="event-page">
            <div className="header-events">
                <div className="logo-container">
                    <img src={logo1} alt="Logo" className="logo" onClick={() => navigate('/UserHome')}
                         style={{cursor: 'pointer'}}/>
                </div>
                <h1 className="header-title">Događaji</h1>
            </div>
            <div className="spacer"></div>
            <div className="event-container">
                {getCurrentEvents().map(event => (
                    <div key={event.id} className="event-card">
                        <div className="event-column-left-column">
                            <h2 className="event-name">{event.name}</h2>
                            <img src={event.image} alt={event.name} className="event-image"/>
                        </div>
                        <div className="event-column middle-column">
                            <p className="event-info"><b>Informacije o događaju:</b></p>
                            <p className="event-infos">{event.info}</p>
                            <p className="event-location"><b>Lokacija:</b> {event.location}</p>
                            <p className="event-date"><b>Datum:</b> {event.date}</p>
                            <p className="event-time"><b>Vrijeme:</b> {event.time}</p>
                        </div>
                        <div className="event-column right-column">
                            <button className="learn-more" onClick={() => navigate('/aboutEvent')}>Saznaj više</button>
                            {registeredEvents.includes(event.id) ? (
                                <div>
                                    <p className="uspjesnaPrijava">Uspješna prijava!</p>
                                    <button
                                        className="unregister"
                                        onClick={() => handleUnregisterClick(event.id)}
                                    >
                                        Otkaži prijavu
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="register"
                                    onClick={() => handleSignup(event.id)}
                                >
                                    Prijavi se
                                </button>
                            )}
                        </div>
                    </div>

                ))}
            </div>

            {/* Navigacija za listanje stranica */}
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