import React, {useEffect, useState} from 'react';
import ReportItem from './ReportItem';
import './stilovi/ReportedReviews.css';

function ReportedReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Function to fetch product reports
        const fetchProductReports = async () => {
            try {
                const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getReviewReports`, {
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
                setReviews(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductReports();
    }, []);

    return (
        <div className="reported-reviews">
            <h2>Reported Reviews</h2>
            {reviews.map((review, index) => (
                <ReportItem key={index} {...review} />
            ))}
        </div>
    );
}

export default ReportedReviews;

