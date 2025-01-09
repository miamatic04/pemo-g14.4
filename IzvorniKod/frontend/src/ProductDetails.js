import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './stilovi/ProductDetails.css';
import shopIcon from './Components/Assets/trgovina1.jpg';
import logo1 from './Components/Assets/logo1.png';

const ProductDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const productData = location.state || {};
    return (
        <div className="product-page">
            <div className="product-container">
                <div className="left-panel">
                    <div className="shop-card">
                        <div className="shop-image">
                            {/* Placeholder za sliku trgovine */}
                            <img src={productData.productImage} alt="Trgovina"/>
                        </div>
                        <h2>{productData.productName}</h2>
                        <p className="info3" id="ime">Informacije o proizvodu:</p>
                        <p className="info3">Trgovina:  {productData.productStore}</p>
                        <p className="info3">Udaljenost:  {productData.productUdaljenost}</p>
                        <p className="info3">Kategorija:  {productData.productKategorija}</p>
                        <p className="info3">Cijena:  {productData.productCijena}</p>
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
                            <div className="review-item">
                                <span className="rating">4,8</span>
                                <span className="review-text">Boja u tubi ima previše vode</span>
                            </div>
                            <div className="review-item">
                                <span className="rating">5,0</span>
                                <span className="review-text">Najbolji kistovi</span>
                            </div>
                        </div>

                        <div className="pagination">
                            <button className="nav-btn">&lt;</button>
                            <span className="page-numbers">
                                <span>1</span>
                                <span className="active">2</span>
                                <span>3</span>
                                <span>4</span>
                                <span>5</span>
                            </span>
                            <button className="nav-btn">&gt;</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;