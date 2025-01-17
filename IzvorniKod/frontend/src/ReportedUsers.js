import React, {useEffect, useState} from 'react';
import ReportItem from './ReportItem';
import './stilovi/ReportedUsers.css';

function ReportedUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Function to fetch product reports
        const fetchProductReports = async () => {
            try {
                const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getUserReports`, {
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
                setUsers(data); // Assuming the response returns an array of product reports
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductReports();
    }, []);

    return (
        <div className="reported-users">
            <h2>Reported Users</h2>
            {users.map((user, index) => (
                <ReportItem key={index} {...user} />
            ))}
        </div>
    );
}

export default ReportedUsers;

