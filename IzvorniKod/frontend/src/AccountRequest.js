import React, { useState, useEffect } from 'react';
import './stilovi/AccountRequests.css';
import logo from "./Components/Assets/logo1.png";
import { useNavigate } from "react-router-dom";

function AccountRequests() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hardkodirane vrijednosti za testiranje
    const hardcodedRequests = [
        {
            user_id: 'john.doe@example.com',
            user_name: 'John Doe',
            request_note: 'Zahtjev za vlasnički račun.',
            status: 'pending'
        },
        {
            user_id: 'jane.doe@example.com',
            user_name: 'Jane Doe',
            request_note: 'Zahtjev za vlasnički račun.',
            status: 'pending'
        },
        {
            user_id: 'alice.smith@example.com',
            user_name: 'Alice Smith',
            request_note: 'Zahtjev za vlasnički račun.',
            status: 'pending'
        }
    ];

    useEffect(() => {
        // Simulacija učitavanja podataka
        const fetchAccountRequests = async () => {
            try {
                // Ovdje bismo normalno dohvatili podatke s API-ja
                // Umjesto toga, koristimo hardkodirane podatke
                setRequests(hardcodedRequests);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAccountRequests();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="account-requests-page">
            <div className="header-account-requests">
                <img src={logo} alt="Logo" className="account-request-logo" onClick={() => navigate(`/moderatorHome`)} />
                <h2 className="header-title-account-requests">Zahtjevi za vlasnički račun</h2>
            </div>
            <div className="account-requests-container">
                {requests.length === 0 ? (
                    <p>No account requests available</p>
                ) : (
                    requests.map((request) => (
                        <div className="account-request-card" key={request.user_id}> {/* Koristimo email kao ključ */}
                            <p>Korisnik: {request.user_name}</p> {/* Prikazujemo user_name */}
                            <div className="button-group-account-request">
                                <button className="button-account-request-profil" onClick={() => navigate(`/profile`, { state: { email: request.user_id } })}> {/* Navigacija na profil korisnika */}
                                    Idi na profil
                                </button>
                                <button className="button-account-request-odobri" onClick={() => handleApprove(request.user_id)}>Odobri</button>
                                <button className="button-account-request-odbaci" onClick={() => handleReject(request.user_id)}>Odbaci</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    function handleApprove(userId) {
        // Logika za odobravanje zahtjeva
        console.log(`Approved request for user ID (email): ${userId}`);
    }

    function handleReject(userId) {
        // Logika za odbacivanje zahtjeva
        console.log(`Rejected request for user ID (email): ${userId}`);
    }
}

export default AccountRequests;