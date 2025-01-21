import React, { useEffect, useState } from 'react';
import ReportItem from './ReportItem';
import './stilovi/ReportedUsers.css';
import logo from "./Components/Assets/logo1.png";
import {useNavigate} from "react-router-dom";

function ReportedUsers() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserReports = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getUserReports`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user reports');
                }

                const data = await response.json();
                setUsers(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserReports();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="reported-users-page">
            <div className="header-reported-users">
                <img src={logo} alt="Logo" className="report-user-logo" onClick={() => navigate(`/moderatorHome`)}/>
                <h2 className="header-title-reported-users">Prijavljeni korisnici</h2>
            </div>
            <div className="reported-users-container">
                {users.length === 0 ? (
                    <p>No reported users available</p>
                ) : (
                    users.map((user, index) => (
                        <div className="reported-users-card" key={index}>
                            <ReportItem {...user} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ReportedUsers;