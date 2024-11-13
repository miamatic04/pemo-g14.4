import React, { useEffect, useState } from 'react';
import './stilovi/home.css'
import logo from './Components/Assets/logo1.png'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import trgovina1 from './Components/Assets/trgovina1.jpg';
import trgovina2 from './Components/Assets/trgovina2.jpg';
import trgovina3 from './Components/Assets/trgovina3.jpg';
import trgovina4 from './Components/Assets/trgovina4.jpg';

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

    const trgovine=[
        {
            "img": trgovina1,
            "ime": "Trgovina 1",
            "opis": "Opis trgovine 1"
        },
        {
            "img": trgovina2 ,
            "ime": "Trgovina 2",
            "opis": "Opis trgovine 2"
        },
        {
            "img": trgovina3 ,
            "ime": "Trgovina 3",
            "opis": "Opis trgovine 3"
        },
        {
            "img": trgovina4,
            "ime": "Trgovina 4",
            "opis": "Opis trgovine 4"
        }
    ]

    const [index, setIndex] = useState(0);

    // Funkcija za prebacivanje na prethodne 2 slike
    const prviBTN = () => {
        if (index>0) {
            setIndex(index-2);
        }
    };

    // Funkcija za prebacivanje na sljedeće 2 slike
    const drugiBTN = () => {
        if (index+2<trgovine.length) {
            setIndex(index+2);
        }
    };

    // Sliced niz slika koje se trenutno prikazuju
    const visible = trgovine.slice(index, index + 2);

    const checkTokenValidation = async () => {
        try {
            const response = await fetch("http://localhost:8080/validateToken", {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                navigate("/");
            }

        } catch (error) {
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
            console.log("http://localhost:8080/" + localStorage.getItem("role") + "/updateLocation");
            const response = await fetch("http://localhost:8080/" + localStorage.getItem("role") + "/updateLocation", {
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
        <div className="body">
            <div className="home">
                <div className="header">
                    <img src={logo} alt="logo" className="logo"></img>
                    <ul className="lista">
                        <li className="el"><a className="a1">Kvart</a></li>
                        <li className="el"><a className="a1">Događaji</a></li>
                        <li className="el"><a className="a1">Popis trgovina</a></li>
                        <li className="el"><a className="a1">Ostali</a></li>
                    </ul>
                </div>
                <div className="glavna">
                    <h1 className="naslov">Kupovina koja prati tvoj ritam</h1>
                    <button className="btn1">Povijest kupovina</button>
                    <div className="sticky-background"></div>
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
                            </select>
                        </label>
                    </form>
                </div>
                <div className="store-list">
                    <button id="prvi-btn" className="navigacija" onClick={prviBTN} disabled={index === 0}>{"<"}</button>
                    {visible.map((trgovina, ind) => (
                        <div className="store-item" key={ind}>

                            <div className="image-container1">
                                <img className="slike" src={trgovina.img} alt={trgovina.ime}/>
                            </div>

                            <div className="opis">
                                <h3>{trgovina.ime}</h3>
                                <p>{trgovina.opis}</p>
                            </div>
                        </div>
                    ))}
                    <button className="navigacija" onClick={drugiBTN}
                            disabled={index + 2 >= trgovine.length}>{">"}</button>
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
                            <td>{shop.id}</td>
                            <td>{shop.shopName}</td>
                            <td>{shop.distance} km</td>
                        </tr>
                    ))}
                    </tbody>

                </table>*/}
            </div>
            <div>

            </div>
        </div>
    );
};

export default UserHome;