import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../stilovi/UserActivity.css';
import logo1 from "../Components/Assets/logo1.png";

const ModeratorActivity = () => {
    const navigate = useNavigate();
    const [moderatorActivities, setModeratorActivities] = useState([]);
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

        const fetchActivities = async () => {
            try {
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getModLogs`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }});
                const data = await response.json();
                setModeratorActivities(data);
            } catch (error) {
                console.error('Error fetching moderator activities:', error);
            }
        };
        fetchActivities();
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
                <h1 className="header-title">Aktivnost moderatora</h1>
            </div>
            <table id="table-moderator">
                <thead>
                <tr>
                    <th>Datum i vrijeme</th>
                    <th>Moderator</th>
                    <th>Korisnik</th>
                    <th>Razlog</th>
                    <th>Tip aktivnosti</th>
                    <th>Mjera</th>
                    <th>Prijavljen ID</th>
                </tr>
                </thead>
                <tbody>
                {moderatorActivities.map((activity, index) => (
                    <tr key={index}>
                        <td>{new Date(activity.dateTime).toLocaleString()}</td>
                        <td>
                            <div className="cell-wrapper">
                                <strong>{activity.moderatorName}</strong>
                                <span>{activity.moderatorEmail}</span>
                            </div>
                        </td>
                        <td>
                            <div className="cell-wrapper">
                                <strong>{activity.userName}</strong>
                                <span>{activity.userEmail}</span>
                            </div>
                        </td>
                        <td>
                            <ul>
                                {activity.approvedReasons.map((reason, idx) => (
                                    <li key={idx}>{reason}</li>
                                ))}
                            </ul>
                        </td>
                        <td>
                            {activity.warning
                                ? 'Warning'
                                : activity.ignored
                                    ? 'Ignored'
                                    : 'Disciplinary'}
                        </td>
                        <td>{activity.disciplinaryMeasure || 'N/A'}</td>
                        <td>{activity.reportId}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ModeratorActivity;
