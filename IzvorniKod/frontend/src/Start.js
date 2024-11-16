import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/Start.css';
import { FaUser, FaLock } from "react-icons/fa"; /* ikone za covjeka i lokot */
import loginImage from './Components/Assets/loginPicture.jpg'; /* slika pored forme (logo + dodatna slika) */
import { useLocation } from 'react-router-dom';

const Start = () => {
    const [formData, setFormData] = useState({
        email: '',
        pass: '',
    });

    const url = useLocation();

    const [backendResult, setBackendResult] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                console.log(errorMessage);
                setBackendResult(errorMessage);
            } else {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role.substring(1, data.role.length - 1));
                navigate("/" + localStorage.getItem("role") + "home");
            }
        } catch (error) {
            console.error('Network Error:', error);
        }
    };

    useEffect(() => {
        // Pročitaj poruku iz sessionStorage
        const storedMessage = sessionStorage.getItem("registrationMessage");
        if (storedMessage) {
            setMessage(storedMessage);
            // Obriši poruku iz sessionStorage nakon što je prikazana
            sessionStorage.removeItem("registrationMessage");
        }

        const params = new URLSearchParams(url.search);

        if(params.get("confirmed") !== null) {
            if(params.get("confirmed") === "true") {
                sessionStorage.setItem("registrationMessage", "Email uspješno potrvđen. Molim ulogirajte se.");
            } else
                sessionStorage.setItem("registrationMessage", "Pogreška prilikom potvrđivanja email-a.");
        }


    }, []);

    return (
        <div className="pozadina">
        <div className='wrapper'> {/* wrapper obuhvaca formu, sliku i cijeli bijeli dio oko njih */}
            <div className='login-form'> {/* forma za prijavu */}
                <h1>PRIJAVA</h1> {/* naslov forme: PRIJAVA */}
                <form className="form" onSubmit={handleSubmit}>
                    <div className="input-box"> {/* prostor za unos (mail-a */}
                        <b><input type="email" id="email" name="email" placeholder='email' onChange={handleChange} value={formData.email} required /></b>
                        {/* placeholder --> pise dok se ne krene upisivati mail */}
                        <FaUser className='icon' /> {/* ikona covjeka (user-a) */}
                    </div>

                    <br /><br />

                    <div className="input-box"> {/* prostor za unos (lozinke) */}
                        <b><input type="password" id="pass" name="pass" placeholder='lozinka' onChange={handleChange} value={formData.pass} required /></b>
                        {/* placeholder --> pise dok se ne krene upisivati lozinka */}
                        <FaLock className='icon' /> {/* ikona lokota */}
                    </div>

                    <br /><br />
                    <input type="submit" id="submit" value="Prijavi se" /> {/* gumb za predavanje prijave */}
                </form>

                {backendResult && (
                    <div className="info-message">
                        <h3>{backendResult.message}</h3>
                    </div>
                )}

                <br />

                <div className="registration">
                    <b>Nemaš račun? <a href="register">Registriraj se</a> </b> {/* link koji vodi do registracije */}
                </div>

                <div className="others"> {/* ostali nacini za prijavu */}
                    <b><h4>Ostali načini prijave:</h4>
                        <a href={`http://${process.env.REACT_APP_WEB_URL}/oauth2/authorization/google`} id="google">Prijavi se pomoću Google-a</a></b>
                </div>
                {message && <div className="info-message" style={{ color: "green" }}><h3>{message}</h3></div>}
            </div>

            <div className='image-container'> {/* logo i dodatna slika */}
                <img src={loginImage} alt='loginPicture' /> {/* ako se slika ne ucita */}
            </div>
        </div>
        </div>
    );
};

export default Start;
