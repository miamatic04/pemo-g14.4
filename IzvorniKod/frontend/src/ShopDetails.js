import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './stilovi/ShopDetails.css';
import logo1 from './Components/Assets/logo1.png';

const ShopDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [shopDetails, setShopDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 2;
    const userRole = localStorage.getItem('role');

    // Dohvaćamo shopId iz location state
    const shopId = location.state?.shopId;

    console.log('Location state:', location.state); // Debug
    console.log('Shop ID:', shopId); // Debug

    useEffect(() => {
        const fetchShopDetails = async () => {
            if (!shopId) {
                console.log('No shop ID found in state'); // Debug
                setLoading(false);
                return;
            }

            try {
                console.log('Fetching shop details for ID:', shopId); // Debug
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/shops/${shopId}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                console.log('Response:', response); // Debug

                if (!response.ok) {
                    throw new Error('Failed to fetch shop details');
                }

                const data = await response.json();
                console.log('Fetched shop data:', data); // Debug
                setShopDetails(data);
            } catch (error) {
                console.error('Error fetching shop details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchShopDetails();
    }, [shopId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!shopId) {
        return <div>No shop ID provided</div>;
    }

    if (!shopDetails) {
        return <div>No shop details found</div>;
    }

    const totalPages = Math.ceil((shopDetails?.reviews?.length || 0) / reviewsPerPage);

    const getCurrentReviews = () => {
        if (!shopDetails?.reviews) return [];
        const startIndex = (currentPage - 1) * reviewsPerPage;
        return shopDetails.reviews.slice(startIndex, startIndex + reviewsPerPage);
    };

    return (
        <div className="shop-page">
            <div className="shop-container">
                <div className="left-panel">
                    <div className="shop-card">
                        <div className="shop-image">
                            {shopDetails.imagePath && (
                                <img src={shopDetails.imagePath} alt={shopDetails.shopName} />
                            )}
                        </div>
                        <h2>{shopDetails.shopName}</h2>
                        <p className="info3">Opis: {shopDetails.description}</p>

                        {userRole === 'owner' && (
                            <div className="owner-actions">
                                <button onClick={() => navigate('/edit-shop', {
                                    state: { shopId: shopId }
                                })}>
                                    Uredi informacije
                                </button>
                                {/*<button onClick={() => navigate('/change-image', {
                                    state: { shopId: shopId }
                                })}>
                                    Promijeni sliku
                                </button> */}
                            </div>
                        )}

                        <div className="reviews-section">
                            <h3>Recenzije:</h3>
                            {getCurrentReviews().map((review, index) => (
                                <div key={index} className="review-item">
                                    <div className="review-content">
                                        <span>{review.author}:</span>
                                        <span className="rating">{review.rating}★</span>
                                        <div className="review-text">{review.text}</div>
                                        {/*{Boolean(review.imagePath) && (
                                            <div className="review-image">
                                                <img src={review.imagePath} alt="Review"/>
                                            </div>
                                        )}
                                    <span>{review.author}: {review.text}</span>
                                    <span>Ocjena: {review.rating}</span>*/}
                                    </div>
                                    {userRole === 'owner' && (
                                        <button onClick={() => navigate('/comment-review', {
                                            state: {reviewId: review.id}
                                        })}>
                                            Komentiraj
                                        </button>
                                    )}
                                    <p className="prijavi1" id="prijavi12">Prijavi recenziju</p>
                                </div>
                            ))}

                            {shopDetails.reviews && shopDetails.reviews.length > 0 && (
                                <div className="pagination">
                                    <button
                                        className="nav-btn"
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        &lt;
                                    </button>
                                    <span className="page-numbers">
                                        {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        className="nav-btn"
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        &gt;
                                    </button>
                                </div>
                            )}

                            {userRole !== 'owner' && (
                                <button
                                    className="add-review"
                                    onClick={() => navigate('/review', {
                                        state: { shopId: shopId }
                                    })}
                                >
                                    Ostavi recenziju
                                </button>
                            )}
                            <p className="prijavi1">Prijavi trgovinu</p>
                        </div>
                    </div>
                </div>

                <div className="right-panel">
                    <div className="logo1">
                        <img
                            src={logo1}
                            onClick={() => navigate(userRole === 'owner' ? '/ownerhome' : '/userhome')}
                            style={{ cursor: 'pointer' }}
                            alt="Logo"
                        />
                    </div>

                    <div className="product-list">
                        <h3>Popis proizvoda:</h3>
                        {shopDetails.products && shopDetails.products.length > 0 ? (
                            <ul className="product-items">
                                {shopDetails.products.map((product, index) => (
                                    <li key={index} className="product-item">
                                        <h4>{product.name}</h4>
                                        <p>{product.description}</p>
                                        <p>Cijena: {product.price} €</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Nema dostupnih proizvoda</p>
                        )}

                        {userRole === 'owner' && (
                            <button
                                className="add-product-btn"
                                onClick={() => {
                                    localStorage.setItem("shopId", shopId);
                                    navigate("/addProduct");
                                }}
                            >
                                Dodaj novi proizvod
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopDetails;