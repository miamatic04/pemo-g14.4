import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/addDiscount.css'; // Ensure this path is correct

const AddDiscount = () => {
    const [code, setCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [shops, setShops] = useState([]);
    const [selectedShopId, setSelectedShopId] = useState('');
    const navigate = useNavigate();
    const [authenticationTried, setAuthenticationTried] = useState(false);

    const checkTokenValidation = async () => {
        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/validateToken`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok || !(localStorage.getItem("role") === "owner")) {
                if(localStorage.getItem("role") === "user")
                    navigate("/userhome");
                else if(localStorage.getItem("role") === "moderator")
                    navigate("/moderatorhome");
                else if(localStorage.getItem("role")=== "admin")
                    navigate("/adminhome");
                else
                    navigate("/");
            }

        } catch (error) {
            console.log(error);
            navigate("/");
        }
    };

    // Fetch shops on component mount
    useEffect(() => {

        if(!authenticationTried) {
            setAuthenticationTried(true);
            checkTokenValidation();
        }
        const fetchShops = async () => {
            try {
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/owner/getMyShops`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch shops');
                }

                const shopsData = await response.json();
                setShops(shopsData);
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
            discount: discount / 100, // Store as a decimal
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
                navigate('../myDiscounts'); // Change the path if necessary
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
                        <input
                            className="input-add-discount"
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
                        <input
                            className="input-add-discount"
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
                        <select
                            className="select-add-discount"
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
