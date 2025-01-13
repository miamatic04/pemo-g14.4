import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './stilovi/Events.css'
import logo1 from './Components/Assets/logo1.png';
import event1 from './Components/Assets/event1.jpg';
import event2 from './Components/Assets/event2.jpg';

const Events = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const allEvents = [
        {
            id: 1,
            name: "Ime Događaja 1",
            image: event1,
            info: "Prvo izdanje shopping utrke. Dođite, zabavite se i osvojite vrijedne nagrade.",
            location: "Mjesto 1",
            date: "Datum 1"
        },
        {
            id: 2,
            name: "Ime Događaja 2",
            image: event2,
            info: "Drugo izdanje shopping utrke. Ne propustite priliku!",
            location: "Mjesto 2",
            date: "Datum 2"
        },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 1; // Promijenjeno na broj događaja po stranici (možete prilagoditi)
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

    return (
        <div className="event-page">
            <div className="header-events">
                <div className="logo-container">
                    <img src={logo1} alt="Logo" className="logo" onClick={() => navigate('/UserHome')} style={{ cursor: 'pointer' }} />
                </div>
                <h1 className="header-title">Kupovina koja prati tvoj ritam</h1>
            </div>
            <div className="spacer"></div>
            <div className="event-container">
                {/* Prvi događaj */}
                <div className="event-card">
                    <div className="event-column left-column">
                        <h2 className="event-name">Ime Događaja 1</h2>
                        <img src={event1} alt="Događaj 1" className="event-image"/>
                    </div>
                    <div className="event-column middle-column">
                        <p className="event-info"><b>Informacije o događaju:</b></p>
                        <p className="event-infos">Prvo izdanje shopping utrke.
                            Dođite, zabavite se i osvojite vrijedne nagrade.
                        </p>
                        <p className="event-location"><b>Lokacija:</b> Mjesto 1</p>
                        <p className="event-date"><b>Datum:</b> Datum 1</p>
                    </div>
                    <div className="event-column right-column">
                        <button className="learn-more">Saznaj više</button>
                        <button className="register">Prijava</button>
                    </div>
                </div>

                {/* Drugi događaj */}
                <div className="event-card">
                    <div className="event-column left-column">
                        <h2 className="event-name">Ime Događaja 2</h2>
                        <img src={event2} alt="Događaj 2" className="event-image"/>
                    </div>
                    <div className="event-column middle-column">
                        <p className="event-info"><b>Informacije o događaju:</b></p>
                        <p className="event-infos">Prvo izdanje shopping utrke.
                            Dođite, zabavite se i osvojite vrijedne nagrade.
                        </p>
                        <p className="event event-location"><b>Lokacija:</b> Mjesto 2</p>
                        <p className="event-date"><b>Datum:</b> Datum 2</p>
                    </div>
                    <div className="event-column right-column">
                        <button className="learn-more">Saznaj više</button>
                        <button className="register">Prijava</button>
                    </div>
                </div>
            </div>

            {/* Navigacija za listanje stranica */}
            <div className="pagination">
                <button
                    className="nav-btn"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>
                <span className="page-numbers">
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
                    className="nav-btn"
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