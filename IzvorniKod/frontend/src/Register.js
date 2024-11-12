import React, { useState }from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa"; /* ikone za covjeka, lokot i mail */
import loginImage from './Components/Assets/loginPicture.jpg'; /* slika pored forme */


const Register = () => {


    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        pass: '',
        passConfirm: '',
        role: 'user'
    });

    const [backendResult, setBackendResult] = useState(null);

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
            const response = await fetch('http://localhost:8080/register/addUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log('Response Status:', response.status); // Provjeri status koda
            console.log('Response OK:', response.ok); // Provjeri je li odgovor OK

            if (!response.ok) {
                // Ako odgovor nije OK, obraditi grešku
                const errorData = await response.json();
                setBackendResult(errorData);
            } else {
                // Ako je odgovor uspješan, obradi uspješan rezultat
                const data = await response.json();
                setBackendResult(data);
                sessionStorage.setItem("registrationMessage", "Registracija uspješna, molim ulogirajte se");
                navigate('/');
            }
        } catch (error) {
            console.error('Network Error:', error);
        }
    };

    return (
        <div className="pozadina">
        <div className="wrapper"> {/* wrapper obuhvaca formu, sliku pored nje i bijelu pozadinu oko toga */}
            <form className="register-form" onSubmit={handleSubmit}> {/* forma za registraciju */}
                <h1 className="registracija">REGISTRACIJA</h1> {/* naslov forme: REGISTRACIJA */}

                <div className="input-box"> {/* mjesto za unos (imena) */}
                    <input type="text" id="firstName" name="firstName" placeholder="ime" onChange={handleChange}
                           value={formData.firstName} required/> {/* placeholder --> pise dok se ne krene upisivati ime */}
                    <FaUser className='icon'/> {/* ikona covjeka (user-a) */}
                </div>

                <br/><br/>
                <div className="input-box"> {/* mjesto za unos (prezimena) */}
                    <input type="text" id="lastName" name="lastName" placeholder="prezime" onChange={handleChange}
                           value={formData.lastName} required/> {/* placeholder --> pise dok se ne krene upisivati prezime */}
                    <FaUser className='icon'/> {/* ikona covjeka (user-a) */}
                </div>

                <br/><br/>

                <div className="input-box"> {/* mjesto za unos (mail-a) */}
                    <input type="email" id="email" name="email" placeholder="email" onChange={handleChange}
                           value={formData.email} required/> {/* placeholder --> pise dok se ne krene upisivati mail */}
                    <FaEnvelope className='icon'/> {/* ikona mail-a */}
                </div>

                <br/><br/>

                <div className="input-box"> {/* mjesto za unos (lozinke) */}
                    <input type="password" id="pass" name="pass" placeholder="lozinka" onChange={handleChange}
                           value={formData.pass} required/> {/* placeholder --> pise dok se ne krene upisivati lozinka */}
                    <FaLock className='icon'/> {/* ikona lokota */}
                </div>

                <br/><br/>

                <div className="input-box"> {/* mjesto za unos (ponovljene lozinke) */}
                    <input type="password" id="passConfirm" name="passConfirm" placeholder="ponovljena lozinka"
                           onChange={handleChange} value={formData.passConfirm} required/> {/* placeholder --> pise dok se ne krene
                           upisivati ponovljena lozinka */}
                    <FaLock className='icon'/> {/* ikona lokota */}
                </div>

                <br/><br/>

                <input type="submit" id="submit" value="Registriraj se"/> {/* gumb za predavanje registracije */}

                {backendResult && (
                    <div>
                        <h2>{backendResult.message}</h2>
                    </div>
                )}
            </form>
            <div className='image-container'> {/* logo i dodatna slika */}
                <img src={loginImage} alt='registerPicture'/> {/* ako se slika ne ucita */}
            </div>
        </div>
        </div>
    );
};

export default Register;