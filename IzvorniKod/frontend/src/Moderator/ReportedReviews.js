import React, { useEffect, useState } from 'react';
import ReportItem from '../Components/ReportItem';
import '../stilovi/ReportedReviews.css';
import logo from '../Components/Assets/logo1.png';
import {useNavigate} from "react-router-dom";

function ReportedReviews() {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
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
                const token = localStorage.getItem('token');
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getReviewReports`, {
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
                setReviews(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductReports();
    }, []);

    return (
        <div className="reported-reviews-page"> {/* Dodajte klasu za stil */}
            <div className="header-reported-reviews">
                <img src={logo} alt="Logo" className="report-review-logo" onClick={() => navigate(`/moderatorHome`)}/>
                <h2 className="header-title-reported-reviews">Prijavljene recenzije</h2>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <a onClick={() => navigate(-1)} className="back-button22">
                ← Natrag
            </a>
            <div className="reported-reviews-container">
                {reviews.map((review, index) => (
                    <div className="reported-reviews-card" key={index}>
                        <ReportItem {...review} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ReportedReviews;