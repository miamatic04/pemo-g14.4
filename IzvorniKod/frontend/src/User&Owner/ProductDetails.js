import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../stilovi/ProductDetails.css';
import logo1 from '../Components/Assets/logo1.png';
import ReportPopup from '../Components/ReportPopUp';  // Import the ReportPopup component

const ProductDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [productDetails, setProductDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const userRole = localStorage.getItem('role');
    const [cartMessage, setCartMessage] = useState('');
    const [shopId, setShopId] = useState(null);
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
    const [addedMessage, setAddedMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 2;
    let productId;
    if(location.state)
        productId = location.state.productId;
    if(!shopId)
        productId = localStorage.getItem("selectedProductId");

    const shopName = localStorage.getItem('selectedShopName');
    const [showReportPopup, setShowReportPopup] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getProduct/${productId}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (!productResponse.ok) {
                    throw new Error('Failed to fetch product details');
                }
                const productDataResponse = await productResponse.json();
                setProductDetails(productDataResponse);

                // Dohvati trgovine koristeći shopName iz localStorage
                const shopsResponse = await fetch(
                    `http://${process.env.REACT_APP_WEB_URL}:8080/home/getShopsAZ`,
                    {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                if (!shopsResponse.ok) {
                    throw new Error('Failed to fetch shops');
                }

                const shopsData = await shopsResponse.json();
                // Use shopName from localStorage
                const shop = shopsData.find(shop => shop.shopDTO.shopName === shopName);
                if (shop) {
                    setShopId(shop.shopDTO.id);
                    localStorage.setItem('selectedShopId', shop.shopDTO.id); // Store shopId in localStorage
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Remove dependency on productData

    const handleAddReview = () => {
        if (!shopId) {
            console.error('Shop ID not found');
            return;
        }
        localStorage.setItem("cameFrom", "product");
        navigate('/review', { state: { productId } });
    };
    const addToCart = () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const productExists = cart.find((item) => item.id === productId);
        console.log('productExists=', productExists);

        if (productExists) {
            setCartMessage('Proizvod je već u košarici.');
            productExists.quantity += 1;
        } else {
            console.log('hi');
            cart.push({
                id: productId,
                name: productDetails.name,
                price: productDetails.price,
                imagePath: productDetails.imagePath,
                quantity: 1,
            });
            setCartMessage('Proizvod je dodan u košaricu!');
        }

        console.log('cart:', cart)

        console.log(cartMessage)
        localStorage.setItem('cart', JSON.stringify(cart));

        setAddedMessage('Dodano u košaricu!');

        // Obriši poruku nakon 4 sekunde
        setTimeout(() => {
            setAddedMessage('');
        }, 4000);

        setTimeout(() => setCartMessage(''), 3000);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const totalPages = Math.ceil((productDetails?.reviews?.length || 0) / reviewsPerPage);

    const getCurrentReviews = () => {
        if (!productDetails?.reviews) return [];
        const startIndex = (currentPage - 1) * reviewsPerPage;
        return productDetails.reviews.slice(startIndex, startIndex + reviewsPerPage);
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

    const handleReportClick = () => {
        // Set the productId to be reported and show the ReportPopup
        localStorage.setItem("reportedProductId", productId);
        setShowReportPopup(true);
    };

    const handleReportClick2 = (reviewId) => {
        // Set the productId to be reported and show the ReportPopup
        console.log(reviewId);
        localStorage.setItem("reportedReviewId", reviewId);
        setShowReportPopup(true);
    };

    return (
        <div className="product-page">
            <div className="product-container">
                <div className="left-panel">
                    <div className="shop-card">
                        <div className="shop-image">
                            <img src={productDetails?.imagePath} alt="Proizvod"/>
                        </div>
                        <h2>{productDetails?.name}</h2>
                        <p className="info3" id="ime">Informacije o proizvodu:</p>
                        <p className="info3">Kategorija: {productDetails?.category}</p>
                        <p className="info3">Opis: {productDetails?.description}</p>
                        <p className="info3">Cijena: {productDetails?.price} €</p>
                        <p style={{
                            color: '#007bff',
                            fontSize: '18px',
                            textAlign: 'center',
                            height: '20px',
                            margin: '10px 0'
                        }}>
                            {addedMessage}
                        </p>
                        <button className="add-to-cart" onClick={addToCart}>
                            <i className="fas fa-shopping-cart"></i> Dodaj u košaricu
                        </button>
                        <p className="prijavi1" onClick={handleReportClick}>Prijavi proizvod</p>
                    </div>
                    <a onClick={() => navigate(-1)} className="back-button22">
                        ← Natrag
                    </a>
                </div>

                <div className="right-panel">
                    <div className="logo111">
                    <img src={logo1} onClick={() => navigate(userRole === 'owner' ? '/ownerhome' : '/userhome')}
                             style={{ cursor: 'pointer' }}/>
                    </div>

                    <div className="reviews-section">
                        <div className="review-header">
                            <h3>Recenzije:</h3>
                            <button
                                className="add-review"
                                onClick={handleAddReview}
                            >
                                Ostavi recenziju
                            </button>
                        </div>

                        <div className="review-items">
                            {getCurrentReviews().map((review, index) => (
                                <div className="review-item">
                                    <div className="review-content-wrapper">
                                        <div className="review-content">
                                            <span className="auth">{review.author}:</span>
                                            <span className="rating">{review.rating}★</span>
                                            <div className="review-text">{review.text}</div>
                                        </div>
                                        {Boolean(review.imagePath) && (
                                            <div className="review-image">
                                                <img src={review.imagePath} alt="Review"/>
                                            </div>
                                        )}
                                    </div>
                                    <p className="prijavi" onClick={() => handleReportClick2(review.id)}>Prijavi recenziju</p>
                                </div>
                            ))}
                        </div>

                        <div className="pagination">
                            <button className="nav1-btn" onClick={handlePrevPage}
                                    disabled={currentPage === 1}>&lt;</button>
                            <span className="page-numbers">
                                {[...Array(totalPages)].map((_, index) => (
                                    <span key={index + 1} className={currentPage === index + 1 ? "active" : ""}
                                          onClick={() => setCurrentPage(index + 1)}>
                                        {index + 1}
                                    </span>
                                ))}
                            </span>
                            <button className="nav-btn" onClick={handleNextPage}
                                    disabled={currentPage === totalPages}>&gt;</button>
                        </div>
                    </div>
                </div>
            </div>
            {showReportPopup && (
                <ReportPopup
                    onClose={() => setShowReportPopup(false)}
                />
            )}
        </div>
    );
};

export default ProductDetails;