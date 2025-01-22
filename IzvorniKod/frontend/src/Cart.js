import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/Cart.css';
import logo1 from './Components/Assets/logo1.png';


const Cart = () => {
    const [cart, setCart] = useState([]);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
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
            // Prepare the payload
            const data = {
                orderId: storedOrderId, // Use the stored order ID
                productId: productId,
                quantity: change, // Pass +1 or -1 based on button click
            };

            console.log("SENDING TO BACKEND");
            console.log(data);

            // Send the POST request
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/addToOrder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if(!response.ok) {
                if(result.code)
                    alert("Out of stock.");
            }

            if (response.ok) {
                // Parse the updated cart from the server response
                const updatedOrder = result;

                // Map the updated order to match the cart structure
                const updatedCart = updatedOrder.orderProducts.map(orderProduct => ({
                    id: orderProduct.product.id,
                    name: orderProduct.product.name,
                    price: orderProduct.product.price,
                    quantity: orderProduct.quantity,
                    imagePath: orderProduct.product.imagePath,
                    shopName: orderProduct.product.shopName,
                }));

                // Update the local state and localStorage
                setCart(updatedCart);
                localStorage.setItem("cart", JSON.stringify(updatedCart));
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
            // Prepare the payload
            const data = {
                orderId: storedOrderId, // Use the stored order ID
                productId: productId,
                quantity: quantity, // Pass the current quantity of the item
            };

            console.log("Sending request to remove item:", data);

            // Send the POST request to remove the item from the order
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

                console.log("Item removed from cart:", productId);
            }
        } catch (error) {
            console.error("Error removing item from cart:", error);
            alert("Došlo je do pogreške prilikom uklanjanja proizvoda.");
        }
    };

    const addToCart = (product) => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    
        const productIndex = storedCart.findIndex(item => item.id === product.id);
    
        if (productIndex >= 0) {
            // Proizvod već postoji, povećaj količinu
            storedCart[productIndex].quantity += 1;
        } else {
            // Ako proizvod nije u košarici, dodaj ga s početnom količinom 1
            storedCart.push({ ...product, quantity: 1 });
        }
    
        // Logiraj stanje košarice prije nego što ga spremiš
        console.log("Prije spremanja u localStorage:", storedCart);
    
        // Spremi u localStorage
        localStorage.setItem('cart', JSON.stringify(storedCart));
    
        // Ažuriraj stanje u React komponenti
        setCart(storedCart);
    
        // Logiraj stanje košarice nakon ažuriranja
        console.log("Nakon ažuriranja košarice:", storedCart);
    };
    

    const calculateTotal = () => {
        let total = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        total -= total * discount; 
        return total.toFixed(2);
    };

    const handlePromoCodeChange = (e) => {
        setPromoCode(e.target.value);
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
                    <img className="logo" src='logo1.png' onClick={() => navigate(userRole === 'owner' ? '/ownerhome' : '/userhome')}></img>
                    <h1>Vaša košarica</h1>
                </div>
                <div className="cart-content">
                    {/* Lijevi stupac - proizvodi */}
                    <div className="left-column">
                        {/* Podnaslovi */}
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
                                            <button onClick={() => updateQuantity(item.id, - 1)}>-
                                            </button>
                                            <div className="quantity-display">{item.quantity}</div>
                                            <button onClick={() => updateQuantity(item.id, + 1)}>+
                                            </button>
                                        </div>
                                    </div>
                                    <div className="cart-item-column">€{item.price}</div>
                                    <div className="cart-item-column">€{(item.price * item.quantity).toFixed(2)}</div>
                                    <div className="cart-item-column">
                                <button className="remove-item" onClick={() => removeItem(item.id, item.quantity)}>
                                    Ukloni
                                </button>
                                </div>
                                </div>
                            </div>
                        ))}
                    </div>
    
                    {/* Desni stupac - sažetak */}
                    <div className="right-column">
                        <h2>Sažetak narudžbe</h2>
                        <p>Ukupna količina proizvoda: {totalQuantity}</p>
                        <div className="promo-code">
                            <input
                                type="text"
                                placeholder="Unesite promotivni kod"
                                value={promoCode}
                                onChange={handlePromoCodeChange}
                            />
                            <button /*onClick={applyPromoCode}*/>Primjeni</button>
                        </div>
                        <p>Ukupna cijena: €{calculateTotal()}</p>
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
