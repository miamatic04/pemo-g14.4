import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './stilovi/ProductDetails.css';
import logo1 from './Components/Assets/logo1.png';

const ProductDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const productData = location.state || {};
    const [productDetails, setProductDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const [cartMessage, setCartMessage] = useState('');
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []); // Definirajte stanje za košaricu


    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 2;

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getProduct/${productData.productId}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }
                const data = await response.json();
                setProductDetails(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product details:', error);
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productData.productId]);

    const addToCart = () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const productExists = cart.find((item) => item.id === productData.productId);
        console.log('productExists=', productExists);

        console.log("productDetails", productData);

        if (productExists) {
            setCartMessage('Proizvod je već u košarici.');
            productExists.quantity += 1;
        } else {
            console.log('hi');
            console.log(productData.productId);
            cart.push({
                id: productData.productId,
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
                        <button className="add-to-cart" onClick={addToCart}>
                            <i className="fas fa-shopping-cart"></i> Dodaj u košaricu
                        </button>
                    </div>
                </div>

                <div className="right-panel">
                    <div className="logo1">
                        <img src={logo1} onClick={() => navigate('/UserHome')}
                             style={{ cursor: 'pointer' }}/>
                    </div>

                    <div className="reviews-section">
                        <div className="review-header">
                            <h3>Recenzije:</h3>
                            <button className="add-review" onClick={() => navigate(`/review`)}>Ostavi recenziju</button>
                        </div>

                        <div className="review-items">
                            {getCurrentReviews().map((review, index) => (
                                <div className="review-item" key={index}>
                                    <span className="rating">{review.rating}</span>
                                    <span className="review-text">{review.text}</span>
                                    {Boolean(review.imagePath) && (
                                        <div className="review-image">
                                            <img src={review.imagePath} alt="Review"/>
                                        </div>
                                    )}
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
        </div>
    );
};

export default ProductDetails;