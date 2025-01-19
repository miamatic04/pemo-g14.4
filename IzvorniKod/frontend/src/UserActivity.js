import React, { useEffect, useState } from 'react';
import './stilovi/UserActivity.css';

const UserActivity = () => {
    const [userActivities, setUserActivities] = useState([]);

    useEffect(() => {
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
            <h2>User Activity</h2>
            <table>
                <thead>
                <tr>
                    <th>Datetime</th>
                    <th>User</th>
                    <th>Activity Type</th>
                    <th>Explanation</th>
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
