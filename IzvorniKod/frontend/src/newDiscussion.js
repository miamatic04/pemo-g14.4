import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/newDiscussion.css';
import logo1 from "./Components/Assets/logo1.png";

const NewDiscussion = () => {
    const [discussionData, setDiscussionData] = useState({
        name: '',
        description: '',
    });

    const [message, setMessage] = useState(''); // Stanje za poruku
    const navigate = useNavigate();

    const handlePublish = () => {
        // Ovdje možete dodati logiku za slanje podataka na backend
        setMessage('Uspješno objavljena rasprava!'); // Postavljanje poruke
        setTimeout(() => {
            setMessage(''); // Uklanjanje poruke nakon 2 sekunde
            navigate('/forum'); // Navigacija na forum
        }, 2000);
    };

    const handleDiscard = () => {
        setMessage('Uspješno otkazana objava rasprave!'); // Postavljanje poruke
        setTimeout(() => {
            setMessage(''); // Uklanjanje poruke nakon 2 sekunde
            navigate('/forum'); // Navigacija na forum
        }, 2000);
    };

    return (
        <div className="new-discussion-page">
            <div className="new-discussion-container">
                <div className="header-section">
                    <img
                        src={logo1}
                        alt="Logo"
                        className="logo1Discussion"
                        onClick={() => navigate('/userhome')}
                        style={{ cursor: 'pointer' }}
                    />
                    <h1 className="newDiscussionTitle">NOVA RASPRAVA</h1>
                </div>

                <div>
                    <p className="newDiscussionName">Naziv:</p>
                    <input
                        className="newDiscussionNameInput"
                        value={discussionData.name}
                        onChange={(e) => setDiscussionData({ ...discussionData, name: e.target.value })}
                    />
                </div>

                <div>
                    <p className="newDiscussionDescription">Opis:</p>
                    <textarea
                        className="newDiscussionDescriptionInput"
                        value={discussionData.description}
                        onChange={(e) => setDiscussionData({ ...discussionData, description: e.target.value })}
                    ></textarea>
                </div>

                {/* Prikazivanje poruke */}
                {message && <div className="messageDiscussion">{message}</div>}

                <div className="button-container-discussion">
                    <button className="publishDiscussion" onClick={handlePublish}>Objavi raspravu</button>
                    <button className="discardDiscussion" onClick={handleDiscard}>Odustani od rasprave</button>
                </div>
            </div>
        </div>
    );
};

export default NewDiscussion;