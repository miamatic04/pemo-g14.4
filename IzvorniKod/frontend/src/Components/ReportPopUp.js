import React, { useState } from 'react';
import '../stilovi/ReportPopUp.css';

const REPORT_REASONS = [
    "SPREADING_FALSE_INFORMATION",
    "HARASSMENT_OR_BULLYING",
    "HATE_SPEECH",
    "SPAM_OR_SCAM",
    "IMPERSONATION",
    "PRIVACY_VIOLATION",
    "INAPPROPRIATE_CONTENT",
    "MISLEADING_ADVERTISING",
    "DANGEROUS_ACTS_OR_CONTENT",
    "CHILD_ENDANGERMENT",
    "SELF_HARM_OR_SUICIDE_CONTENT",
    "OTHER"
];

const ReportPopup = ({ onClose, onSubmit }) => {
    const [selectedReasons, setSelectedReasons] = useState([]);
    const [note, setNote] = useState("");
    const reportedShopId = localStorage.getItem("reportedShopId");
    const reportedReviewId = localStorage.getItem("reportedReviewId");
    const reportedUserEmail = localStorage.getItem("reportedUserId");
    const reportedProductId = localStorage.getItem("reportedProductId");

    const handleReportSubmit = async () => {

        const reportData = {
            note,
            reportReasons: selectedReasons,
        };

        if (reportedReviewId) {
            reportData.reportedReviewId = reportedReviewId;
        } else if (reportedShopId) {
            reportData.reportedShopId = reportedShopId;
        } else if (reportedProductId) {
            reportData.reportedProductId = reportedProductId;
        } else if (reportedUserEmail) {
            reportData.reportedUserEmail = reportedUserEmail;
        }

        console.log(reportData);
        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/sendReport`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(reportData),
            });

            if (response.ok) {
                alert('Report submitted successfully.');
            } else {
                alert('Error submitting report.');
            }
        } catch (error) {
            console.error('Error sending report:', error);
            alert('Error sending report.');
        } finally {

            localStorage.removeItem('reportedReviewId');
            localStorage.removeItem('reportedShopId');
            localStorage.removeItem('reportedProductId');
            localStorage.removeItem("reportedUserId");
            onClose();
        }
    };

    const handleCheckboxChange = (reason) => {
        setSelectedReasons((prev) =>
            prev.includes(reason)
                ? prev.filter((r) => r !== reason)
                : [...prev, reason]
        );
    };

    return (
        <div className="report-popup">
            <div className="report-popup-content">
                <h2>Prijavi trgovinu</h2>
                <p>Odaberite razloge za prijavu:</p>
                <div className="report-reasons">
                    {REPORT_REASONS.map((reason) => (
                        <label key={reason} className="reason-item">
                            <input
                                type="checkbox"
                                value={reason}
                                onChange={() => handleCheckboxChange(reason)}
                                checked={selectedReasons.includes(reason)}
                            />
                            <span className="reason-text">{reason.replace(/_/g, ' ')}</span>
                        </label>
                    ))}
                </div>
                <textarea
                    className="report-note"
                    placeholder="Dodajte bilješku (opcionalno)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
                <div className="report-popup-actions">
                    <button className="cancel-btn" onClick={onClose}>
                        Odustani
                    </button>
                    <button className="submit-btn" onClick={handleReportSubmit}>
                        Prijavi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportPopup;
