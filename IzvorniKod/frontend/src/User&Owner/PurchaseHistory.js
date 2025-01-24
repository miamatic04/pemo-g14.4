import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../stilovi/purchaseHistory.css';
import logo1 from "../Components/Assets/logo1.png";

const ShoppingCard = ({ order, status, price, date, shopName, onContinue, onCancel, onPause }) => {
    const getStatusStyle = () => {
        if (status === "u tijeku") return "in-progress";
        if (status === "nedovršeno") return "pending";
        if (status === "otkazano") return "cancelled";
    };

    const navigate = useNavigate();

    const handleDetailsClick = () => {
        localStorage.setItem('selectedOrder', JSON.stringify(order));
        navigate('/purchaseDetails');
    };

    return (
        <div className="shopping-card">
            <div className="card-content">
                <div>
                    <h3>Kupovina {date}</h3>
                </div>
                <div className="card-price-details">
                    <p className={`status ${getStatusStyle()}`}>{status}</p>
                    <p className="shop-name1">{shopName}</p>
                    <p className="price">{price}</p>
                    <a className="details-link" onClick={handleDetailsClick}>vidi detalje kupovine</a>
                    <div className="card-actions">
                        {status === "nedovršeno" && (
                            <>
                                <button className="continue-shopping" onClick={() => onContinue(order)}>
                                    Nastavi kupovinu
                                </button>
                                <button className="cancel-order" onClick={() => onCancel(order.id)}>
                                    Otkaži
                                </button>
                            </>
                        )}
                        {status === "u tijeku" && (
                            <>
                                <button className="pause-shopping" onClick={() => onPause(order.id)}>
                                    Pauziraj kupovinu
                                </button>
                                <button className="cancel-order" onClick={() => onCancel(order.id)}>
                                    Otkaži
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


const ShoppingPage = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('role');
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 3;

    const totalPages = Math.ceil(orders.length / ordersPerPage);
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const handlePauseShopping = (orderId) => {
        // Remove the orderId and cart from localStorage
        localStorage.removeItem('orderId');
        localStorage.removeItem('cart');

        // Optionally, update the order status in the UI if you want
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.originalOrder.id === orderId
                    ? { ...order, status: "nedovršeno" } // Reset the status to "nedovršeno"
                    : order
            )
        );

        alert('Kupovina je pauzirana. Možete nastaviti kad god želite.');
    };

    const handleContinueShopping = async (order) => {
        try {
            // Check if there is already an active order
            const activeOrder = orders.find(o => o.status === "u tijeku");

            if (activeOrder) {
                // Deactivate the current active order and set its status to "nedovršeno"
                setOrders(prevOrders =>
                    prevOrders.map(o =>
                        o.originalOrder.id === activeOrder.originalOrder.id
                            ? { ...o, status: "nedovršeno" } // Change the status of the current active order
                            : o
                    )
                );
                // Optionally, remove previous active order data from localStorage
                localStorage.removeItem('cart');
                localStorage.removeItem('orderId');
            }

            // Now activate the new order
            const token = localStorage.getItem('token');
            const orderId = order.id;
            const data = { id: orderId };

            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/activateOrder`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.code === "no-stock") {
                    alert('Neki proizvodi iz ove narudžbe trenutno nisu na zalihi. Nastavak kupovine nije moguć.');
                    return;
                }
                throw new Error(result.message || 'Neuspješan nastavak kupovine.');
            }

            // Activate the selected order by changing its status to "u tijeku"
            setOrders(prevOrders =>
                prevOrders.map(o =>
                    o.originalOrder.id === orderId
                        ? { ...o, status: "u tijeku" } // Set the status of the selected order to active
                        : o
                )
            );

            // Save the order data to localStorage
            const transformedCart = order.orderProducts.map((orderProduct) => ({
                id: orderProduct.product.id,
                name: orderProduct.product.name,
                price: orderProduct.product.price,
                quantity: orderProduct.quantity,
                imagePath: orderProduct.product.imagePath,
                shopName: order.shopName,
            }));

            // Save the transformed cart in localStorage
            localStorage.setItem('cart', JSON.stringify(transformedCart));
            localStorage.setItem('orderId', orderId);
            alert('Narudžba je uspješno učitana. Nastavite s kupovinom!');
            window.location.reload();
        } catch (error) {
            console.error('Greška prilikom nastavka kupovine:', error);
            alert('Došlo je do greške prilikom nastavka kupovine. Molimo pokušajte ponovno.');
        }
    };



    const handleCancelOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            const data = {
                id: orderId
            }
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/cancelOrder`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to cancel order');
            }


            // Update the orders list by marking the order as cancelled
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.originalOrder.id === orderId
                        ? { ...order, status: "otkazano" }
                        : order
                )
            );
            localStorage.removeItem('orderId');
            localStorage.removeItem('cart');
        } catch (error) {
            console.error('Error cancelling order:', error);
            setError('Došlo je do greške prilikom otkazivanja narudžbe');
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const currentOrderId = localStorage.getItem('orderId');

                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getAllOrders`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 401) {
                    navigate('/login');
                    return;
                }

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log(data);

                const transformedOrders = data.map(order => ({
                    originalOrder: order,
                    status: order.id == currentOrderId
                        ? "u tijeku"
                        : order.cancelled
                            ? "otkazano"
                            : "nedovršeno",
                    price: `${order.total.toFixed(2)} €`,
                    shopName: order.shopName || 'Nepoznata trgovina',
                    date: new Date(order.orderDate).toLocaleDateString('hr-HR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    }),
                }));

                // Sort orders: "u tijeku" -> "nedovršeno" -> "otkazano"
                transformedOrders.sort((a, b) => {
                    const statusPriority = { "u tijeku": 1, "nedovršeno": 2, "otkazano": 3 };
                    return statusPriority[a.status] - statusPriority[b.status];
                });

                setOrders(transformedOrders);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                if (error.message === 'No authentication token found') {
                    navigate('/login');
                } else {
                    setError('Došlo je do greške prilikom dohvaćanja podataka');
                }
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    if (isLoading) return <div>Učitavanje...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="shopping-page">
            <div className="header-shopsList">
                <div className="logo-container">
                    <img
                        src={logo1}
                        alt="Logo"
                        className="logo"
                        onClick={() => navigate(userRole === 'owner' ? '/ownerhome' : '/userhome')}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <h1 className="header-title">Povijest kupovina</h1>
            </div>

            <div className="shopping-list">
                {currentOrders.map((order, index) => (
                    <ShoppingCard
                        key={index}
                        order={order.originalOrder}
                        status={order.status}
                        price={order.price}
                        date={order.date}
                        shopName={order.shopName}
                        onContinue={handleContinueShopping}
                        onCancel={handleCancelOrder}
                        onPause={handlePauseShopping}
                    />
                ))}
            </div>

            {orders.length > 0 && (
                <footer className="pagination">
                    <button
                        className="pagination-arrow"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                    >
                        <span className="arrow-text">&#8249;</span>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                        <button
                            key={num}
                            className={`pagination-number ${currentPage === num ? 'active' : ''}`}
                            onClick={() => setCurrentPage(num)}
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        className="pagination-arrow"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        <span className="arrow-text">&#8250;</span>
                    </button>
                </footer>
            )}
        </div>
    );
};

export default ShoppingPage;
