import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/addDiscount.css'; // Prilagodite putanju prema vašim potrebama

const AddDiscount = () => {
    const [code, setCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [shops, setShops] = useState([]);
    const [selectedShopId, setSelectedShopId] = useState('');

    const navigate = useNavigate();

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
        <div className="pozadina-add-discount">
            <div className="add-discount-creator">
                <h1 className="dodajPopust">Dodaj novi popust</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-add-discount">
                        <label htmlFor="code-popust" className="label-add-discount">Kod popusta:</label>
                        <input className="input-add-discount"
                            id="code"
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            placeholder="Unesite kod popusta"
                        />
                    </div>

                    <div className="form-group-add-discount">
                        <label htmlFor="discount-percentage" className="label-add-discount">Postotak popusta:</label>
                        <input className="input-add-discount"
                            id="discount"
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            required
                            placeholder="Unesite postotak popusta"
                        />
                    </div>

                    <div className="form-group-add-discount">
                        <label htmlFor="shop" className="label-add-discount">Odaberite trgovinu:</label>
                        <select className="select-add-discount"
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

                    <button type="submit" className="submit-button-add-discount">
                        Dodaj popust
                    </button>
                </form>

                <button className="back-button-add-discount" onClick={() => navigate('/MyDiscounts')}>
                    Natrag
                </button>
            </div>
        </div>
    );
};

export default AddDiscount;