import React, { useState }from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import loginImage from './Components/Assets/loginPicture.jpg';


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
        <div className="wrapper">
            <form className="register-form" onSubmit={handleSubmit}>
                <h1>REGISTRACIJA</h1>

                <div className="input-box">
                    <input type="text" id="firstName" name="firstName" placeholder="ime" onChange={handleChange}
                           value={formData.firstName} required/>
                    <FaUser className='icon'/>
                </div>

                <br/><br/>
                <div className="input-box">
                    <input type="text" id="lastName" name="lastName" placeholder="prezime" onChange={handleChange}
                           value={formData.lastName} required/>
                    <FaUser className='icon'/>
                </div>

                <br/><br/>

                <div className="input-box">
                    <input type="email" id="email" name="email" placeholder="email" onChange={handleChange}
                           value={formData.email} required/>
                    <FaEnvelope className='icon'/>
                </div>

                <br/><br/>

                <div className="input-box">
                    <input type="password" id="pass" name="pass" placeholder="lozinka" onChange={handleChange}
                           value={formData.pass} required/>
                    <FaLock className='icon'/>
                </div>

                <br/><br/>

                <div className="input-box">
                    <input type="password" id="passConfirm" name="passConfirm" placeholder="ponovljena lozinka"
                           onChange={handleChange} value={formData.passConfirm} required/>
                    <FaLock className='icon'/>
                </div>

                <br/><br/>

                <input type="submit" id="submit" value="Registriraj se"/>

                {backendResult && (
                    <div>
                        <h2>{backendResult.message}</h2>
                    </div>
                )}
            </form>
            <div className='image-container'>
                <img src={loginImage} alt='loginPicture'/>
            </div>
        </div>
    );
};

export default Register;