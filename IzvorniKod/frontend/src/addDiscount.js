import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/addDiscount.css'; // Prilagodite putanju prema vašim potrebama

const AddDiscount = () => {
    const [code, setCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [shops, setShops] = useState([]);
    const [selectedShopId, setSelectedShopId] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/owner/getMyShops`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setShops(data);
                } else {
                    console.error('Failed to fetch shops');
                }
            } catch (error) {
                console.error('Error fetching shops:', error);
            }
        };

        fetchShops();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!code || !discount || !selectedShopId) {
            alert('Molimo ispunite sva polja.');
            return;
        }

        const discountData = {
            code,
            discount,
            shopId: selectedShopId,
        };

        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/addDiscount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(discountData),
            });

            if (response.ok) {
                alert('Popust je uspješno dodan.');
                navigate('../discounts'); // Promijenite putanju prema potrebi
            } else {
                alert('Dodavanje popusta nije uspjelo.');
            }
        } catch (error) {
            console.error('Greška:', error);
            alert('Dodavanje popusta nije uspjelo.');
        }
    };

    return (
        <div className="pozadina3">
            <div className="event-creator">
                <h1 className="dodajDogadjaj">Dodaj novi popust</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="code">Kod popusta:</label>
                        <input
                            id="code"
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            placeholder="Unesite kod popusta"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="discount">Postotak popusta:</label>
                        <input
                            id="discount"
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            required
                            placeholder="Unesite postotak popusta"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="shop">Odaberite trgovinu:</label>
                        <select
                            id="shop"
                            value={selectedShopId}
                            onChange={(e) => setSelectedShopId(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Odaberite trgovinu
                            </option>
                            {shops.map((shop) => (
                                <option key={shop.id} value={shop.id}>
                                    {shop.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="submit-button">
                        Dodaj popust
                    </button>
                </form>

                <button className="back-button" onClick={() => navigate('/MyDiscounts')}>
                    Natrag
                </button>
            </div>
        </div>
    );
};

export default AddDiscount;