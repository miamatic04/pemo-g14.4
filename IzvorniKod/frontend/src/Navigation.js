import React from 'react';
import { Link } from 'react-router-dom';
import './stilovi/Navigation.css';

function Navigation() {
    return (
        <nav className="navigation">
            <ul>
                <li><Link to="/reportedReviews">Reported Reviews</Link></li>
                <li><Link to="/reportedProducts">Reported Products</Link></li>
                <li><Link to="/reportedShops">Reported Shops</Link></li>
                <li><Link to="/reportedUsers">Reported Users</Link></li>
            </ul>
        </nav>
    );
}

export default Navigation;