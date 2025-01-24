import React, { useEffect, useState } from 'react';
import ReportItem from '../Components/ReportItem';
import '../stilovi/ReportedShops.css';
import logo from "../Components/Assets/logo1.png";
import {useNavigate} from "react-router-dom";

function ReportedShops() {
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

            if (!response.ok || !(localStorage.getItem("role") === "moderator")) {
                if(localStorage.getItem("role") === "user")
                    navigate("/userhome");
                else if(localStorage.getItem("role") === "admin")
                    navigate("/adminhome");
                else if(localStorage.getItem("role")=== "owner")
                    navigate("/ownerhome");
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

        const fetchShopReports = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getShopReports`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch shop reports');
                }

                const data = await response.json();
                setShops(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchShopReports();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="reported-shops-page">
            <div className="header-reported-shops">
                <img src={logo} alt="Logo" className="report-shop-logo" onClick={() => navigate(`/moderatorHome`)}/>
                <h2 className="header-title-reported-shops">Prijavljene trgovine</h2>
            </div>
            <div className="reported-shops-container">
                {shops.length === 0 ? (
                    <p>No reported shops available</p>
                ) : (
                    shops.map((shop, index) => (
                        <div className="reported-shops-card" key={index}>
                            <ReportItem {...shop} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ReportedShops;