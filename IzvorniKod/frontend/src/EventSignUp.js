import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/EventSignUp.css';
import logo1 from './Components/Assets/logo1.png';
import event1 from './Components/Assets/event1.jpg';
import {FaEnvelope, FaPhone, FaUser} from "react-icons/fa";

const EventSignUp = () => {
    const navigate = useNavigate();

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
                        <img src={logo1} onClick={() => navigate('/UserHome')}
                             style={{ cursor: 'pointer' }}/>
                    </div>
                    <form className="signUpForm">
                        <h1 className="signUp">PRIJAVA NA DOGAĐAJ</h1>

                        <div className="input-box">
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                placeholder="ime"
                            />
                            <FaUser className='iconEvent'/>
                        </div>

                        <br/><br/>
                        <div className="input-box">
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                placeholder="prezime"
                            />
                            <FaUser className='iconEvent'/>
                        </div>

                        <br/><br/>
                        <div className="input-box">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="email"
                            />
                            <FaEnvelope className='iconEvent'/>
                        </div>

                        <br/><br/>
                        <div className="input-box password-box">
                            <input
                                id="pass"
                                name="pass"
                                placeholder="mobitel"
                            />
                            <FaPhone className='iconEvent'/>
                        </div>

                        <br/><br/>
                        <div className="input-box password-box">
                            <input
                                id="passConfirm"
                                name="passConfirm"
                                placeholder="napomena"
                            />
                        </div>

                        <br/><br/>
                        <button className="submitEventSignUp">Prijavi se</button>
                        <button className="goToEventList" onClick={() => navigate('/events')}>Vrati se na popis događaja
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EventSignUp;