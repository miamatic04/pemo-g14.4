import React from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/myDiscounts.css';
import logo1 from './Components/Assets/logo1.png';

const MyDiscounts = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('role');
    const discounts = [
        { id: 1, shopName: 'Konzum popust', imagePath: '/path/to/konzum.jpg' },
        { id: 2, shopName: 'Lidl posebna ponuda', imagePath: '/path/to/lidl.jpg' },
        { id: 3, shopName: 'Kik popusti', imagePath: '/path/to/kik.jpg' },
        { id: 4, shopName: 'Tedi popust', imagePath: '/path/to/tedi.jpg' },
        { id: 5, shopName: 'Spar popust', imagePath: '/path/to/spar.jpg' },
        { id: 6, shopName: 'Tisak popust', imagePath: '/path/to/tisak.jpg' }
    ];

    return (
        <div className="page-container-discounts-owner">
            {/* Header */}
            <div className="header-discounts-owner">
                <div className="logo-container-discounts-owner">
                    <img
                        src={logo1}
                        alt="Logo"
                        className="logo"
                        onClick={() => navigate(userRole === 'owner' ? '/ownerhome' : '/userhome')}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <h1 className="header-title-discounts-owner">Popusti i ponude</h1>
            </div>

            {/* Discounts Grid */}
            <button className="dodajNoviPopust" onClick={() => navigate('/addDiscount')}>Dodaj novi popust</button>
            <div className="discounts-container-owner">
                {discounts.map((discount) => (
                    <div key={discount.id} className="discount-card-owner">
                        <img
                            src={discount.imagePath || '/api/placeholder/200/120'}
                            alt={discount.shopName}
                            className="discount-image-owner"
                        />
                        <p className="discount-title-owner">{discount.shopName}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyDiscounts;