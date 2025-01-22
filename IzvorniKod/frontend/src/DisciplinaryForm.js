import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './stilovi/DisciplinaryForm.css';

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

            onClose();

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
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
                <h2>Izdaj disciplinsku mjeru za {reportedName}</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <select
                        value={measureType}
                        onChange={(e) => setMeasureType(e.target.value)}
                        style={{ width: '100%', marginBottom: '10px' }}
                    >
                        <option value="">Odaberi mjeru</option>
                        <option value="THREE_DAY_BAN">Zabrana u trajanju od tri dana</option>
                        <option value="ONE_WEEK_BAN">Zabrana u trajanju od jednog tjedna</option>
                        <option value="ONE_MONTH_BAN">Zabrana u trajanju od mjesec dana</option>
                        <option value="LIFETIME_BAN">Doživotna zabrana</option>
                    </select>
                    <textarea
                        value={measureText}
                        onChange={(e) => setMeasureText(e.target.value)}
                        placeholder="Unesi detalje disciplinske mjere"
                        rows="4"
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                    <div>
                        <button type="button" onClick={onClose} disabled={loading} className="button-disciplinary-form-odustani">Odustani</button>
                        <button type="submit" disabled={loading} className="button-disciplinary-form-posalji">
                            {loading ? 'Applying...' : 'Primijeni mjeru'}
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
