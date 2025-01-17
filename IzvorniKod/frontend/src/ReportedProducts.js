import React, { useState, useEffect } from 'react';
import ReportItem from './ReportItem';
import './stilovi/ReportedProducts.css';

function ReportedProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Function to fetch product reports
        const fetchProductReports = async () => {
            try {
                const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getProductReports`, {
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
                setProducts(data); // Assuming the response returns an array of product reports
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductReports();
    }, []); // Empty dependency array means this runs only once after the initial render

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="reported-products">
            <h2>Reported Products</h2>
            {products.length === 0 ? (
                <p>No reported products available</p>
            ) : (
                products.map((product, index) => (
                    <ReportItem key={index} {...product} />
                ))
            )}
        </div>
    );
}

export default ReportedProducts;
