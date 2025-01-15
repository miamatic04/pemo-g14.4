import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './stilovi/ShopDetails.css';
import logo1 from './Components/Assets/logo1.png';

const ShopDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const shopData = location.state || {};
    const [shopDetails, setShopDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 2;
    const userRole = localStorage.getItem('role'); // Assuming role is stored in localStorage

    useEffect(() => {
        const fetchShopDetails = async () => {
            try {
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getShop/${shopData.shopId}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch shop details');
                }
                const data = await response.json();
                setShopDetails(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching shop details:', error);
                setLoading(false);
            }
        };

        fetchShopDetails();
    }, [shopData.shopId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const totalPages = Math.ceil((shopDetails?.reviews?.length || 0) / reviewsPerPage);

    const getCurrentReviews = () => {
        if (!shopDetails?.reviews) return [];
        const startIndex = (currentPage - 1) * reviewsPerPage;
        return shopDetails.reviews.slice(startIndex, startIndex + reviewsPerPage);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="shop-page">
            <div className="shop-container">
                <div className="left-panel">
                    <div className="shop-card">
                        <div className="shop-image">
                            <img src={shopDetails?.imagePath} alt="Shop" />
                        </div>
                        <h2>{shopDetails?.name}</h2>

                        {/* Hide location for all users */}
                        {userRole !== 'owner' && (
                            <p className="info3">Lokacija: {shopDetails?.location}</p>
                        )}

                        <p className="info3">Opis: {shopDetails?.description}</p>

                        {/* Display options for 'owner' role */}
                        {userRole === 'owner' && (
                            <div className="owner-actions">
                                <button onClick={() => navigate(`/edit-shop/${shopData.shopId}`)}>Uredi informacije</button>
                                <button onClick={() => navigate(`/change-image/${shopData.shopId}`)}>Promijeni sliku</button>
                            </div>
                        )}

                        <div className="reviews-section">
                            <h3>Recenzije:</h3>
                            {getCurrentReviews().map((review, index) => (
                                <div key={index} className="review-item">
                                    <span>{review.username}: {review.comment}</span>
                                    {userRole === 'owner' && (
                                        <button onClick={() => navigate(`/comment-review/${review.id}`)}>Komentiraj</button>
                                    )}
                                </div>
                            ))}

                            <div className="pagination">
                                <button className="nav-btn" onClick={handlePrevPage} disabled={currentPage === 1}>&lt;</button>
                                <span className="page-numbers">
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
                                <button className="nav-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>&gt;</button>
                            </div>

                            {userRole !== 'owner' && (
                                <button className="add-review" onClick={() => navigate(`/review`)}>Ostavi recenziju</button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="right-panel">
    <div className="logo1">
        <img src={logo1} onClick={() => navigate('/UserHome')} style={{ cursor: 'pointer' }} />
    </div>

    <div className="product-list">
        <h3>Popis proizvoda:</h3>
        <ul className="product-items">
            {shopDetails?.products.map((product, index) => (
                <li key={index} className="product-item">
                    <h4>{product.name}</h4>
                    <p>{product.description}</p>
                </li>
            ))}
        </ul>

        {/* Gumb za dodavanje novog proizvoda, prikazuje se samo ako je korisnik 'owner' */}
        {userRole === 'owner' && (
            <button className="add-product-btn" onClick={() => navigate(`/addProduct/${shopData.shopId}`)}>
                Dodaj novi proizvod
            </button>
        )}
    </div>

    <div className="pagination">
        <button className="nav-btn" onClick={handlePrevPage} disabled={currentPage === 1}>&lt;</button>
        <span className="page-numbers">
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
        <button className="nav-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>&gt;</button>
    </div>
</div>


            </div>
        </div>
    );
};

export default ShopDetails;
