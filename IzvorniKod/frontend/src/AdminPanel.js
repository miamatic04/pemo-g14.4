import React, {useEffect, useState} from 'react';
/*import ModeratorActivity from './ModeratorActivity';
import UserActivity from './UserActivity';
import AssignDisciplinaryMeasure from './AssignDisciplinaryMeasure';
import AssignRole from './AssignRole';
import './stilovi/AdminPanel.css';*/
import logo from "./Components/Assets/logo1.png";
import {useLocation, useNavigate} from "react-router-dom";

const AdminPanel = () => {
    /*const [activeTab, setActiveTab] = useState('moderatorActivity');*/
    const navigate = useNavigate();
    const url = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
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

            if (!response.ok || !(localStorage.getItem("role") === "admin")) {
                if(localStorage.getItem("role") === "user")
                    navigate("/userhome");
                else if(localStorage.getItem("role") === "moderator")
                    navigate("/moderatorhome");
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
        if(!authenticationTried && !url.search) {
            setAuthenticationTried(true);
            checkTokenValidation();
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/');
    };
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    return (
        /*<div className="admin-panel">
            <nav>
                <button onClick={() => setActiveTab('moderatorActivity')}>Aktivnost moderatora</button>
                <button onClick={() => setActiveTab('userActivity')}>Aktivnost korisnika</button>
                <button onClick={() => setActiveTab('assignMeasure')}>Dodijeli disciplinsku mjeru</button>
                <button onClick={() => setActiveTab('assignRole')}>Dodijeli ulogu</button>
            </nav>
            <div className="content">
                {activeTab === 'moderatorActivity' && <ModeratorActivity />}
                {activeTab === 'userActivity' && <UserActivity />}
                {activeTab === 'assignMeasure' && <AssignDisciplinaryMeasure />}
                {activeTab === 'assignRole' && <AssignRole />}
            </div>
        </div>*/
        <div className="body-klasa" style={{ overflowY: 'hidden' }}>
            <link rel="stylesheet"
                  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"/>
            {/*link na Font Awesome za ikone kod proizvoda*/}
            <div className="home">
                <div className="header2">
                    <img src={logo} alt="logo" className="logo33"></img>
                    <ul className="lista">
                        <li className="el"><a className="a1" onClick={() => navigate('/moderatorActivity')}>Aktivnost
                            moderatora</a></li>
                        <li className="el"><a className="a1" onClick={() => navigate('/userActivity')}>Aktivnost
                            korisnika</a></li>
                        <li className="el"><a className="a1" onClick={() => navigate('/assignDisciplinaryMeasure')}>Dodijeli disciplinsku mjeru</a></li>
                        <li className="el"><a className="a1" onClick={() => navigate('/assignRole')}>Dodijeli ulogu</a></li>
                        <li className="el"><a className="a1" onClick={() => navigate('/addPlatformProduct')}>Dodaj proizvod</a></li>
                        <li className="hamburger">
                            <button className="hamburger-btn" onClick={toggleMenu}>
                                ☰
                            </button>
                            {menuOpen && (
                                <div className="hamburger-menu">
                                    {/*<button onClick={() => navigate(`/userProfile`)}>Uredi profil</button>*/}
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
};

export default AdminPanel;