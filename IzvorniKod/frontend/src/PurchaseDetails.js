// StoreLayout.jsx
import React from 'react';
import './stilovi/purchaseDetails.css';
import logo1 from "./Components/Assets/logo1.png";
import {useNavigate} from "react-router-dom";

const StoreLayout = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('role');
    return (
        <div className="page-container-pd">
            <div className="content-container-pd">
                {/* Header with Logo */}
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
                    <h1 className="header-title">Kupovina datum</h1>
                </div>

                {/* Store Container */}
                <main className="store-container-pd">
                    {/* Table Header */}
                    <div className="grid-header-pd">
                        <div>Trgovina1</div>
                        <div className="text-center-pd">Količina</div>
                        <div className="text-center-pd">Cijena</div>
                        <div className="text-right-pd">Ukupno</div>

                    </div>

                    {/* Products */}
                    <div className="product-list-pd">
                        {/* Product 1 */}
                        <div className="product-item-pd">
                            <div className="product-name-pd">
                                <div className="product-dot-pd"></div>
                                <div id="proizvodii">Proizvod1</div>
                            </div>
                            <div className="text-center-pd">2x</div>
                            <div className="text-center-pd">44.00€</div>
                            <div className="text-right-pd">88.00€</div>
                        </div>

                        {/* Product 2 */}
                        <div className="product-item-pd">
                            <div className="product-name-pd">
                                <div className="product-dot-pd"></div>
                                <div id="proizvodii">Proizvod2</div>
                            </div>
                            <div className="text-center-pd">2x</div>
                            <div className="text-center-pd">44.00€</div>
                            <div className="text-right-pd">44.00€</div>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="total-pd">
                        <span>UKUPNO: </span>
                        <span className="total-amount-pd">132.00€</span>
                    </div>
                </main>

                {/* Footer */}
                <footer className="footer-pd">
                    <div className="prev-purchase-pd">
                        <div className="arrow-pd">←</div>
                        <a className="btn-pd">prošla kupovina</a>
                    </div>
                    <div className="next-purchase-pd">
                        <a className="btn-pd">natrag na povijest kupovina</a>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default StoreLayout;