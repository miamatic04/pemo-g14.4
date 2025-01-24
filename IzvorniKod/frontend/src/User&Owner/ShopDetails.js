import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../stilovi/ShopDetails.css';
import ReportPopup from '../Components/ReportPopUp';
import logo1 from '../Components/Assets/logo1.png';

const ShopDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [shopDetails, setShopDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [isReportPopupOpen, setIsReportPopupOpen] = useState(false); // Popup state
    const reviewsPerPage = 2;
    const userRole = localStorage.getItem('role');

    // Get shopId from location state
    let shopId;
    if(location.state)
        shopId = location.state.shopId;
    if(!shopId)
        shopId = localStorage.getItem("selectedShopId");

    useEffect(() => {
        const fetchShopDetails = async () => {
            if (!shopId) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/shops/${shopId}`, {
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
                console.log(data);
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

    const handleReportClick = (reviewId) => {
        // Set the review ID to be reported and open the ReportPopup
        localStorage.setItem("reportedReviewId", reviewId);
        setIsReportPopupOpen(true);
    };

    return (
        <div className="shop-page">
            <div className="shop-container">
                {/* Left Panel */}
                <div className="left-panel">
                    <div className="shop-card">
                        <div className="shop-image">
                            {shopDetails.imagePath && (
                                <img src={shopDetails.imagePath} alt={shopDetails.shopName} />
                            )}
                        </div>
                        <h2>{shopDetails.shopName}</h2>
                        <p className="info3">Opis: {shopDetails.description}</p>

                        {shopDetails.shopOwner && (
                            <div className="owner-actions">
                                <button onClick={() => navigate('/edit-shop', { state: { shopId } })}>
                                    Uredi informacije
                                </button>
                            </div>
                        )}

                        {/* Reviews Section */}
                        <div className="reviews-section">
                            <h3>Recenzije:</h3>
                            {getCurrentReviews().map((review, index) => (
                                <div key={index} className="review-item">
                                    <div className="review-content">
                                        <span>{review.author}:</span>
                                        <span className="rating">{review.rating}★</span>
                                        <div className="review-text">{review.text}</div>
                                    </div>
                                    <p
                                        className="prijavi1"
                                        onClick={() => handleReportClick(review.id)} // When clicked, open the report popup
                                    >
                                        Prijavi recenziju
                                    </p>
                                </div>
                            ))}

                            {/* Pagination */}
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

                            {!shopDetails.shopOwner && (
                                <button
                                    className="add-review"
                                    onClick={() => {localStorage.setItem("selectedShopId", shopId); localStorage.setItem("cameFrom", "shop"); navigate('/review', { state: { shopId } })}}
                                >
                                    Ostavi recenziju
                                </button>
                            )}

                            {/* Report Shop */}
                            {!shopDetails.shopOwner && <p
                                className="prijavi1"
                                onClick={() => {
                                    localStorage.setItem("reportedShopId", shopId);
                                    setIsReportPopupOpen(true)
                                }} // Open popup
                            >
                                Prijavi trgovinu
                            </p>}

                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="right-panel">
                    <div className="logo1">
                        <img
                            src={logo1}
                            onClick={() => navigate(userRole === 'owner' ? '/ownerhome' : '/userhome')}
                            style={{ cursor: 'pointer' }}
                            alt="Logo"
                        />
                    </div>

                    {/* Product List */}
                    <div className="product-list">
                        <h3>Popis proizvoda:</h3>
                        {shopDetails.products && shopDetails.products.length > 0 ? (
                            <ul className="product-items">
                                {shopDetails.products.map((product, index) => (
                                    <li key={index} className="product-item">
                                        <h4>{product.name}</h4>
                                        <p>{product.description}</p>
                                        <p>Cijena: {product.price} €</p>
                                        {/* Edit button */}
                                        <button
                                            className="edit-product-btn"
                                            onClick={() => {
                                                localStorage.setItem("selectedProductId", product.id);
                                                navigate("/editProduct");
                                            }}
                                        >
                                            Uredi
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Nema dostupnih proizvoda</p>
                        )}

                        {shopDetails.shopOwner && (
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

            {/* Report Popup */}
            {isReportPopupOpen && (
                <ReportPopup
                    onClose={() => setIsReportPopupOpen(false)}
                />
            )}
        </div>
    );
};

export default ShopDetails;
