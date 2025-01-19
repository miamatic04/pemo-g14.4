import React, { useState } from 'react';
import PropTypes from 'prop-types';

function DisciplinaryForm({ onClose, reportedEmail, reportedName, reportId, approvedReasons }) {
    const [measureText, setMeasureText] = useState('');
    const [measureType, setMeasureType] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!measureType || !measureText) {
            setError('Please select a measure and enter details.');
            return;
        }

        // Prepare the data for the POST request
        let data = {
            disciplinedUserEmail: reportedEmail,
            note: measureText,
            type: measureType,
            reportId: reportId,
            reasons: approvedReasons
        };

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/sendDcMeasure`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to apply disciplinary measure');
            }

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }

        data = {
            userEmail: reportedEmail,
            note: measureText,
            disciplinaryMeasure: measureType,
            reportId: reportId,
            approvedReasons: approvedReasons
        };

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/logModActivity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to send warning');
            }

            onClose();
            window.location.reload();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '5px',
                width: '300px',
            }}>
                <h2>Issue a Disciplinary Measure to {reportedName}</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <select
                        value={measureType}
                        onChange={(e) => setMeasureType(e.target.value)}
                        style={{ width: '100%', marginBottom: '10px' }}
                    >
                        <option value="">Select a measure</option>
                        <option value="THREE_DAY_BAN">Three Day Ban</option>
                        <option value="ONE_WEEK_BAN">One Week Ban</option>
                        <option value="ONE_MONTH_BAN">One Month Ban</option>
                        <option value="LIFETIME_BAN">Lifetime Ban</option>
                    </select>
                    <textarea
                        value={measureText}
                        onChange={(e) => setMeasureText(e.target.value)}
                        placeholder="Enter details of the disciplinary measure"
                        rows="4"
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                    <div>
                        <button type="button" onClick={onClose} disabled={loading}>Cancel</button>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Applying...' : 'Apply Measure'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

DisciplinaryForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    reportedEmail: PropTypes.string.isRequired,
    reportId: PropTypes.number.isRequired,
    approvedReasons: PropTypes.arrayOf(PropTypes.string)
};

export default DisciplinaryForm;
