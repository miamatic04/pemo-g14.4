import React, { useState }from 'react';

const Register = () => {


    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        pass: '',
        passConfirm: '',
    });

    const [backendResult, setBackendResult] = useState(null);

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

            console.log(JSON.stringify(formData));

            if (response.ok) {
                const result = await response.json();
                setBackendResult(result);
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Network Error:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="firstName">First name: </label>
                <input type="text" id="firstName" name="firstName" onChange={handleChange} value={formData.firstName} required/>

                <br/><br/>

                <label htmlFor="lastName">Last name: </label>
                <input type="text" id="lastName" name="lastName" onChange={handleChange} value={formData.lastName} required/>

                <br/><br/>

                <label htmlFor="email">E-mail address: </label>
                <input type="email" id="email" name="email" onChange={handleChange} value={formData.email} required/>

                <br/><br/>

                <label htmlFor="pass">Password: </label>
                <input type="password" id="pass" name="pass" onChange={handleChange} value={formData.pass} required/>

                <br/><br/>

                <label htmlFor="passConfirm">Password again: </label>
                <input type="password" id="passConfirm" name="passConfirm" onChange={handleChange} value={formData.passConfirm} required/>

                <br/><br/>

                <input type="submit"/>

                {backendResult && (
                    <div>
                        <h2>{backendResult.message}</h2>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Register;