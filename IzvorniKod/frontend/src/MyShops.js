import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div className="shop-list">
            <h2>Shop List</h2>

            {/* Back to Owner Home Button */}
            <a href="/ownerhome" className="back-button">
                Natrag na početnu stranicu
            </a>

            <a href="/addShop" className="add-shop-button">
                Dodaj novu trgovinu
            </a>

            {shops !== null && shops.length > 0 ? (
                <ul>
                    {shops.map(shop => (
                        <li key={shop.id}>
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

            <style jsx>{`
                .shop-list {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }

                h2 {
                    text-align: center;
                    color: #333;
                    margin-bottom: 20px;
                }

                /* Back Button Styles */
                .back-button {
                    display: block;
                    width: 100%;
                    padding: 10px;
                    background-color: #f44336;
                    color: white;
                    text-align: center;
                    text-decoration: none;
                    border: none;
                    border-radius: 4px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    margin-bottom: 20px;
                    font-family: Arial, sans-serif;
                }

                .back-button:hover {
                    background-color: #e53935;
                }

                .add-shop-button {
                    display: block;
                    width: 100%;
                    padding: 10px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    text-align: center;
                    text-decoration: none;
                    margin-bottom: 20px;
                    font-family: Arial, sans-serif;
                }

                .add-shop-button:hover {
                    background-color: #45a049;
                }

                ul {
                    list-style-type: none;
                    padding: 0;
                }

                li {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    border: 1px solid #ddd;
                    margin-bottom: 10px;
                    border-radius: 4px;
                }

                span {
                    font-size: 16px;
                    color: #333;
                }

                .button-group {
                    display: flex;
                    gap: 10px;
                }

                button {
                    padding: 5px 10px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background-color 0.3s;
                }

                .edit-button {
                    background-color: #2196F3;
                    color: white;
                }

                .edit-button:hover {
                    background-color: #1976D2;
                }

                .delete-button {
                    background-color: #f44336;
                    color: white;
                }

                .delete-button:hover {
                    background-color: #d32f2f;
                }

                .no-shops {
                    text-align: center;
                    color: #666;
                }

                .no-shops p {
                    margin: 10px 0;
                }
            `}</style>
        </div>
    )
}

export default MyShops;