import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

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
                // Ako status nije u opsegu 2xx, baci grešku
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
        <div>
            <div>
                <h1>Welcome</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">E-mail address: </label>
                    <input type="email" id="email" name="email" onChange={handleChange} value={formData.email} required/>

                    <br/><br/>

                    <label htmlFor="pass">Password: </label>
                    <input type="password" id="pass" name="pass" onChange={handleChange} value={formData.pass} required/>

                    <input type="submit"/>
                </form>

                {backendResult && (
                    <div>
                        <h2>{backendResult.message}</h2>
                    </div>
                )}


                <br/>

                Not registered? <a href="register">Create an account</a>

                <h3>login via socials: </h3>
                <a href="http://localhost:8080/oauth2/authorization/google">Login with Google</a>

            </div>


        </div>
    );
};

export default Start