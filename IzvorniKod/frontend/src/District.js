import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './stilovi/district.css';
import logo1 from "./Components/Assets/logo1.png";
import {useNavigate} from "react-router-dom";

const ShopCard = ({ title, imagePath }) => (
    <div className="shop-card9">
        <div className="shop-image-container9">
            {imagePath ? (
                <img
                    src={imagePath}
                    alt={title}
                    className="shop-image9"
                    onError={(e) => {
                        e.target.src = "/api/placeholder/200/120";
                    }}
                />
            ) : (
                <div className="placeholder-container9">
                    <img
                        src="/api/placeholder/200/120"
                        alt={title}
                        className="shop-image"
                    />
                </div>
            )}
        </div>
        <p className="shop-title">{title}</p>
    </div>
);

const Section = ({ title, items }) => {
    const contentRef = React.useRef(null);

    const scroll = (direction) => {
        if (contentRef.current) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            contentRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="section-container9">
            <h2 className="section-title">{title}</h2>
            <div className="carousel-container">
                <button
                    onClick={() => scroll('left')}
                    className="carousel-button carousel-button-left"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="carousel-content" ref={contentRef}>
                    <div className="carousel-items">
                        {items.map((item, index) => (
                            <ShopCard
                                key={index}
                                title={item.title}
                                imagePath={item.imagePath}
                            />
                        ))}
                    </div>
                </div>
                <button onClick={() => scroll('right')} className="carousel-button carousel-button-right">
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

const District = () => {
    const navigate = useNavigate();
    const shops = [
        { title: 'Trgovina1', imagePath: '' },
        { title: 'Trgovina2', imagePath: '' },
        { title: 'Trgovina3', imagePath: '' },
        { title: 'Trgovina4', imagePath: '' },
        { title: 'Trgovina5', imagePath: '' },
        { title: 'Trgovina6', imagePath: '' },
        { title: 'Trgovina6', imagePath: '' },
        { title: 'Trgovina6', imagePath: '' }
    ];

    const products = [
        { title: 'Proizvod1', imagePath: '' },
        { title: 'Proizvod2', imagePath: '' },
        { title: 'Proizvod3', imagePath: '' },
        { title: 'Proizvod4', imagePath: '' },
        { title: 'Proizvod5', imagePath: '' },
        { title: 'Proizvod6', imagePath: '' }
    ];

    const discounts = [
        { title: 'Konzum popust', imagePath: '' },
        { title: 'Lidl posebna ponuda', imagePath: '' },
        { title: 'Kik popusti', imagePath: '' },
        { title: 'Tedi popust', imagePath: '' },
        { title: 'Spar popust', imagePath: '' },
        { title: 'Tisak popust', imagePath: '' }
    ];

    return (
        <div className="page-container9">
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
                <h1 className="header-title">Kvart</h1>
            </div>

            <Section title="Trgovine" items={shops}/>
            <Section title="Proizvodi" items={products}/>
            <Section title="Ponude i popusti" items={discounts}/>
        </div>
    );
};

export default District;