import React, { useEffect, useState } from 'react';
import './stilovi/home.css'
import logo from './logo1.png'

const UserHome = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('AZ'); // početni odabir sortiranja
    const [location, setLocation] = useState(null);
    const [email, setEmail] = useState(null);

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
            updateLocation();
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
                       <li><a>Kvart</a></li>
                       <li><a>Događaji</a></li>
                       <li><a>Popis trgovina</a></li>
                       <li><a>Ostali</a></li>
                   </ul>
               </div>
               <div className="glavna">
                   <h1 className="naslov">Kupovina koja prati tvoj ritam</h1>
                   <button className="btn1">Povijest kupovina</button>
               </div>
           </div>
            <div className="klasa1">
                <form>
                    <label>
                        Sortiraj trgovine po:
                        <select value={sortOrder} onChange={handleSortChange}>
                            <option value="AZ">nazivu A-Z</option>
                            <option value="ZA">nazivu Z-A</option>
                        </select>
                    </label>
                </form>

                <h1>Shops</h1>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Shop Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {shops.map(shop => (
                        <tr key={shop.id}>
                            <td>{shop.id}</td>
                            <td>{shop.shopName}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserHome;