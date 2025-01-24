import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/shopsList.css';
import logo1 from './Components/Assets/logo1.png';

const ShopsList = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('role');
    const [shops, setShops] = useState([]); // Stanje za trgovine
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('AZ'); // Početni redosled sortiranja
    const [currentPage, setCurrentPage] = useState(1);
    const shopsPerPage = 8;

    // Funkcija za preuzimanje trgovina
    const fetchShops = async () => {
        try {
            let url;
            if (sortOrder === 'AZ') {
                url = `http://${process.env.REACT_APP_WEB_URL}:8080/home/getShopsAZ`;
            } else if (sortOrder === 'ZA') {
                url = `http://${process.env.REACT_APP_WEB_URL}:8080/home/getShopsZA`;
            } else if (sortOrder === 'udaljenostBlizi') {
                url = `http://${process.env.REACT_APP_WEB_URL}:8080/home/getShopsByDistanceAsc`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch shops');
            }

            const data = await response.json();
            setShops(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching shops:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShops();
    }, [sortOrder]);

    // Filtriranje i paginacija
    const totalPages = Math.ceil(shops.length / shopsPerPage);
    const getCurrentShops = () => {
        const startIndex = (currentPage - 1) * shopsPerPage;
        return shops.slice(startIndex, startIndex + shopsPerPage);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="shopsList-page">
            <div className="header-shopsList">
                <div className="logo-container">
                    <img
                        src={logo1}
                        alt="Logo"
                        className="logo"
                        onClick={() => navigate(userRole === 'owner' ? '/ownerhome' : '/userhome')}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <h1 className="header-title">Popis trgovina</h1>
                <div className="filter-container-list">
                    <label className="labellll">
                        Sortiraj po:
                    </label>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="select-filter-shopList"
                        >
                            <option value="AZ">Nazivu A-Z</option>
                            <option value="ZA">Nazivu Z-A</option>
                            <option value="udaljenostBlizi">Udaljenosti (prvo bliži)</option>
                        </select>
                </div>
            </div>

            <div className="spacer"></div>
            <div className="shop-container">
                {getCurrentShops().map((shop) => (
                    <div
                        key={shop.shopDTO.id}
                        className="shops-card"
                        onClick={() =>
                            navigate('/shop', { state: { shopId: shop.shopDTO.id } })
                        }
                    >
                        <img src={shop.shopDTO.imagePath} alt={shop.shopDTO.shopName} className="shop-image" />
                        <h2 className="shop-name-list">{shop.shopDTO.shopName}</h2>
                        <p className="shop-description">{shop.shopDTO.description}</p>
                        <p className="shop-distance">{shop.distance} km</p>
                    </div>
                ))}
            </div>

            {/* Navigacija za listanje stranica */}
            <div className="pagination">
                <button
                    className="navigation-btn"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>
                <span className="page-number">
                    {[...Array(totalPages)].map((_, index) => (
                        <span
                            key={index + 1}
                            className={currentPage === index + 1 ? "active" : ""}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </span>
                    ))}
                </span>
                <button
                    className="navigation-btn"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default ShopsList;