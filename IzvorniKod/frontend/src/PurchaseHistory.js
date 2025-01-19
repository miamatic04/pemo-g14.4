import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/purchaseHistory.css';
import logo1 from "./Components/Assets/logo1.png";

const ShoppingCard = ({ status, price, date, shopName }) => {
    const getStatusStyle = () => {
        if (status === "u tijeku") return "in-progress";
        if (status === "završeno") return "completed";
        if (status === "otkazano") return "cancelled";
    };

    const navigate = useNavigate();

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
                    <a className="details-link" onClick={() => navigate('/purchaseDetails')}>vidi detalje kupovine</a>
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

    // Izračunaj ukupan broj stranica
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    // Dohvati trenutne narudžbe za prikaz
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getAllOrders`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
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
                    status: order.active ? "u tijeku" :
                        order.cancelled ? "otkazano" :
                            order.paid ? "završeno" : "u tijeku",
                    price: `${order.total.toFixed(2)} €`,
                    shopName: order.shopName || 'Nepoznata trgovina',
                    date: new Date(order.orderDate).toLocaleDateString('hr-HR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })
                }));

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
                        style={{cursor: 'pointer'}}
                    />
                </div>
                <h1 className="header-title">Povijest kupovina</h1>
            </div>

            <div className="shopping-list">
                {currentOrders.map((order, index) => (
                    <ShoppingCard
                        key={index}
                        status={order.status}
                        price={order.price}
                        date={order.date}
                        shopName={order.shopName}
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