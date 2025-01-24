import React, { useState, useEffect } from 'react';
import ReportItem from './ReportItem';
import './stilovi/ReportedProducts.css';
import logo from "./Components/Assets/logo1.png";
import {useNavigate} from "react-router-dom";

function ReportedProducts() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
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

        const fetchProductReports = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getProductReports`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch product reports');
                }

                const data = await response.json();
                setProducts(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductReports();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="reported-products-page">
            <div className="header-reported-products">
                <img src={logo} alt="Logo" className="report-product-logo" onClick={() => navigate(`/moderatorHome`)}/>
                <h2 className="header-title-reported-products">Prijavljeni proizvodi</h2>
            </div>
            <div className="reported-products-container">
                {products.length === 0 ? (
                    <p>No reported products available</p>
                ) : (
                    products.map((product, index) => (
                        <div className="reported-products-card" key={index}>
                            <ReportItem {...product} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ReportedProducts;