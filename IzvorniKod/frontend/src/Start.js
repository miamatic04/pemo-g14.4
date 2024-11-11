import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Start.css';
import { FaUser, FaLock } from "react-icons/fa";
import loginImage from './Components/Assets/loginPicture.jpg';

const Start = () => {
    const [formData, setFormData] = useState({
        email: '',
        pass: '',
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
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                setBackendResult(errorData);
            } else {
                const data = await response.json();
                setBackendResult(data);
                navigate('/home');
            }
        } catch (error) {
            console.error('Network Error:', error);
        }
    };

    return (
        <div className="pozadina">
        <div className='wrapper'>
            <div className='login-form'>
                <h1>PRIJAVA</h1>
                <form onSubmit={handleSubmit} className="form">
                    <div className="input-box">
                        <b><input type="email" id="email" name="email" placeholder='email' onChange={handleChange} value={formData.email} required /></b>
                        <FaUser className='icon' />
                    </div>

                    <br /><br />

                    <div className="input-box">
                        <b><input type="password" id="pass" name="pass" placeholder='lozinka' onChange={handleChange} value={formData.pass} required /></b>
                        <FaLock className='icon' />
                    </div>

                    <br /><br />
                    <input type="submit" id="submit" value="Prijavi se" />
                </form>

                {backendResult && (
                    <div>
                        <h2>{backendResult.message}</h2>
                    </div>
                )}

                <br />

                <div className="registration">
                    <b>Nemaš račun? <a href="register">Registriraj se</a> </b>
                </div>

                <div className="others">
                    <b><h4>Ostali načini prijave:</h4>
                        <a href="http://localhost:8080/oauth2/authorization/google" id="google">Prijavi se pomoću Google-a</a></b>
                </div>
            </div>

            <div className='image-container'>
                <img src={loginImage} alt='loginPicture' />
            </div>
        </div>
        </div>
    );
};

export default Start;
