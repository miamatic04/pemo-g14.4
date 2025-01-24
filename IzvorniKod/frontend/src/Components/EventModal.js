import React from 'react';
import '../stilovi/eventModal.css';
import ProductModal from "./ProductModal";

const EventModal = ({ event, onClose, onSignup, navigate }) => {
    const generateGoogleCalendarLink = (event) => {
        const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
        const startDate = new Date(event.dateTime);
        const endDate = new Date(startDate.getTime() + (event.duration || 60) * 60 * 1000);
        const formatDate = (date) => date.toISOString().replace(/[-:]/g, "").split(".")[0];

        const params = new URLSearchParams({
            text: event.name,
            details: event.description || "",
            location: event.shopName || "",
            dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
        });

        return `${baseUrl}&${params.toString()}`;
    };

    return (
        <div className="modal-overlay3" onClick={onClose}>
            <div className="modal-content3" onClick={e => e.stopPropagation()}>
                <h2>{event.name}</h2>
                <div className="modal-buttons3">
                    <button onClick={() => navigate('/shop', {
                        state: { shopId: event.shopId }
                    })}>
                        Idi na profil trgovine
                    </button>
                    <button onClick={() => onSignup(event.id)}>
                        Prijavi se
                    </button>
                    <button onClick={() => window.open(generateGoogleCalendarLink(event), "_blank")}>
                        Dodaj u kalendar
                    </button>
                </div>
                <button className="modal-close3" onClick={onClose}>×</button>
            </div>
        </div>
    );
};

export default EventModal;