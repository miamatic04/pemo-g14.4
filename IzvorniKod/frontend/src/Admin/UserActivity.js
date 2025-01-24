import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../stilovi/UserActivity.css';
import logo1 from "../Components/Assets/logo1.png";

const UserActivity = () => {
    const [userActivities, setUserActivities] = useState([]);
    const navigate = useNavigate();
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

            if (!response.ok || !(localStorage.getItem("role") === "admin")) {
                if(localStorage.getItem("role") === "user")
                    navigate("/userhome");
                else if(localStorage.getItem("role") === "moderator")
                    navigate("/moderatorhome");
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

        const fetchUserLogs = async () => {
            try {
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getUserLogs`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }});
                const data = await response.json();
                setUserActivities(data);
            } catch (error) {
                console.error('Error fetching user activities:', error);
            }
        };
        fetchUserLogs();
    }, []);

    return (
        <div className="user-activity">
            <div className="background"></div>
            <div className="header-shopsList">
                <div className="logo-container">
                    <img
                        src={logo1}
                        alt="Logo"
                        className="logo"
                        onClick={() => navigate('/adminhome')}
                        style={{cursor: 'pointer'}}
                    />
                </div>
                <h1 className="header-title">Aktivnost korisnika</h1>
            </div>
            <a onClick={() => navigate(-1)} className="back-button22">
                ← Natrag
            </a>
            <table>
                <thead>
                <tr>
                    <th>Datum i vrijeme</th>
                    <th>Korisnik</th>
                    <th>Tip aktivnosti</th>
                    <th>Objašnjenje</th>
                </tr>
                </thead>
                <tbody>
                {userActivities.map((activity, index) => (
                    <tr key={index}>
                        <td>{new Date(activity.dateTime).toLocaleString()}</td>
                        <td>
                            <div className="cell-wrapper">
                                <strong>{activity.userName}</strong>
                                <span>{activity.userEmail}</span>
                            </div>
                        </td>
                        <td>{activity.activityType}</td>
                        <td>{activity.note || 'N/A'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserActivity;
