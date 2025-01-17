import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './stilovi/ReportItem.css';
import WarningForm from './WarningForm';
import DisciplinaryForm from './DisciplinaryForm';

function ReportItem({ reporterName, reportedName, reportedEmail, note, reportReasons, numOfWarnings, numOfDisciplinaryMeasures, reviewText, shopId, productId, reportId }) {
    const [showWarningForm, setShowWarningForm] = useState(false);
    const [showDisciplinaryForm, setShowDisciplinaryForm] = useState(false);
    const navigate = useNavigate(); // Initialize navigate hook

    const handleNavigate = () => {
        if (shopId) {
            navigate(`/shop/${shopId}`, { replace: false });
        } else if (productId) {
            navigate(`/product/${productId}`, { replace: false });
        } else {
            navigate('/profile', {
                replace: false,
                state: { email: reportedEmail }
            });
        }
    };

    return (
        <div className="report-item">
            <h3>Reporter: {reporterName}</h3>
            <h4>Reported: {reportedName}</h4>

            {reviewText && <p><strong>Content:</strong> {reviewText}</p>}

            {note && <p><strong>Additional Info:</strong> {note}</p>}

            {reportReasons && reportReasons.length > 0 && (
                <div>
                    <strong>Report Reasons:</strong>
                    <ul>
                        {reportReasons.map((reason, index) => (
                            <li key={index}>{reason}</li>
                        ))}
                    </ul>
                </div>
            )}

            <p><strong>Warnings Issued To This Account:</strong> {numOfWarnings}</p>
            <p><strong>Disciplinary Measures Issued To This Account:</strong> {numOfDisciplinaryMeasures}</p>

            <div className="action-buttons">
                <button onClick={() => console.log('Ignore clicked')}>Ignore</button>
                <button onClick={() => setShowWarningForm(true)}>Issue a Warning</button>
                <button onClick={() => setShowDisciplinaryForm(true)}>Issue a Disciplinary Measure</button>
                {/* Add the dynamic link button */}
                <button onClick={handleNavigate}>
                    Go to {shopId ? 'Shop' : productId ? 'Product' : 'Profile'}
                </button>
            </div>

            {showWarningForm && (
                <WarningForm
                    onClose={() => setShowWarningForm(false)}
                    reportedEmail={reportedEmail}
                    reportedName={reportedName}
                    reportId={reportId}
                />
            )}

            {showDisciplinaryForm && (
                <DisciplinaryForm
                    onClose={() => setShowDisciplinaryForm(false)}
                    reportedName={reportedName}
                    reportedEmail={reportedEmail}
                    reportId={reportId}
                />
            )}
        </div>
    );
}

ReportItem.propTypes = {
    reporterName: PropTypes.string.isRequired,
    reportedName: PropTypes.string.isRequired,
    note: PropTypes.string,
    reportReasons: PropTypes.arrayOf(PropTypes.string),
    numOfWarnings: PropTypes.number,
    numOfDisciplinaryMeasures: PropTypes.number,
    shopId: PropTypes.number,
    productId: PropTypes.number,
    reviewText: PropTypes.string,
    reportedEmail: PropTypes.string.isRequired,
    reportId: PropTypes.number.isRequired
};

export default ReportItem;
