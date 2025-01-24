import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../stilovi/Payment.css';
import logo1 from '../Components/Assets/logo1.png';

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
    const location = useLocation();
    const totalPrice = location.state?.totalPrice || 0; // Default to 0 if no price provided

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'nameCard' && !/^[a-zA-Z\s]*$/.test(value)) {
            return;
        }

        if (name === 'numberCard' && !/^\d*$/.test(value)) {
            return;
        }

        if (name === 'ccvCode' && (!/^\d*$/.test(value) || value.length > 3)) {
            return;
        }

        setFormData({
            ...formData,
            [name]: value
        });

        // Clear backend result message on input change
        setBackendResult(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate expiration date
        const [month, year] = formData.expireDate.split('/');
        const expirationDate = new Date(`20${year}-${month}-01`);
        const currentDate = new Date();
        if (expirationDate <= currentDate) {
            alert('Datum isteka mora biti u budućnosti.');
            return;
        }

        const orderId = localStorage.getItem('orderId');
        if (!orderId) {
            alert('Nema dostupnog ID-a narudžbe.');
            return;
        }

        const token = localStorage.getItem('token'); // Authorization token

        try {
            // POST request to the backend
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/payOrder/${orderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    nameCard: formData.nameCard,
                    numberCard: formData.numberCard,
                    expireDate: formData.expireDate,
                    ccvCode: formData.ccvCode,
                    totalPrice
                })
            });

            if (response.ok) {

                // Payment successful
                setBackendResult({ message: 'Plaćanje je uspješno izvršeno!' });
                localStorage.removeItem('cart'); // Clear cart
                localStorage.removeItem('orderId'); // Clear orderId from localStorage


                // Redirect back home after success
                setTimeout(() => {
                    navigate(userRole === 'owner' ? '/ownerhome' : '/userhome');
                }, 1000);
            } else {
                // Handle failure
                const error = await response.json();
                alert(error.message || 'Došlo je do pogreške prilikom plaćanja.');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Došlo je do pogreške prilikom povezivanja s poslužiteljem.');
        }
    };

    const handleStopPayment = () => {
        navigate('/cart');
    };

    return (
        <div className="payment-page">
            <div className="payment-container">
                <div className="logoPayment">
                    <img
                        src={logo1}
                        onClick={() => navigate(userRole === 'owner' ? '/ownerhome' : '/userhome')}
                        style={{ cursor: 'pointer' }}
                        className="logoPay"
                    />
                </div>
                <div className="header-section-payment">
                    <div className="header-content">
                        <h1 className="payment">PLAĆANJE</h1>
                        <h2>Ukupna cijena: €{totalPrice}</h2>
                        <a className="detailsPayment" onClick={() => navigate('/cart')}>vidi detalje narudžbe</a>
                    </div>
                </div>
                <form className="payment-form" onSubmit={handleSubmit}>
                    {/* Input fields */}
                    <div className="form-payment">
                        {/* Left column */}
                        <div className="left-column-payment">
                            <div className="input-box-payment">
                                <label className="nameOnCard">Ime na kartici:</label>
                                <input
                                    type="text"
                                    id="nameCard"
                                    name="nameCard"
                                    placeholder="Ime"
                                    onChange={handleChange}
                                    value={formData.nameCard}
                                    pattern="[a-zA-Z\s]*"
                                    title="Dozvoljena su samo slova i razmaci."
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
                                    value={formData.numberCard}
                                    maxLength="16"
                                    pattern="\d{16}"
                                    title="Broj kartice mora sadržavati 16 znamenki."
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
                                    value={formData.expireDate}
                                    pattern="^(0[1-9]|1[0-2])\/\d{2}$"
                                    title="Datum mora biti u formatu MM/YY."
                                    required
                                />
                            </div>

                            <div className="input-box-payment">
                                <label className="ccvCode">CCV kod:</label>
                                <input
                                    type="text"
                                    id="ccvCode"
                                    name="ccvCode"
                                    placeholder="CCV kod"
                                    onChange={handleChange}
                                    value={formData.ccvCode}
                                    maxLength="3"
                                    pattern="\d{3}"
                                    title="CCV kod mora sadržavati 3 znamenke."
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <input type="submit" id="submitPayment" value="Plati" />

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
