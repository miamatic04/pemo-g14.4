import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../stilovi/myDiscounts.css';
import logo1 from '../Components/Assets/logo1.png';

const MyDiscounts = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('role');
    const [shops, setShops] = useState([]);
    const [selectedShopId, setSelectedShopId] = useState(null);
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch the shops when the component mounts
    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/owner/getMyShops`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch shops');
                }

                const shopsData = await response.json();
                setShops(shopsData);
                if (shopsData.length > 0) {
                    setSelectedShopId(shopsData[0].id); // Set the first shop by default
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching shops:', error);
                setLoading(false);
            }
        };

        fetchShops();
    }, []);

    // Fetch the discounts based on the selected shop
    useEffect(() => {
        const fetchDiscounts = async () => {
            if (!selectedShopId) return; // If no shop is selected, do nothing

            try {
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getShopDiscounts/${selectedShopId}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch discounts');
                }

                const discountsData = await response.json();
                setDiscounts(discountsData);
            } catch (error) {
                console.error('Error fetching discounts:', error);
            }
        };

        fetchDiscounts();
    }, [selectedShopId]); // Refetch discounts whenever selectedShopId changes

    const handleShopChange = (event) => {
        setSelectedShopId(event.target.value); // Update selected shop
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="page-container-discounts-owner">
            {/* Header */}
            <div className="header-discounts-owner">
                <div className="logo-container-discounts-owner">
                    <img
                        src={logo1}
                        alt="Logo"
                        className="logo"
                        onClick={() => navigate(userRole === 'owner' ? '/ownerhome' : '/userhome')}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <h1 className="header-title-discounts-owner">Popusti i ponude</h1>

                {/* Shop Selector */}
                <select
                    className="shop-select"
                    value={selectedShopId}
                    onChange={handleShopChange}
                >
                    {shops.map((shop) => (
                        <option key={shop.id} value={shop.id}>
                            {shop.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Discounts Grid */}
            <button className="dodajNoviPopust" onClick={() => navigate('/addDiscount')}>Dodaj novi popust</button>
            <div className="discounts-container-owner">
                {discounts.map((discount) => (
                    <div key={discount.id} className="discount-card-owner">
                        <div className="discount-percentage-owner">
                            {discount.discount * 100}% {/* Displaying the discount percentage */}
                        </div>
                        <p className="discount-title-owner">{discount.code}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyDiscounts;
