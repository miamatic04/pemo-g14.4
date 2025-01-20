import React from 'react';
import './stilovi/purchaseDetails.css';
import logo1 from "./Components/Assets/logo1.png";
import { useNavigate } from "react-router-dom";

const StoreLayout = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('role');

    const orderDetails = JSON.parse(localStorage.getItem('selectedOrder') || '{}');
    const orderDate = orderDetails.orderDate ?
        new Date(orderDetails.orderDate).toLocaleDateString('hr-HR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }) : 'Nepoznat datum';

    return (
        <div className="page-container-pd">
            <div className="content-container-pd">
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
                    <h1 className="header-title">Kupovina {orderDate}</h1>
                </div>

                <main className="store-container-pd">
                    <div className="grid-header-pd">
                        <div>{orderDetails.shopName || 'Nepoznata trgovina'}</div>
                        <div className="text-center-pd">Količina</div>
                        <div className="text-center-pd">Cijena</div>
                        <div className="text-right-pd">Ukupno</div>
                    </div>

                    <div className="product-list-pd">
                        {orderDetails.orderProducts?.map((item, index) => (
                            <div key={index} className="product-item-pd">
                                <div className="product-name-pd">
                                    <div className="product-dot-pd"></div>
                                    <div id="proizvodii">{item.product.name}</div>
                                </div>
                                <div className="text-center-pd">{item.quantity}x</div>
                                <div className="text-center-pd">{item.product.price.toFixed(2)}€</div>
                                <div className="text-right-pd">
                                    {(item.quantity * item.product.price).toFixed(2)}€
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="total-pd">
                        <span>UKUPNO: </span>
                        <span className="total-amount-pd">
                            {orderDetails.total?.toFixed(2)}€
                        </span>
                    </div>
                </main>

                <footer className="footer-pd">
                    <div className="next-purchase-pd">
                        <a className="btn-pd" onClick={() => navigate('/purchaseHistory')}>
                            natrag na povijest kupovina
                        </a>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default StoreLayout;