import React, { useState } from 'react';
import PropTypes from 'prop-types';

function WarningForm({ onClose, reportedEmail, reportedName, reportId, approvedReasons }) {
    const [warningText, setWarningText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!warningText) {
            setError('Please enter a warning message.');
            return;
        }

        let data = {
            warnedUserEmail: reportedEmail,
            note: warningText,
            reportId: reportId,
            approvedReasons: approvedReasons,
            warning: true
        };

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/sendWarning`, {
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

            console.log(`Warning sent to ${reportedName}: ${warningText}`);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }

        data = {
            userEmail: reportedEmail,
            note: warningText,
            reportId: reportId,
            approvedReasons: approvedReasons,
            warning: true
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

            console.log(`Warning sent to ${reportedName}: ${warningText}`);
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
                <h2>Issue a Warning to {reportedName}</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <textarea
                        value={warningText}
                        onChange={(e) => setWarningText(e.target.value)}
                        placeholder="Enter warning message"
                        rows="4"
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                    <div>
                        <button type="button" onClick={onClose} disabled={loading}>Cancel</button>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Warning'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

WarningForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    reportedName: PropTypes.string.isRequired,
    reportedEmail: PropTypes.string.isRequired,
    reportId: PropTypes.number.isRequired,
    approvedReasons: PropTypes.arrayOf(PropTypes.string)
};

export default WarningForm;
