import React, { useState, useEffect } from 'react';
import './stilovi/ModeratorActivity.css';

const ModeratorActivity = () => {
    const [moderatorActivities, setModeratorActivities] = useState([]);

    useEffect(() => {
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
        <div className="moderator-activity">
            <h2>Moderator Activity</h2>
            <table>
                <thead>
                <tr>
                    <th>Datetime</th>
                    <th>Moderator</th>
                    <th>User</th>
                    <th>Reasons</th>
                    <th>Type</th>
                    <th>Measure</th>
                    <th>Report ID</th>
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
                        <td>{activity.warning ? 'Warning' : 'Disciplinary'}</td>
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
