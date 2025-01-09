import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './stilovi/ProductDetails.css';
import shopIcon from './Components/Assets/trgovina1.jpg';
import logo1 from './Components/Assets/logo1.png';

const ProductDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const productData = location.state || {};

    const allReviews = [
        { rating: "4,8", text: "Dobra kvaliteta" },
        { rating: "5,0", text: "Najbolji proizvod" },
        { rating: "4,5", text: "Odlični proizvodi" },
        { rating: "4,7", text: "Super kvaliteta" },
        { rating: "4,9", text: "Brza dostava" },
        { rating: "4,6", text: "Dobar omjer cijene i kvalitete" }
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 2;
    const totalPages = Math.ceil(allReviews.length / reviewsPerPage);

    const getCurrentReviews = () => {
        const startIndex = (currentPage - 1) * reviewsPerPage;
        return allReviews.slice(startIndex, startIndex + reviewsPerPage);
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
                            <img src={productData.productImage} alt="Trgovina"/>
                        </div>
                        <h2>{productData.productName}</h2>
                        <p className="info3" id="ime">Informacije o proizvodu:</p>
                        <p className="info3">Trgovina: {productData.productStore}</p>
                        <p className="info3">Udaljenost: {productData.productUdaljenost}</p>
                        <p className="info3">Kategorija: {productData.productKategorija}</p>
                        <p className="info3">Cijena: {productData.productCijena}</p>
                        <button className="add-to-cart">
                            <i className="fas fa-shopping-cart"></i> Dodaj u košaricu
                        </button>
                    </div>
                </div>

                <div className="right-panel">
                    <div className="logo1">
                        <img src={logo1}/>
                    </div>

                    <div className="reviews-section">
                        <div className="review-header">
                            <h3>Recenzije:</h3>
                            <button className="add-review">Ostavi recenziju</button>
                        </div>

                        <div className="review-items">
                            {getCurrentReviews().map((review, index) => (
                                <div className="review-item" key={index}>
                                    <span className="rating">{review.rating}</span>
                                    <span className="review-text">{review.text}</span>
                                    <div className="review-image">
                                        prostor za sliku
                                    </div>
                                </div>

                            ))}
                        </div>

                        <div className="pagination">
                            <button
                                className="nav1-btn"
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                            >
                                &lt;
                            </button>
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
                            <button
                                className="nav-btn"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;