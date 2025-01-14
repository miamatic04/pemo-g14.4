import React from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/purchaseHistory.css';
import logo1 from "./Components/Assets/logo1.png";

const ShoppingCard = ({ title, status, price, date }) => {
    const getStatusStyle = () => {
        if (status === "u tijeku") return "in-progress";
        if (status === "završeno") return "completed";
        if (status === "otkazano") return "cancelled";
    };

    return (
        <div className="shopping-card">
            <div className="card-content">
                <div>
                    <h3>{title}</h3>
                    <p className={`status ${getStatusStyle()}`}>{status}</p>
                </div>
                <div className="card-price-details">
                    <p className="price">{price}</p>
                    <a href="#" className="details-link">vidi više</a>
                </div>
            </div>
            <div className="card-date">
                <p>{date}</p>
            </div>
        </div>
    );
};

const ShoppingPage = () => {
    const navigate = useNavigate();
    const purchases = [
        { title: "Trgovina1", status: "u tijeku", price: "8,59 €", date: "09.01.2025." },
        { title: "Trgovina2", status: "završeno", price: "1,99 €", date: "09.01.2025." },
        { title: "Trgovina3", status: "otkazano", price: "25,38 €", date: "09.01.2025." },
    ];

    return (
        <div className="shopping-page">
            <div className="header-shopsList">
                <div className="logo-container">
                    <img
                        src={logo1}
                        alt="Logo"
                        className="logo"
                        onClick={() => navigate('/UserHome')}
                        style={{cursor: 'pointer'}}
                    />
                </div>
                <h1 className="header-title">Povijest kupovina</h1>
            </div>

            <div className="shopping-list">
                {purchases.map((purchase, index) => (
                    <ShoppingCard
                        key={index}
                        title={purchase.title}
                        status={purchase.status}
                        price={purchase.price}
                        date={purchase.date}
                    />
                ))}
            </div>

            <footer className="pagination">
                <button>&lt;</button>
                {[1, 2, 3, 4, 5].map((num) => (
                    <button key={num}>{num}</button>
                ))}
                <button>&gt;</button>
            </footer>
        </div>
    );
};

export default ShoppingPage;