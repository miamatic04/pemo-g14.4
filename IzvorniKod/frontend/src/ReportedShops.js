import React, {useEffect, useState} from 'react';
import ReportItem from './ReportItem';
import './stilovi/ReportedShops.css';

function ReportedShops() {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Function to fetch product reports
        const fetchProductReports = async () => {
            try {
                const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getShopReports`, {
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
                setShops(data); // Assuming the response returns an array of product reports
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductReports();
    }, []);

    return (
        <div className="reported-shops">
            <h2>Reported Shops</h2>
            {shops.map((shop, index) => (
                <ReportItem key={index} {...shop} />
            ))}
        </div>
    );
}

export default ReportedShops;

