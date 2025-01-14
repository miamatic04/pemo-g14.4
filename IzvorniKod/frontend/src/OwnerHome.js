import React, { useEffect, useState } from 'react';
import './stilovi/home.css'
import logo from './Components/Assets/logo1.png'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const UserHome = () => {
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

    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
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

    const fetchProducts = async () => {
        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getAllProducts`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
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

    useEffect(() => {
        fetchProducts();
    }, [sortOrder]);

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

    const fetchShops = async () => {
        try {
            var url;
            if(sortOrder === 'AZ')
                url = `http://${process.env.REACT_APP_WEB_URL}:8080/home/getShopsAZ`
            else if(sortOrder === 'ZA')
                url = `http://${process.env.REACT_APP_WEB_URL}:8080/home/getShopsZA`;
            else if(sortOrder === 'udaljenostBlizi')
                url = `http://${process.env.REACT_APP_WEB_URL}:8080/home/getShopsByDistanceAsc`;


            const response = await fetch(url,{
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            console.log(data);
            setShops(data);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching shops:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShops();
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


    if (loading) {
        return <div>Loading...</div>;  // prikazivanje loading indikatora dok se podaci učitavaju
    }



    return (
        <div className="body-klasa">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"/> {/*link na Font Awesome za ikone kod proizvoda*/}
            <div className="home">
                <div className="header">
                    <img src={logo} alt="logo" className="logo33"></img>
                    <ul className="lista">
                        <li className="el"><a className="a1">Kvart</a></li>
                        <li className="el"><a className="a1" onClick={() => navigate('/events')}>Događaji</a></li>
                        <li className="el"><a className="a1" onClick={() => navigate('/shopsList')}>Popis trgovina</a></li>
                        <li className="el"><a href="/myShops" className="a1">Moje trgovine</a></li>
                        <li className="hamburger">
                            <button className="hamburger-btn" onClick={toggleMenu}>
                                ☰
                            </button>
                            {menuOpen && (
                                <div className="hamburger-menu">
                                    <button>Uredi profil</button>
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
                        <div className="store-item" key={ind}>
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
                    <form className="forma1">
                        <label>
                            <i>Sortiraj proizvode po: </i>
                            <select value={sortOrder} onChange={handleSortChange}>
                                <option value="AZ">nazivu A-Z</option>
                                <option value="ZA">nazivu Z-A</option>
                            </select>
                        </label>
                    </form>
                </div>
                <div className="klasa3">
                    <button id="prvi-btn1" className="navigacija" onClick={prviBTN1} disabled={index1 === 0}>{"<"}</button>
                    <div id="proizvodi" className="store-list">
                        {visible1.map((product, ind) => (
                        <div className="store-item" id="proizvod" key={ind} onClick={() => navigate('/product', {
                            replace: false,
                            state: {
                                productId: product.id,
                            }
                        })}>
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
        </div>
    );
};

export default UserHome;