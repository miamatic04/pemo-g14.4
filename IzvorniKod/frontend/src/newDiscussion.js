import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/newDiscussion.css';
import logo1 from "./Components/Assets/logo1.png";

const NewDiscussion = () => {
    const [discussionData, setDiscussionData] = useState({
        name: '',
        description: '',
    });

    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handlePublish = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/postDiscussion`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: discussionData.name,
                    text: discussionData.description,
                    authorName: '',
                    authorEmail: '',
                    isAuthor: false
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            setMessage('Uspješno objavljena rasprava!');
            setTimeout(() => {
                setMessage('');
                navigate('/forum');
            }, 2000);
        } catch (error) {
            setMessage('Greška pri objavi rasprave');
            console.error('Error:', error);
        }
    };

    const handleDiscard = () => {
        setMessage('Uspješno otkazana objava rasprave!');
        setTimeout(() => {
            setMessage('');
            navigate('/forum');
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
