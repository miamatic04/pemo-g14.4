import React, { useState, useEffect } from 'react';
import '../stilovi/AccountRequests.css';
import logo from "../Components/Assets/logo1.png";
import { useNavigate } from "react-router-dom";

function AccountRequests() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
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
                else if(localStorage.getItem("role") === "owner")
                    navigate("/ownerhome");
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
        // Fetch account requests from the server
        const fetchAccountRequests = async () => {
            try {
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getPromotionRequests`); // API call to fetch requests
                if (!response.ok) {
                    throw new Error('Failed to fetch promotion requests');
                }
                const data = await response.json();
                setRequests(data); // Assuming `data` is an array of objects with `email` and `name`
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAccountRequests();
    }, []);

    const handlePromote = async (email) => {
        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/promoteUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ email }), // Send email in the body
            });

            if (!response.ok) {
                throw new Error('Failed to promote user');
            }

            console.log(`User promoted successfully: ${email}`);
            // Optionally, update the UI after promotion
            setRequests((prevRequests) =>
                prevRequests.filter((request) => request.email !== email)
            );
        } catch (error) {
            console.error(`Error promoting user: ${error.message}`);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="account-requests-page">
            <div className="header-account-requests">
                <img
                    src={logo}
                    alt="Logo"
                    className="account-request-logo"
                    onClick={() => navigate(`/moderatorHome`)}
                />
                <h2 className="header-title-account-requests">Zahtjevi za vlasnički račun</h2>
            </div>
            <div className="account-requests-container">
                {requests.length === 0 ? (
                    <p>No account requests available</p>
                ) : (
                    requests.map((request) => (
                        <div className="account-request-card" key={request.email}>
                            <p>Korisnik: {request.name}</p> {/* Display user name */}
                            <div className="button-group-account-request">
                                <button
                                    className="button-account-request-profil"
                                    onClick={() => navigate(`/userProfile`, { state: { email: request.email } })}
                                >
                                    Idi na profil
                                </button>
                                <button
                                    className="button-account-request-odobri"
                                    onClick={() => handlePromote(request.email)}
                                >
                                    Promote
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default AccountRequests;

