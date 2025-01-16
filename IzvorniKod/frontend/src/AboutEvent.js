import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/AboutEvent.css';
import logo1 from './Components/Assets/logo1.png';
import event1 from './Components/Assets/event1.jpg';

const AboutEvent = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('role');
    return (
        <div className="aboutEvent-page">
            <div className="aboutEvent-container">
                <div className="left-panel-event">
                    <div className="aboutEvent-card">
                        <div className="aboutEvent-image">
                            <img src={event1} alt="aboutEvent"/>
                        </div>
                        <h2>Događaj1</h2>
                        <p className="ulica-event"><b>Lokacija: </b>Zagreb, ul. grada Chicaga 71</p>
                        <p className="datum-event"><b>Datum:</b>20.01.2025.</p>
                        <p className="vrijeme-event"><b>Vrijeme:</b>20:00</p>
                    </div>
                </div>

                <div className="right-panel">
                    <div className="logo1">
                        <img src={logo1} onClick={() => navigate(userRole === 'owner' ? '/ownerhome' : '/userhome')}
                             style={{cursor: 'pointer'}}/>
                    </div>
                    <h3 className="opisDogadaja">Opis događaja:</h3>
                    <p className="opisDogadajaTekst">
                        U ponedjeljak 20.01.2025. naša trgovina Trgovina1 organizira radionicu slikarstva u Ulici grada
                        Chicaga 71.
                        Radionica je namijenjena svim uzrastima. Nije potrebno prethodno iskustvo jer su radionice
                        namijenjene početncima
                        no održat će se i radionica za one naprednije (vrsta radionice se bira na ulazu).
                    </p>
                    <button className="goToEvents" onClick={() => navigate('/events')}>Vrati se na popis događaja</button>

                </div>
            </div>
        </div>
    );
};

export default AboutEvent;