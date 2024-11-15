import React, { useEffect, useState } from 'react';
import './stilovi/home.css'
import logo from './Components/Assets/logo1.png'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import trgovina1 from './Components/Assets/trgovina1.jpg';
import trgovina2 from './Components/Assets/trgovina2.jpg';
import trgovina3 from './Components/Assets/trgovina3.jpg';
import trgovina4 from './Components/Assets/trgovina4.jpg';
import proizvod1 from './Components/Assets/proizvod1.jpg';
import proizvod2 from './Components/Assets/proizvod2.jpg';
import proizvod3 from './Components/Assets/proizvod3.jpg';
import proizvod4 from './Components/Assets/proizvod4.jpg';
import proizvod5 from './Components/Assets/proizvod5.jpg';
import proizvod6 from './Components/Assets/proizvod6.jpg';
import proizvod7 from './Components/Assets/proizvod7.jpg';
import proizvod8 from './Components/Assets/proizvod8.jpg';
import proizvod9 from './Components/Assets/proizvod9.jpg';
import proizvod10 from './Components/Assets/proizvod10.jpg';
import proizvod11 from './Components/Assets/proizvod11.jpg';
import proizvod12 from './Components/Assets/proizvod12.jpg';


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

    const proizvodi=[
        {
            "img": proizvod1,
            "ime": "Proizvod 1",
        },
        {
            "img": proizvod2,
            "ime": "Proizvod 2",
        },
        {
            "img": proizvod3,
            "ime": "Proizvod 3",
        },
        {
            "img": proizvod4,
            "ime": "Proizvod 4",
        },
        {
            "img": proizvod5,
            "ime": "Proizvod 5",
        },
        {
            "img": proizvod6,
            "ime": "Proizvod 6",
        },
        {
            "img": proizvod7,
            "ime": "Proizvod 7",
        },
        {
            "img": proizvod8,
            "ime": "Proizvod 8",
        },
        {
            "img": proizvod9,
            "ime": "Proizvod 9",
        },
        {
            "img": proizvod10,
            "ime": "Proizvod 10",
        },
        {
            "img": proizvod11,
            "ime": "Proizvod 11",
        },
        {
            "img": proizvod12,
            "ime": "Proizvod 12",
        }
    ]

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
        if (index1+6<proizvodi.length) {
            setIndex1(index1+6);
        }
    };
    // Sliced niz slika proizvoda koje se trenutno prikazuju
    const visible1 = proizvodi.slice(index1, index1 + 6);

    const checkTokenValidation = async () => {
        try {
            const response = await fetch("http://localhost:8080/validateToken", {
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

    const fetchEmail = async () => {
        try {
            const response = await fetch("http://localhost:8080/userhome/getUserInfo", {
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

            setEmail(data);

        } catch (error) {
            console.error('Error fetching email:', error);
        }
    };

    useEffect(() => {
        fetchEmail();
    }, []);


    const updateLocation = async () => {
        try {
            const response = await fetch("http://localhost:8080/user/updateLocation", {
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
                url = 'http://localhost:8080/home/getShopsAZ'
            else if(sortOrder === 'ZA')
                url = 'http://localhost:8080/home/getShopsZA';
            else if(sortOrder === 'udaljenostBlizi')
                url = 'http://localhost:8080/home/getShopsByDistanceAsc';


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
                    <img src={logo} alt="logo" className="logo"></img>
                    <ul className="lista">
                        <li className="el"><a className="a1">Kvart</a></li>
                        <li className="el"><a className="a1">Događaji</a></li>
                        <li className="el"><a className="a1">Popis trgovina</a></li>
                        <li className="el"><a href="/myShops" className="a1">Moje trgovine</a></li>
                    </ul>
                </div>
                <div className="glavna">
                    <h1 className="naslov">Kupovina koja prati tvoj ritam</h1>
                    <button className="btn1">Povijest kupovina</button>
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
                                <img className="slike" src={shops.shop.imagePath}/>
                            </div>
                            <div className="opis">
                                <h3>{shops.shop.shopName}</h3>
                                <p>{shops.shop.description}</p>
                                <p>{shops.distance} km</p>
                            </div>
                        </div>
                    ))}
                    <button className="navigacija" onClick={drugiBTN}
                            disabled={index + 2 >= shops.length}>{">"}</button>
                </div>

                {/*<h1>Shops</h1>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Shop Name</th>
                        <th>Udaljenost</th>
                    </tr>
                    </thead>
                    <tbody>
                    {shops.map(shop => (
                        <tr key={shop.id}>
                            <td>{shop.shop.id}</td>
                            <td>{shop.shop.shopName}</td>
                            <td>{shop.distance} km</td>
                            <td><img src={shop.shop.imagePath} alt="Shop Image"/></td>
                        </tr>
                    ))}
                    </tbody>

                </table>*/}
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
                        {visible1.map((proizvod, ind) => (
                            <div className="store-item" id="proizvod" key={ind}>
                                <div id="img-container2" className="image-container1">
                                    <img className="slike" src={proizvod.img} alt={proizvod.ime}/>
                                </div>
                                <div className="opis1">
                                    <h3>{proizvod.ime}</h3>
                                    <div className="info">
                                        <p><i className="fas fa-shopping-cart"></i> Trgovina</p>
                                        <p><i className="fas fa-map-marker-alt"></i> Udaljenost</p>
                                        <p><i className="fas fa-tag"></i> Kategorija</p>
                                        <p><i className="fas fa-euro-sign"></i> Cijena</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="navigacija" onClick={drugiBTN1} disabled={index1 + 6 >= proizvodi.length}>{">"}</button>
                </div>
            </div>
        </div>
    );
};

export default UserHome;