import React, {useEffect, useState} from 'react';
import {useNavigate } from 'react-router-dom';
import '../stilovi/Navigation.css';
import logo from '../Components/Assets/logo1.png';

function Navigation() {
    const [menuOpen, setMenuOpen] = useState(false); // Stanje za otvaranje/zatvaranje menija
    const navigate = useNavigate(); // Hook za navigaciju
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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

    const toggleMenu1 = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="body-klasa" style={{ overflowY: 'hidden' }}>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"/>
            <div className="home">
                <div className="header2">
                    <img src={logo} alt="logo" className="logo33" />
                    <button className="hamburger-btn1" onClick={toggleMenu1}>
                        ☰
                    </button>
                    <ul className={`lista ${isMenuOpen ? 'active' : ''}`}>
                        <li className="el"><a className="a1" onClick={() => navigate('/reportedReviews')}>Prijavljene
                            recenzije</a></li>
                        <li className="el"><a className="a1" onClick={() => navigate('/reportedProducts')}>Prijavljeni
                            proizvodi</a></li>
                        <li className="el"><a className="a1" onClick={() => navigate('/reportedShops')}>Prijavljene
                            trgovine</a></li>
                        <li className="el"><a className="a1" onClick={() => navigate('/reportedUsers')}>Prijavljeni
                            korisnici</a></li>
                        <li className="el"><a className="a1" onClick={() => navigate('/accountRequests')}>Zahtjevi za
                            vlasnički račun</a></li>
                        <li className="el" id="id-skriven"><a className="a1" onClick={() => navigate('/userProfile')}>Uredi
                            profil</a></li>
                        <li className="el" id="id-skriven"><a className="a1" onClick={handleLogout}>Odjava</a></li>
                        <li className="hamburger">
                            <button className="hamburger-btn" onClick={toggleMenu}>
                                ☰
                            </button>
                            {menuOpen && (
                                <div className="hamburger-menu">
                                    <button onClick={handleLogout}>Odjava</button>
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
                <div className="glavna">
                    <h1 className="naslov">Kupovina koja prati tvoj ritam</h1>
                    <div className="background"></div>
                </div>
            </div>
        </div>
    );
}

export default Navigation;