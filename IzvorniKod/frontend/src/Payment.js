import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/Payment.css';
import logo1 from './Components/Assets/logo1.png';

const Payment = () => {
    const [formData, setFormData] = useState({
        nameCard: '',
        numberCard: '',
        expireDate: '',
        ccvCode: '',
        role: 'user'
    });
    const userRole = localStorage.getItem('role');
    const [backendResult, setBackendResult] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Ukloni poruku o uspjehu prilikom promjene unosa
        setBackendResult(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Spriječava ponovno učitavanje stranice

        // Spremanje podataka u localStorage
        localStorage.setItem('userProfile', JSON.stringify(formData));

        console.log("Podaci su spremljeni:", formData);
        setBackendResult({ message: "Plaćanje je uspješno izvršeno!" }); // Postavljanje poruke o uspjehu
    };

    const handleStopPayment = () => {
        navigate('/kosarica');
    };

    return (
        <div className="payment-page">
            <div className="payment-container">
                <div className="logoPayment">
                    <img src={logo1} onClick={() => navigate(userRole === 'owner' ? '/ownerhome' : '/userhome')} style={{cursor: 'pointer'}} className="logoPay"/>
                </div>
                <div className="header-section-payment">
                    <div className="header-content">
                        <h1 className="payment">PLAĆANJE</h1>
                        <h2>210,00€</h2>
                        <a className="detailsPayment" onClick={() => navigate("/cart")}>vidi detalje narudžbe</a>
                    </div>
                </div>
                <form className="payment-form" onSubmit={handleSubmit}>
                    {/* Polja za unos */}
                    <div className="form-payment">
                        {/* Lijevi stupac */}
                        <div className="left-column-payment">
                            <div className="input-box-payment">
                                <label className="nameOnCard">Ime na kartici:</label>
                                <input
                                    type="text"
                                    id="nameCard"
                                    name="nameCard"
                                    placeholder="Ime"
                                    onChange={handleChange}
                                    value={formData.firstName}
                                    required
                                />
                            </div>

                            <div className="input-box-payment">
                                <label className="numberOfcard">Broj kartice:</label>
                                <input
                                    type="text"
                                    id="numberCard"
                                    name="numberCard"
                                    placeholder="XXXX XXXX XXXX XXXX"
                                    onChange={handleChange}
                                    value={formData.lastName}
                                    required
                                />
                            </div>

                            <div className="input-box-payment">
                                <label className="expireDate">Vrijedi do:</label>
                                <input
                                    type="text"
                                    id="expireDate"
                                    name="expireDate"
                                    placeholder="MM/YY"
                                    onChange={handleChange}
                                    value={formData.email}
                                    required
                                />
                            </div>

                            <div className="input-box-payment">
                                <label className="ccvCode">CCV kod:</label>
                                <input
                                    type="text"
                                    id="expireDate"
                                    name="expireDate"
                                    placeholder="CCV kod"
                                    onChange={handleChange}
                                    value={formData.email}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <input type="submit" id="submitPayment" value="Plati"/>

                    {backendResult && (
                        <div>
                            <h2>{backendResult.message}</h2>
                        </div>
                    )}
                    <button type="button" id="stopPayment" onClick={handleStopPayment}>Otkaži plaćanje</button>
                </form>
            </div>
        </div>
    );
};

export default Payment;