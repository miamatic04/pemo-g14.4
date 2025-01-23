import React, { useEffect, useState } from 'react';
import './stilovi/home.css'
import logo from './Components/Assets/logo1.png'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ProductModal from './Components/ProductModal';

const OwnerHome = () => {
    const navigate = useNavigate();
    const url = useLocation();  // Access the location object
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('AZ'); // početni odabir sortiranja
    const [location, setLocation] = useState(null);
    const [email, setEmail] = useState(null);
    const [locationTried, setLocationTried] = useState(false);
    const [authenticationTried, setAuthenticationTried] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showingAllShops, setShowingAllShops] = useState(true);
    const [showingAllProducts, setShowingAllProducts] = useState(true);

    const openModal = (product) => {
        setSelectedProduct(product);
        // Store product and shop info in localStorage instead of state
        localStorage.setItem('selectedProductId', product.id);
        localStorage.setItem('selectedShopName', product.shopName);
    };

    const closeModal = () => {
        setSelectedProduct(null);
    };

    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/');
    };
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };


    const [index, setIndex] = useState(0);
    // Funkcija za prebacivanje na prethodne 2 slike trgovina
    const prviBTN = () => {
        if (index>0) {
            setIndex(index-2);
        }
    };
    // Funkcija za prebacivanje na sljedeće 2 slike trgovina
    const drugiBTN = () => {
        if (index+2<shops.length) {
            setIndex(index+2);
        }
    };
    // Sliced niz slika trgovina koje se trenutno prikazuju
    const visible = (() => {
        // Check if the index is out of bounds
        const endIndex = index + 2; // The last index to slice to
        if (index >= shops.length) {
            // If the current index is greater than or equal to the length of the shops array, return an empty array
            return [];
        }

        // Check if the number of remaining shops is odd and if there is only one shop remaining
        if (shops.length - index === 1) {
            return shops.slice(index, index + 1); // Take only one shop
        }

        // Otherwise, return two shops starting from the current index
        return shops.slice(index, endIndex);
    })();

    const [index1, setIndex1] = useState(0);
    // Funkcija za prebacivanje na prethodnih 6 slika proizvoda
    const prviBTN1 = () => {
        if (index1>0) {
            setIndex1(index1-6);
        }
    };
    // Funkcija za prebacivanje na sljedećih 6 slika proizvoda
    const drugiBTN1 = () => {
        if (index1+6<products.length) {
            setIndex1(index1+6);
        }
    };
    // Sliced niz slika proizvoda koje se trenutno prikazuju
    const visible1 = (() => {
        // Check if the index is out of bounds
        const endIndex = index + 6; // The last index to slice to
        if (index1 >= products.length) {
            // If the current index is greater than or equal to the length of the shops array, return an empty array
            return [];
        }

        const remainingProducts = products.length - index1;
        if (remainingProducts < 6) {
            // Ako je preostalo manje od 6 proizvoda, uzmi sve preostale
            return products.slice(index1);
        }

        // Inače, uzmi sljedećih 6 proizvoda
        return products.slice(index1, endIndex);
    })();

    const checkTokenValidation = async () => {
        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/validateToken`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok || !(localStorage.getItem("role") === "owner")) {
                if(localStorage.getItem("role") === "user")
                    navigate("/userhome");
                else if(localStorage.getItem("role") === "mod")
                    navigate("/modhome");
                else if(localStorage.getItem("role")=== "admin")
                    navigate("/adminhome");
                else
                    navigate("/");
            }

        } catch (error) {
            console.log(error);
            navigate("/");
        }
    };

    useEffect(() => {
        if(!authenticationTried && !url.search) {
            setAuthenticationTried(true);
            checkTokenValidation();
        }
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(url.search);

        const tokenValue = params.get('token');
        const roleValue = params.get('role');

        if (tokenValue) {
            localStorage.setItem("token" , params.get("token"));
        }

        if (roleValue) {
            localStorage.setItem("role" , params.get("role"));
        }

        if(!authenticationTried && url.search) {
            setAuthenticationTried(true);
            checkTokenValidation();
        }

    }, [url.search]);

    const handleSortChange = (event) => {
        const selectedSortOrder = event.target.value;
        setSortOrder(selectedSortOrder);
    };

    const updateLocation = async () => {
        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/user/updateLocation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(location)
            });

            console.log(JSON.stringify(location));
            if (response.ok) {
                const locationData = await response.json();
            } else {
                console.error("Greška u odgovoru servera prilikom slanja lokacije:", response.status);
            }
        } catch (error) {
            console.error("Greška prilikom slanja lokacije:", error);
        }
    };

    const fetchRecommendedShops = async () => {
        try {
            let url;
            if (sortOrder === 'AZ') {
                url = `http://${process.env.REACT_APP_WEB_URL}:8080/home/getRecommendedShopsAZ`;
            } else if (sortOrder === 'ZA') {
                url = `http://${process.env.REACT_APP_WEB_URL}:8080/home/getRecommendedShopsZA`;
            } else if (sortOrder === 'udaljenostBlizi') {
                url = `http://${process.env.REACT_APP_WEB_URL}:8080/home/getRecommendedShopsByDistanceAsc`;
            }
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    setShops(data);
                    setShowingAllShops(false);
                    setIndex(0);
                    return; // Exit if recommended shops are available
                }
            }
            // Fallback to normal shops if no recommended shops are found
            setShowingAllShops(true);
            alert("No recommended shops found :(");
            fetchShops();
        } catch (error) {
            console.error('Error fetching recommended shops:', error);
            setShowingAllShops(true);
            fetchShops(); // Fallback on error
        }
    };

    const fetchRecommendedProducts = async () => {
        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/home/getRecommendedProducts`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    setProducts(data);
                    setShowingAllProducts(false);
                    setIndex1(0);
                    return; // Exit if recommended products are available
                }
            }
            // Fallback to normal products if no recommended products are found
            setShowingAllProducts(true);
            alert("No recommended products found :(");
            fetchProducts();
        } catch (error) {
            console.error('Error fetching recommended products:', error);
            setShowingAllProducts(true);
            fetchProducts(); // Fallback on error
        }
    };

    const fetchShops = async () => {
        try {
            let url;
            if (sortOrder === 'AZ') {
                url = `http://${process.env.REACT_APP_WEB_URL}:8080/home/getShopsAZ`;
            } else if (sortOrder === 'ZA') {
                url = `http://${process.env.REACT_APP_WEB_URL}:8080/home/getShopsZA`;
            } else if (sortOrder === 'udaljenostBlizi') {
                url = `http://${process.env.REACT_APP_WEB_URL}:8080/home/getShopsByDistanceAsc`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setShowingAllShops(true);
                setShops(data);
                setIndex(0);
            } else {
                console.error('Failed to fetch shops');
            }
        } catch (error) {
            console.error('Error fetching shops:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getAllProducts`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setShowingAllProducts(true);
                setIndex1(0);
                setProducts(data);
            } else {
                console.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

// Update `useEffect` hooks to use the recommended fetch functions
    useEffect(() => {
        if(showingAllShops)
            fetchShops()
        else
            fetchRecommendedShops();
    }, [sortOrder]);

    useEffect(() => {
        if(showingAllProducts)
            fetchProducts()
        else
            fetchRecommendedProducts();
    }, [sortOrder]);


    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // ako je korisnik dozvolio pristup, prikupi podatke o lokaciji
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                setLocation({latitude, longitude});
            },
            (error) => {
                // ako korisnik odbije pristup ili dođe do greške
                console.error("Greška prilikom pristupa geolokaciji:", error.message);
            }
        );
    } else {
        console.error("Geolokacija nije podržana u ovom pretraživaču.");
    }

    useEffect(() => {
        // fetch poziv nakon što korisnik dozvoli pristup lokaciji

        if (location) {
            if(!locationTried) {
                setLocationTried(true);
                updateLocation();
            }
        }
    }, [location]);

    return (
        <div className="body-klasa">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"/> {/*link na Font Awesome za ikone kod proizvoda*/}
            <div className="home">
                <div className="header2">
                    <img src={logo} alt="logo" className="logo33"></img>
                    <ul className="lista">
                        <li className="el"><a className="a1" onClick={() => navigate('/district')}>Kvart</a></li>
                        <li className="el"><a className="a1" onClick={() => navigate('/events')}>Događaji</a></li>
                        <li className="el"><a className="a1" onClick={() => navigate('/shopsList')}>Popis trgovina</a>
                        </li>
                        <li className="el"><a href="/myShops" className="a1">Moje trgovine</a></li>
                        <li className="el"><a href="/myDiscounts" className="a1">Moji popusti</a></li>
                        <li className="el"><a href="/cart" className="a1">Košarica</a></li>
                        <li className="hamburger">
                            <button className="hamburger-btn" onClick={toggleMenu}>
                                ☰
                            </button>
                            {menuOpen && (
                                <div className="hamburger-menu">
                                    <button onClick={() => navigate(`/userProfile`)}>Uredi profil</button>
                                    <button onClick={handleLogout}>Odjava</button>
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
                <div className="glavna">
                <h1 className="naslov">Kupovina koja prati tvoj ritam</h1>
                    <button className="btn1" onClick={() => navigate(`/purchaseHistory`)}>Povijest kupovina</button>
                    <div className="background"></div>
                </div>
            </div>
            <div className="klasa1">
                <div className="klasa2">
                    <h1>Trgovine</h1>
                    {showingAllShops && (
                        <small style={{ color: 'gray', fontStyle: 'italic', fontSize: '20px' }}>
                            <p onClick={fetchRecommendedShops} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>Show recommended shops</p>
                        </small>
                    )}
                    {!showingAllShops && (
                        <small style={{ color: 'gray', fontStyle: 'italic', fontSize: '20px' }}>
                            <p onClick={fetchShops} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>Show all shops</p>
                        </small>
                    )}
                    <form className="forma1">
                        <label>
                            <i>Sortiraj trgovine po: </i>
                            <select value={sortOrder} onChange={handleSortChange}>
                                <option value="AZ">nazivu A-Z</option>
                                <option value="ZA">nazivu Z-A</option>
                                <option value="udaljenostBlizi">udaljenosti (prvo bliži)</option>
                            </select>
                        </label>
                    </form>
                </div>
                <div className="store-list">
                    <button id="prvi-btn" className="navigacija" onClick={prviBTN} disabled={index === 0}>{"<"}</button>
                    {visible.map((shops, ind) => (
                        <div className="store-item" key={ind} onClick={() => navigate('/shop', {
                            replace: false,
                            state: {
                                shopId: shops.shopDTO.id,
                            }
                        })}>
                            <div className="image-container1">
                                <img className="slike" src={shops.shopDTO.imagePath}/>
                            </div>
                            <div className="opis">
                                <h3>{shops.shopDTO.shopName}</h3>
                                <p>{shops.shopDTO.description}</p>
                                <p>{shops.distance} km</p>
                            </div>
                        </div>
                    ))}
                    <button className="navigacija" onClick={drugiBTN}
                            disabled={index + 2 >= shops.length}>{">"}</button>
                </div>
            </div>
            <div className="klasa1">
                <div className="klasa2">
                    <h1>Proizvodi</h1>
                    {showingAllProducts && (
                        <small style={{ color: 'gray', fontStyle: 'italic', fontSize: '20px' }}>
                            <p onClick={fetchRecommendedProducts} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>Show recommended products</p>
                        </small>
                    )}
                    {!showingAllProducts && (
                        <small style={{ color: 'gray', fontStyle: 'italic', fontSize: '20px' }}>
                            <p onClick={fetchProducts} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>Show all products</p>
                        </small>
                    )}
                    {/*<form className="forma1">
                        <label>
                            <i>Sortiraj proizvode po: </i>
                            <select value={sortOrder} onChange={handleSortChange}>
                                <option value="AZ">nazivu A-Z</option>
                                <option value="ZA">nazivu Z-A</option>
                            </select>
                        </label>
                    </form>*/}
                </div>
                <div className="klasa3">
                    <button id="prvi-btn1" className="navigacija" onClick={prviBTN1} disabled={index1 === 0}>{"<"}</button>
                    <div id="proizvodi" className="store-list">
                        {visible1.map((product, ind) => (
                        <div className="store-item" id="proizvod" key={ind} onClick={() => openModal(product)}>
                            <div id="img-container2" className="image-container1">
                                <img className="slike" src={product.imagePath} alt={product.name}/>
                            </div>
                            <div className="opis1">
                                <h3>{product.name}</h3>
                                <div className="info">
                                    <p><i className="fas fa-shopping-cart"></i> {product.shopName}</p>
                                    <p><i className="fas fa-tag"></i> {product.description}</p>
                                    <p><i className="fas fa-euro-sign"></i> {product.price}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                    <button className="navigacija" onClick={drugiBTN1} disabled={index1 + 6 >= products.length}>{">"}</button>
                </div>
            </div>
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default OwnerHome;