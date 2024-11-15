import React, { useState }from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/Register.css';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'; /* ikone za covjeka, lokot i mail */
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
    const [showPassword, setShowPassword] = useState(false);

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
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/register/addUser`, {
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
                sessionStorage.setItem("registrationMessage", "Registracija uspješna. Potvrdite email adresu i ulogirajte se.");
                navigate('/');
            }
        } catch (error) {
            console.error('Network Error:', error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };



    return (
        <div className="pozadina">
            <div className="wrapper"> {/* wrapper obuhvaca formu, sliku pored nje i bijelu pozadinu oko toga */}
                <form className="register-form" onSubmit={handleSubmit}>
                    <h1 className="registracija">REGISTRACIJA</h1>

                    <div className="input-box">
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            placeholder="ime"
                            onChange={handleChange}
                            value={formData.firstName}
                            required
                            minLength="2"
                        />
                        <FaUser className='icon'/>
                    </div>

                    <br/><br/>
                    <div className="input-box">
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            placeholder="prezime"
                            onChange={handleChange}
                            value={formData.lastName}
                            required
                            minLength="2"
                        />
                        <FaUser className='icon'/>
                    </div>

                    <br/><br/>
                    <div className="input-box">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="email"
                            onChange={handleChange}
                            value={formData.email}
                            required
                            title="Please enter a valid email address"
                        />
                        <FaEnvelope className='icon'/>
                    </div>

                    <br/><br/>
                    <div className="input-box password-box">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="pass"
                            name="pass"
                            placeholder="lozinka"
                            onChange={handleChange}
                            value={formData.pass}
                            required
                            minLength="8"
                            pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                            title="Password must contain at least 8 characters, including one uppercase letter, one number, and one special character."
                        />
                        <span className="password-toggle" onClick={togglePasswordVisibility}>
                            {showPassword ? <FaEyeSlash/> : <FaEye/>}
                        </span>
                        <FaLock className='icon'/>
                    </div>

                    <br/><br/>
                    <div className="input-box password-box">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="passConfirm"
                            name="passConfirm"
                            placeholder="ponovljena lozinka"
                            onChange={handleChange}
                            value={formData.passConfirm}
                            required
                            minLength="8"
                        />
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
                <div className='image-container'> {/* logo i dodatna slika */}
                    <img src={loginImage} alt='registerPicture'/> {/* ako se slika ne ucita */}
                </div>
            </div>
        </div>
    );
};

export default Register;