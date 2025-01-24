import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/Cart.css';
import logo1 from './Components/Assets/logo1.png';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [savedAmount, setSavedAmount] = useState(0);
    const [promoCodeApplied, setPromoCodeApplied] = useState(false); // NEW
    const [appliedShopId, setAppliedShopId] = useState(null); // Track which shop the discount applies to
    const navigate = useNavigate();
    const userRole = localStorage.getItem('role');

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);
    }, []);

    const updateQuantity = async (productId, change) => {
        const storedOrderId = localStorage.getItem("orderId");
        const token = localStorage.getItem("token");

        try {
            const data = {
                orderId: storedOrderId,
                productId: productId,
                quantity: change,
            };

            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/addToOrder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.code) alert("Out of stock.");
            }

            if (response.ok) {
                const updatedOrder = result;

                const updatedCart = updatedOrder.orderProducts.map(orderProduct => ({
                    id: orderProduct.product.id,
                    name: orderProduct.product.name,
                    price: orderProduct.product.price,
                    quantity: orderProduct.quantity,
                    imagePath: orderProduct.product.imagePath,
                    shopName: orderProduct.product.shopName,
                    shopId: orderProduct.product.shopId
                }));

                setCart(updatedCart);
                localStorage.setItem("cart", JSON.stringify(updatedCart));

                // Recalculate discounts if a promo code is applied
                if (promoCodeApplied) {
                    applyDiscountToCart(updatedCart, discount, appliedShopId);
                }
            } else {
                console.error("Failed to update quantity:", response.statusText);
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const removeItem = async (productId, quantity) => {
        const storedOrderId = localStorage.getItem("orderId");
        const token = localStorage.getItem("token");

        try {
            const data = {
                orderId: storedOrderId,
                productId: productId,
                quantity: quantity,
            };

            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/removeFromOrder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const updatedCart = cart.filter(item => item.id !== productId);
                setCart(updatedCart);
                localStorage.setItem("cart", JSON.stringify(updatedCart));

                // Recalculate discounts if a promo code is applied
                if (promoCodeApplied) {
                    applyDiscountToCart(updatedCart, discount, appliedShopId);
                }
            }
        } catch (error) {
            console.error("Error removing item from cart:", error);
            alert("Došlo je do pogreške prilikom uklanjanja proizvoda.");
        }
    };

    const applyDiscountToCart = (cart, discount, shopId) => {
        let totalSaved = 0;

        const updatedCart = cart.map(item => {
            if (item.shopId === shopId) {
                const originalTotal = parseFloat(item.price) * parseInt(item.quantity, 10);
                const discountValue = originalTotal * (parseFloat(discount) || 0);

                totalSaved += discountValue;

                return {
                    ...item,
                    discountedPrice: ((originalTotal - discountValue) / item.quantity).toFixed(2),
                };
            }
            return item;
        });

        setCart(updatedCart);
        setSavedAmount(totalSaved.toFixed(2));
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const handlePromoCodeApply = async () => {
        if (promoCodeApplied) {
            alert("Promotivni kod je već primijenjen.");
            return;
        }

        const token = localStorage.getItem("token");
        const data = { code: promoCode };
        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/applyDiscount`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                const { discount, shopId } = result;
                setDiscount(parseFloat(discount) || 0);
                setPromoCodeApplied(true);
                setAppliedShopId(shopId); // Track the shopId for future recalculations

                applyDiscountToCart(cart, discount, shopId); // Apply discount to the cart
            } else {
                alert(result.message || "Neispravan promotivni kod.");
            }
        } catch (error) {
            console.error("Error applying promo code:", error);
        }
    };

    const calculateTotal = () => {
        let total = 0;

        cart.forEach(item => {
            const itemPrice = item.discountedPrice
                ? parseFloat(item.discountedPrice) * item.quantity
                : item.price * item.quantity;

            total += isNaN(itemPrice) ? 0 : itemPrice;
        });

        return total.toFixed(2);
    };

    const proceedToPayment = () => {
        navigate('/payment', { state: { totalPrice: calculateTotal() } });
    };

    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <h2>Vaša košarica je prazna!</h2>
                <button onClick={() => navigate('/userhome')}>Natrag</button>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-header">
                    <img className="logo" src={logo1} onClick={() => navigate(userRole === 'owner' ? '/ownerhome' : '/userhome')}></img>
                    <h1 className="cart-header-title">Vaša košarica</h1>
                </div>
                <div className="cart-content">
                    <div className="left-column">
                        <div className="cart-item-row header">
                            <p className="cart-item-column">Proizvod</p>
                            <p className="cart-item-column">Količina</p>
                            <p className="cart-item-column">Cijena</p>
                            <p className="cart-item-column">Ukupno</p>
                            <p className="cart-item-column"></p>
                        </div>
                        {cart.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item-row">
                                    <div className="cart-item-column">
                                        <img src={item.imagePath} alt={item.name} className="cart-item-image" />
                                        <p>{item.name}</p>
                                        <p className="shop-name">{item.shopName}</p>
                                    </div>
                                    <div className="cart-item-column">
                                        <div className="quantity-controls">
                                            <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                                            <div className="quantity-display">{item.quantity}</div>
                                            <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                                        </div>
                                    </div>
                                    <div className="cart-item-column"> <p className="za-mob">Cijena: </p> €{item.discountedPrice || item.price}</div>
                                    <div className="cart-item-column"> <p className="za-mob">Ukupno: </p>€{((item.discountedPrice || item.price) * item.quantity).toFixed(2)}</div>
                                    <div className="cart-item-column">
                                        <button className="remove-item" onClick={() => removeItem(item.id, item.quantity)}>
                                            Ukloni
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="right-column">
                        <h2>Sažetak narudžbe</h2>
                        <p>Ukupna količina proizvoda: {totalQuantity}</p>
                        <div className="promo-code">
                            <input
                                type="text"
                                placeholder="Unesite promotivni kod"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                disabled={promoCodeApplied} // Disable input if promo code applied
                            />
                            <button onClick={handlePromoCodeApply} disabled={promoCodeApplied}>
                                {promoCodeApplied ? "Kod primijenjen" : "Primjeni"}
                            </button>
                        </div>
                        <p>Ukupna cijena: €{calculateTotal()}</p>
                        <p>Ušteđeno: €{savedAmount}</p>
                        <button className="proceed-to-payment" onClick={proceedToPayment}>
                            Plaćanje
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
