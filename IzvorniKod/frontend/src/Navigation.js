import React, {useEffect, useState} from 'react';
import {useNavigate } from 'react-router-dom';
import './stilovi/Navigation.css';
import logo from './Components/Assets/logo1.png';

function Navigation() {
    const [menuOpen, setMenuOpen] = useState(false); // Stanje za otvaranje/zatvaranje menija
    const navigate = useNavigate(); // Hook za navigaciju
    const [authenticationTried, setAuthenticationTried] = useState(false);

    const checkTokenValidation = async () => {
        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/validateToken`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok || !(localStorage.getItem("role") === "moderator")) {
                if(localStorage.getItem("role") === "user")
                    navigate("/userhome");
                else if(localStorage.getItem("role") === "admin")
                    navigate("/adminhome");
                else if(localStorage.getItem("role")=== "owner")
                    navigate("/ownerhome");
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

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="navigation-container">
            {/* Navigaciona traka */}
            <header className="navigation-header">
                <img src={logo} alt="Logo" className="navigation-logo" />
                <ul className={`navigation-list ${menuOpen ? 'open' : ''}`}>
                    <li className="navigation-item"><a className="navigation-link"
                                                       onClick={() => navigate('/reportedReviews')}>Prijavljene
                        recenzije</a></li>
                    <li className="navigation-item"><a className="navigation-link"
                                                       onClick={() => navigate('/reportedProducts')}>Prijavljeni
                        proizvodi</a></li>
                    <li className="navigation-item"><a className="navigation-link"
                                                       onClick={() => navigate('/reportedShops')}>Prijavljene
                        trgovine</a></li>
                    <li className="navigation-item"><a className="navigation-link"
                                                       onClick={() => navigate('/reportedUsers')}>Prijavljeni
                        korisnici</a></li>
                    <li className="navigation-item"><a className="navigation-link" onClick={() => navigate('/accountRequests')}>Zahtjevi za vlasnički račun</a></li>
                </ul>
                {/* Hamburger dugme */}
                <button className="hamburger-btn-navigation" onClick={toggleMenu}>
                    ☰
                </button>
                {/* Hamburger meni sa dugmetom za odjavu */}
                {menuOpen && (
                    <div className="hamburger-menu-navigation">
                        <button onClick={handleLogout} className="logout-button-navigation">Odjava</button>
                    </div>
                )}
            </header>

            {/* Pozadina i slogan */}
            <div className="background-navigation">
                <h1 className="slogan-navigation">Kupovina koja prati tvoj ritam!</h1>
            </div>
        </div>
    );
}

export default Navigation;