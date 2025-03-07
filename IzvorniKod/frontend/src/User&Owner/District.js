import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../stilovi/district.css';
import logo1 from "../Components/Assets/logo1.png";
import { useNavigate } from "react-router-dom";
import ProductModal from "../Components/ProductModal";
import EventModal from "../Components/EventModal";

const ShopCard = ({ key1, shopName1, description1, imagePath1, code, discount }) => {
    const [imageError, setImageError] = React.useState(false);
    const navigate = useNavigate();

    const handleClick = code ? null : () => {
        navigate('/shop', { replace: false, state: { shopId: key1 } });
    };

    return (
        <div
            className={`shop-card9 ${code ? 'discount-card' : ''}`}
            onClick={handleClick}
        >
            {code ? (
                <div className="discount-content">
                    <p className="discount-code">{code}</p>
                    <p className="shop-title">{shopName1}</p>
                    <h2 className="discount-percentage">{discount * 100}%</h2>
                </div>
            ) : (
                <div>
                    <div className="shop-image-container9">
                        <img
                            src={imagePath1 || "/api/placeholder/200/120"}
                            alt="Trgovina"
                            className="shop-image9"
                            onError={(e) => (e.target.src = "/api/placeholder/200/120")}
                        />
                    </div>
                    <p className="shop-title">{shopName1}</p>
                </div>
            )}
        </div>
    );
};

const ProductCard = ({ id, title, shopName, description, price, imagePath, onProductClick }) => {
    const [imageError, setImageError] = React.useState(false);
    const navigate = useNavigate();

    const handleProductClick = () => {
        console.log(id);
        onProductClick({
            id,
            title,
            shopName,
            description,
            price,
            imagePath,
        });
    };

    return (
        <div className="shop-card9" onClick={handleProductClick}>
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
            <p className="product-price">{price}€</p>
            {description && <p className="product-description">{description}</p>}
        </div>
    );
};

const EventCard = ({ name2, shopName2, dateTime2, imagePath2, event }) => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [registeredEvents, setRegisteredEvents] = useState([]);

    const handleSignup = async (eventId) => {
        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/signup/${eventId}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.ok) {
                setRegisteredEvents([...registeredEvents, eventId]);
                alert('Uspješno ste se prijavili na događaj!');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <div className="shop-card9" onClick={() => setShowModal(true)}>
                <div className="shop-image-container9">
                    <img
                        src={imagePath2 || "/api/placeholder/200/120"}
                        alt={name2}
                        className="shop-image9"
                        onError={(e) => e.target.src = "/api/placeholder/200/120"}
                    />
                </div>
                <p className="shop-title">{name2}</p>
                <p className="shop-name">{shopName2}</p>
                <p className="event-datetime">
                    {new Date(dateTime2).toLocaleString('hr-HR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>

            {showModal && (
                <EventModal
                    event={event}
                    onClose={() => setShowModal(false)}
                    onSignup={handleSignup}
                    navigate={navigate}
                />
            )}
        </>
    );
};

const Section = ({ title, items, itemType, onProductClick }) => {
    const contentRef = React.useRef(null);

    const scroll = (direction) => {
        if (contentRef.current) {
            const width = window.innerWidth;
            let scrollAmount;

            if (width <= 768) { // Mobile - one card
                scrollAmount = contentRef.current.offsetWidth;
            } else if (width <= 1024) { // Tablet - two cards
                scrollAmount = contentRef.current.offsetWidth / 2;
            } else { // Desktop - six cards
                scrollAmount = 225 * 6;
            }

            contentRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
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
                        {items.map((item, index) => {
                            if (itemType === 'event') {
                                return (
                                    <EventCard
                                        key2={index}
                                        name2={item.name}
                                        shopName2={item.shopName}
                                        dateTime2={item.dateTime}
                                        imagePath2={item.imagePath}
                                        event={item} // Pass the entire event object
                                        shopId2={item.shopId}
                                    />
                                );
                            } else if (itemType === 'product') {
                                return (
                                    <ProductCard
                                        key={index}
                                        id={item.id}
                                        title={item.name}
                                        shopName={item.shopName}
                                        description={item.description}
                                        price={item.price}
                                        imagePath={item.imagePath}
                                        onProductClick={onProductClick}
                                    />
                                );
                            } else {
                                return (
                                    <ShopCard
                                        key={index}
                                        key1={item.shopDTO ? item.shopDTO.id : item.id || ''}
                                        shopName1={item.shopDTO ? item.shopDTO.shopName : item.shopName || ''}
                                        description1={item.shopDTO ? item.shopDTO.description : item.description || ''}
                                        imagePath1={item.shopDTO ? item.shopDTO.imagePath : item.imagePath || ''}
                                        code={item.code || ''}
                                        discount={item.discount || ''}
                                    />
                                );
                            }
                        })}
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
    const [events, setEvents] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [radius] = useState(5000);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleProductClick = (product) => {
        setSelectedProduct(product); // Set the clicked product as the selected product
        setModalOpen(true); // Open the modal
    };

    const closeModal = () => {
        setModalOpen(false); // Close the modal
        setSelectedProduct(null); // Clear the selected product
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };

                // Fetch shops
                const shopsResponse = await fetch(
                    `http://${process.env.REACT_APP_WEB_URL}:8080/hood/getShops`,
                    { method: 'GET', headers }
                );
                if (!shopsResponse.ok) {
                    try {
                        const errorResponse = await shopsResponse.json();
                        if (errorResponse.code === "hood") {
                            alert("Kvart nije odabran. Molim odaberite kvart u postavkama profila.");
                            window.location.href = `http://${process.env.REACT_APP_WEB_URL}:3000/userProfile`;
                        } else {
                            alert("An unknown error occurred.");
                        }
                    } catch (err) {
                        console.error("Error parsing response:", err);
                    }
                }
                const shopsData = await shopsResponse.json();
                setShops(shopsData);

                // Fetch products
                const productsResponse = await fetch(
                    `http://${process.env.REACT_APP_WEB_URL}:8080/hood/getProducts`,
                    { method: 'GET', headers }
                );
                if (!productsResponse.ok) throw new Error('Failed to fetch products');
                const productsData = await productsResponse.json();
                setProducts(productsData);

                // Fetch events
                const eventsResponse = await fetch(
                    `http://${process.env.REACT_APP_WEB_URL}:8080/hood/getEvents`,
                    { method: 'GET', headers }
                );
                if (!eventsResponse.ok) throw new Error('Failed to fetch events');
                const eventsData = await eventsResponse.json();
                setEvents(eventsData);

                const discountsResponse = await fetch(
                    `http://${process.env.REACT_APP_WEB_URL}:8080/getHoodDiscounts`,
                    { method: 'GET', headers }
                );
                if (!eventsResponse.ok) throw new Error('Failed to fetch events');
                const discountData = await discountsResponse.json();
                console.log(discountData);
                setDiscounts(discountData);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

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
            <a onClick={() => navigate(-1)} className="back-button22">
                ← Natrag
            </a>
            <Section title="Trgovine" items={shops} itemType="shop"/>
            <Section title="Proizvodi" items={products} itemType="product" onProductClick={handleProductClick}/>
            <Section title="Događaji" items={events} itemType="event"/>
            <Section title="Ponude i popusti" items={discounts} itemType="shop"/>
            {modalOpen && selectedProduct && (
                <ProductModal product={selectedProduct} onClose={closeModal}/>
            )}
        </div>
    );
};

export default District;
