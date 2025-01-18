import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './stilovi/district.css';
import logo1 from "./Components/Assets/logo1.png";
import { useNavigate } from "react-router-dom";

const ShopCard = ({ key1, shopName1, description1, imagePath1 }) => {
    // State za praćenje je li slika uspješno učitana
    const [imageError, setImageError] = React.useState(false);
    const navigate = useNavigate();
    return (
        <div className="shop-card9" onClick={() => navigate('/shop', {
            replace: false,
            state: {
                shopId: key1,
            }
        })}>
            <div className="shop-image-container9">
                {!imageError ? (
                    <img
                        src={imagePath1 || "/api/placeholder/200/120"}
                        alt="Trgovina"
                        className="shop-image9"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <img
                        src="/api/placeholder/200/120"
                        alt="Trgovina"
                        className="shop-image"
                    />
                )}
            </div>
            <p className="shop-title">{shopName1}</p>
            {description1 && <p className="shop-description">{description1}</p>}
        </div>
    );
};

const ProductCard = ({ id, title, shopName, description, price, imagePath }) => {
    // State za praćenje je li slika uspješno učitana
    const [imageError, setImageError] = React.useState(false);
    const navigate = useNavigate();
    return (
        <div className="shop-card9" onClick={() => navigate('/product', {
            replace: false,
            state: {
                productId: id,
            }
        })}>
            <div className="shop-image-container9">
                {!imageError ? (
                    <img
                        src={imagePath || "/api/placeholder/200/120"}
                        alt={title || "Product"}
                        className="shop-image9"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <img
                        src="/api/placeholder/200/120"
                        alt="Product"
                        className="shop-image"
                    />
                )}
            </div>
            <p className="shop-title">{title}</p>
            <p className="shop-name">{shopName}</p>
            <p className="product-price">${price}</p>
            {description && <p className="product-description">{description}</p>}
        </div>
    );
};

const Section = ({ title, items, itemType }) => {
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
                            itemType === 'product' ? (
                                <ProductCard
                                    id={item.id}
                                    title={item.name}
                                    shopName={item.shopName}
                                    description={item.description}
                                    price={item.price}
                                    imagePath={item.imagePath}
                                />
                            ) : (
                                <ShopCard
                                    key1={item.shopDTO ? item.shopDTO.id : item.id || ''}
                                    shopName1={item.shopDTO ? item.shopDTO.shopName : item.shopName || ''}
                                    description1={item.shopDTO ? item.shopDTO.description : item.description || ''}
                                    imagePath1={item.shopDTO ? item.shopDTO.imagePath : item.imagePath || ''}
                                />
                            )
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
    const userRole = localStorage.getItem('role');
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);
    const [products, setProducts] = useState([]);
    const [radius] = useState(5000); // Default radius in meters, adjust as needed

    useEffect(() => {
        const fetchShopsAndProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };

                // Fetch shops
                const shopsResponse = await fetch(
                    `http://${process.env.REACT_APP_WEB_URL}:8080/hood/getShops/${radius}`,
                    {
                        method: 'GET',
                        headers
                    }
                );
                if (!shopsResponse.ok) {
                    throw new Error('Failed to fetch shops');
                }
                const shopsData = await shopsResponse.json();
                setShops(shopsData);

                // Fetch products
                const productsResponse = await fetch(
                    `http://${process.env.REACT_APP_WEB_URL}:8080/hood/getProducts/${radius}`,
                    {
                        method: 'GET',
                        headers
                    }
                );
                if (!productsResponse.ok) {
                    throw new Error('Failed to fetch products');
                }
                const productsData = await productsResponse.json();
                setProducts(productsData);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error appropriately (e.g., show error message to user)
            }
        };

        fetchShopsAndProducts();
    }, [radius]);

    const discounts = [
        { shopName: 'Konzum popust', imagePath: '' },
        { shopName: 'Lidl posebna ponuda', imagePath: '' },
        { shopName: 'Kik popusti', imagePath: '' },
        { shopName: 'Tedi popust', imagePath: '' },
        { shopName: 'Spar popust', imagePath: '' },
        { shopName: 'Tisak popust', imagePath: '' }
    ];

    return (
        <div className="page-container9">
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
                <h1 className="header-title">Kvart</h1>
            </div>

            <Section title="Trgovine" items={shops} itemType="shop" />
            <Section title="Proizvodi" items={products} itemType="product" />
            <Section title="Ponude i popusti" items={discounts} itemType="shop" />
        </div>
    );
};

export default District;