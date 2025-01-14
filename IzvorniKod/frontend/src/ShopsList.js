import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/shopsList.css';
import logo1 from './Components/Assets/logo1.png';
import trgovina1 from './Components/Assets/trgovina1.jpg';
import trgovina2 from './Components/Assets/trgovina2.jpg';
import trgovina3 from './Components/Assets/trgovina3.jpg';
import trgovina4 from './Components/Assets/trgovina4.jpg';

const ShopsList = () => {
    const navigate = useNavigate();

    const [filter, setFilter] = useState(''); // Stanje za filtriranje
    const [filterVisible, setFilterVisible] = useState(false); // Stanje za vidljivost opcija filtriranja

    // Niz trgovina
    const allShops = [
        { id: 1, name: "Trgovina 1", image: trgovina1 },
        { id: 2, name: "Trgovina 2", image: trgovina2 },
        { id: 3, name: "Trgovina 3", image: trgovina3 },
        { id: 4, name: "Trgovina 4", image: trgovina4 },
        { id: 5, name: "Trgovina 5", image: trgovina1 },
        { id: 6, name: "Trgovina 6", image: trgovina2 },
        { id: 7, name: "Trgovina 7", image: trgovina3 },
        { id: 8, name: "Trgovina 8", image: trgovina4 },
        { id: 9, name: "Trgovina 9", image: trgovina1 },
        { id: 10, name: "Trgovina 10", image: trgovina2 },
    ];

    // Filtriranje i sortiranje trgovina
    const filteredShops = filter === 'Z'
        ? allShops.slice().sort((a, b) => b.name.localeCompare(a.name)) // Sortiraj Z-A
        : filter === 'A'
            ? allShops.slice().sort((a, b) => a.name.localeCompare(b.name)) // Sortiraj A-Z
            : allShops; // Prikaži sve

    const [currentPage, setCurrentPage] = useState(1);
    const shopsPerPage = 8; // Broj trgovina po stranici
    const totalPages = Math.ceil(filteredShops.length / shopsPerPage); // Ukupan broj stranica

    const getCurrentShops = () => {
        const startIndex = (currentPage - 1) * shopsPerPage;
        return filteredShops.slice(startIndex, startIndex + shopsPerPage);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Funkcija za promjenu vidljivosti opcija filtriranja
    const toggleFilterOptions = () => {
        setFilterVisible(!filterVisible);
    };

    return (
        <div className="shopsList-page">
            <div className="header-shopsList">
                <div className="logo-container">
                    <img
                        src={logo1}
                        alt="Logo"
                        className="logo"
                        onClick={() => navigate('/UserHome')}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <h1 className="header-title">Popis trgovina</h1>
                <div className="filter-container">
                    <button
                        className="filter-button"
                        onClick={toggleFilterOptions}
                    >
                        Sortiraj po:
                        <span className="filter-arrow"> ▼</span>
                    </button>
                    {filterVisible && (
                        <div className="filter-options">
                            <button onClick={() => {
                                setFilter(''); // Prikaži sve
                                setFilterVisible(false);
                            }}>Prikaži sve</button>
                            <button onClick={() => {
                                setFilter('A'); // Filtriraj A-Z
                                setFilterVisible(false);
                            }}>A-Z</button>
                            <button onClick={() => {
                                setFilter('Z'); // Filtriraj Z-A
                                setFilterVisible(false);
                            }}>Z-A</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="spacer"></div>
            <div className="shop-container">
                {getCurrentShops().map(shop => (
                    <div key={shop.id} className="shops-card">
                        <h2 className="shop-name">{shop.name}</h2>
                        <img src={shop.image} alt={shop.name} className="shop-image"/>
                    </div>
                ))}
            </div>

            {/* Navigacija za listanje stranica */}
            <div className="pagination">
                <button
                    className="navigation-btn"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>
                <span className="page-number">
                    {[...Array(totalPages)].map((_, index) => (
                        <span
                            key={index + 1}
                            className={currentPage === index + 1 ? "active" : ""}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </span>
                    ))}
                </span>
                <button
                    className="navigation-btn"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default ShopsList;