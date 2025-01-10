import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/myShops.css'

const MyShops = () => {
    const navigate = useNavigate();
    const [shops, setShops] = useState(null);
    const [authenticationTried, setAuthenticationTried] = useState(false);

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
        if(!authenticationTried) {
            setAuthenticationTried(true);
            checkTokenValidation();
        }
    }, []);

    const getShops = async (e) => {
        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/owner/getMyShops`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error fetching shops: ' + response.statusText);
            }

            const data = await response.json();
            setShops(data);

            console.log('Shops:', data);
        } catch (error) {
            console.error('Error fetching shops:', error);
        }
    }

    const deleteShop = async (shopId) => {
        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/owner/deleteShop?id=` + shopId, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete shop');
            }

            setShops(shops.filter(shop => shop.id !== shopId));
        } catch (error) {
            console.error('Error deleting shop:', error);
        }
    };

    useEffect(() => {
        getShops();
    }, []);

    return (
        <div className="pozadina2">
        <div className="shop-list">
            <h2>Shop List</h2>

            {/* Back to Owner Home Button */}
            <a href="/ownerhome" className="back-gumb">
                Natrag na početnu stranicu
            </a>

            <a href="/addShop" className="add-shop-button">
                Dodaj novu trgovinu
            </a>

            {shops !== null && shops.length > 0 ? (
                <ul>
                    {shops.map(shop => (
                        <li key={shop.id} className="li1">
                            <span>{shop.shopName}</span>
                            <div className="button-group">
                                <button className="edit-button">Uredi</button>
                                <button onClick={() => deleteShop(shop.id)} className="delete-button">Obriši</button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="no-shops">
                    <p>Nema dostupnih trgovina.</p>
                    <p>Pritisnite "Dodaj novu trgovinu" kako biste registrirali svoju prvu trgovinu!</p>
                </div>
            )}
        </div>
        </div>
    )
}

export default MyShops;