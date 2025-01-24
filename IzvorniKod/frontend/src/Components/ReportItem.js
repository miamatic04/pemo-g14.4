import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import '../stilovi/ReportItem.css';
import WarningForm from './WarningForm';
import DisciplinaryForm from './DisciplinaryForm';
import ApproveReasons from './ApproveReasons';

function ReportItem({
                        reporterName,
                        reportedName,
                        reportedEmail,
                        note,
                        reportReasons,
                        numOfWarnings,
                        numOfDisciplinaryMeasures,
                        reviewText,
                        shopId,
                        productId,
                        reportId,
                    }) {
    const [showWarningForm, setShowWarningForm] = useState(false);
    const [showDisciplinaryForm, setShowDisciplinaryForm] = useState(false);
    const [showReasonsPopup, setShowReasonsPopup] = useState(false);
    const [approvedReasons, setApprovedReasons] = useState(reportReasons || []);
    const navigate = useNavigate();

    const handleNavigate = () => {
        if (shopId) {
            localStorage.setItem("selectedShopId", shopId);
            navigate(`/shop`, { replace: false });
        } else if (productId) {
            localStorage.setItem("selectedProductId", productId);
            navigate(`/product`, { replace: false });
        }
    };

    const handleReasonToggle = (reason) => {
        if (approvedReasons.includes(reason)) {
            setApprovedReasons(approvedReasons.filter((r) => r !== reason));
        } else {
            setApprovedReasons([...approvedReasons, reason]);
        }
    };

    const handleConfirmReasons = () => {
        console.log('Approved Reasons:', approvedReasons);
        setShowReasonsPopup(false);
    };

    const handleIgnore = async () => {

        let data = {
            warnedUserEmail: reportedEmail,
            reportId: reportId
        };

        try {
            let token = localStorage.getItem("token");
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/ignoreReport`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log('Ignore action was successful');
            } else {
                console.error('Failed to perform ignore action');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div className="report-item">
            <h3>Prijavitelj: {reporterName}</h3>
            <h4>Prijavljeni korisnik: {reportedName}</h4>

            {reviewText && (
                <p id="sadrzaji">
                    <strong>Sadržaj:</strong> {reviewText}
                </p>
            )}

            {note && (
                <p>
                    <strong>Dodatne informacije:</strong> {note}
                </p>
            )}

            {reportReasons && reportReasons.length > 0 && (
                <div>
                    <strong>Razlozi za prijavu:</strong>
                    <ul>
                        {reportReasons.map((reason, index) => (
                            <li key={index}>{reason}</li>
                        ))}
                    </ul>
                </div>
            )}

            <p>
                <strong>Broj prijava izdanih za ovog korisnika:</strong> {numOfWarnings}
            </p>
            <p>
                <strong>Broj disciplinskih mjera izdanih za ovog korisnika:</strong> {numOfDisciplinaryMeasures}
            </p>

            <div className="action-buttons-reportitem">
                <button onClick={handleIgnore} className="button-reportitem">Ignoriraj</button>
                <button onClick={() => setShowWarningForm(true)} className="button-reportitem">Izdaj uporozenje</button>
                <button onClick={() => setShowDisciplinaryForm(true)} className="button-reportitem">Izdaj disciplinsku mjeru</button>
                {(shopId || productId) && <button onClick={handleNavigate} className="button-reportitem">
                    Idi na {shopId ? 'trgovinu' : productId ? 'proizvod' : 'profil'}
                </button>}
                <button onClick={() => setShowReasonsPopup(true)}>Potvrdi razloge</button>
            </div>

            {showWarningForm && (
                <WarningForm
                    onClose={() => setShowWarningForm(false)}
                    reportedEmail={reportedEmail}
                    reportedName={reportedName}
                    reportId={reportId}
                    approvedReasons={approvedReasons}
                />
            )}

            {showDisciplinaryForm && (
                <DisciplinaryForm
                    onClose={() => setShowDisciplinaryForm(false)}
                    reportedName={reportedName}
                    reportedEmail={reportedEmail}
                    reportId={reportId}
                    approvedReasons={approvedReasons}
                />
            )}

            <ApproveReasons isOpen={showReasonsPopup} onClose={() => setShowReasonsPopup(false)}>
                <h4>Potvrdi razloge prijave</h4>
                <ul>
                    {reportReasons.map((reason, index) => (
                        <li key={index}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={approvedReasons.includes(reason)}
                                    onChange={() => handleReasonToggle(reason)}
                                />
                                {reason}
                            </label>
                        </li>
                    ))}
                </ul>
                <div className="popup-actions">
                    <button onClick={handleConfirmReasons}>Potvrdi</button>
                    <button onClick={() => setShowReasonsPopup(false)}>Otkaži</button>
                </div>
            </ApproveReasons>
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
    reportId: PropTypes.number.isRequired,
};

export default ReportItem;
