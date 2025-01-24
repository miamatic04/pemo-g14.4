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

    const mapOrderDTOToCart = (orderDTO) => {
        // Map the products from the orderDTO to match the cart structure
        const cartItems = orderDTO.orderProducts.map(orderProduct => {
            const product = orderProduct.product;

            return {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: orderProduct.quantity,
                imagePath: product.imagePath,
                shopName: product.shopName,
                shopId: product.shopId
            };
        });

        // Return the cart in the required structure
        return cartItems;
    };

    const handleAddToCart = async () => {
        try {
            const token = localStorage.getItem("token");
            const storedOrderId = localStorage.getItem("orderId");

            const data = {
                productId: product.id,
                quantity: quantity,
                orderId: storedOrderId || null, // Leave empty if not in localStorage
            };

            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/addToOrder`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);
                if (result.id) {
                    // Save the new orderId to localStorage
                    localStorage.setItem("orderId", result.id);
                }
                const cartItems = mapOrderDTOToCart(result);

                // Save the transformed cart to localStorage
                localStorage.setItem('cart', JSON.stringify(cartItems));

                // Optionally, log it to the console for debugging
                console.log('Mapped cart items:', cartItems);
                console.log("Product added to cart successfully:", result);
            } else {
                console.error("Failed to add product to cart:", response.statusText);
            }
        } catch (error) {
            console.error("Error adding product to cart:", error);
        } finally {
            onClose();
        }
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
                        onClick={() =>  {localStorage.setItem("selectedProductId", product.id); navigate('/product', {
                            replace: false,
                            state: {
                                productId: product.id,
                            }
                        })}}
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

