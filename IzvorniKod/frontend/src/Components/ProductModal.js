import React, { useState, useEffect } from 'react';
import '../stilovi/productModal.css';
import { useNavigate } from 'react-router-dom';

function ProductModal({ product, onClose }) {
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(product.price);

    useEffect(() => {
        setTotalPrice(product.price * quantity);
    }, [quantity, product.price]);

    const handleIncreaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleDecreaseQuantity = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    const handleAddToCart = () => {
        //TODO POST na /addToOrder
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <img src={product.imagePath || "/placeholder.svg"} alt={product.name} className="product-image" />
                <h2 className="product-name">{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <p className="product-price">Cijena: ${product.price.toFixed(2)}</p>
                <div className="quantity-container">
                    <button className="quantity-btn" onClick={handleDecreaseQuantity}>-</button>
                    <span className="quantity-display">{quantity}</span>
                    <button className="quantity-btn" onClick={handleIncreaseQuantity}>+</button>
                </div>
                <p className="total-price">Ukupno: ${totalPrice.toFixed(2)}</p>
                <div className="button-container">
                    <button
                        onClick={() => navigate('/product', {
                            replace: false,
                            state: {
                                productId: product.id,
                            }
                        })}
                        className="btn btn-profile">
                        Idi na profil proizvoda
                    </button>
                    <button onClick={onClose} className="btn btn-close">
                        Zatvori
                    </button>
                    <button onClick={handleAddToCart} className="btn btn-add">
                        Dodaj u košaricu
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductModal;

