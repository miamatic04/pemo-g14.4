import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/DiscussionDetails.css';
import logo1 from './Components/Assets/logo1.png';
import avatarImage from './Components/Assets/avatar.png'; // Putanja do slike avatara

const DiscussionDetails = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        username: '',
        district: '',
        role: 'user'
    });

    const [backendResult, setBackendResult] = useState(null);
    const [responseMessages, setResponseMessages] = useState({}); // Novo stanje za praćenje poruka po korisniku
    const userRole = localStorage.getItem('role');
    const navigate = useNavigate();

    const [users, setUsers] = useState([
        { id: 1, username: 'Username2', response: 'Bla bla bla', avatar: avatarImage },
        { id: 2, username: 'Username3', response: '', avatar: avatarImage },
        { id: 3, username: 'Username4', response: '', avatar: avatarImage },
        { id: 4, username: 'Username5', response: '', avatar: avatarImage },
        { id: 5, username: 'Username6', response: '', avatar: avatarImage },
        { id: 6, username: 'Username7', response: '', avatar: avatarImage },
    ]);

    useEffect(() => {
        const storedData = localStorage.getItem('userProfile');
        if (storedData) {
            setFormData(JSON.parse(storedData));
        }
    }, []);

    const handleResponseChange = (id, value) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === id ? { ...user, response: value } : user
            )
        );
    };

    const handleSubmit = (id) => {
        setResponseMessages((prevMessages) => ({
            ...prevMessages,
            [id]: "Odgovor objavljen!"
        }));
    };

    const handleCancel = (id) => {
        setResponseMessages((prevMessages) => ({
            ...prevMessages,
            [id]: "Odgovor nije objavljen!"
        }));
    };

    return (
        <div className="discussion-details-page">
            <div className="discussion-details-container">
                <div className="logo1DiscussionDetails">
                    <img src={logo1} className="logo1DiscussionImage"
                         onClick={() => navigate(userRole === 'owner' ? '/ownerhome' : '/userhome')}
                         style={{cursor: 'pointer'}}/>
                </div>
                <div className="header-section-discussionDetails">
                    <img src={avatarImage} alt="Avatar" className="avatarDiscussionDetails"/>
                    <div className="discussionDetails-info">
                        <b><p className="imeUseraDiscussionDetails">Username1: </p></b>
                        <b><p className="nazivDiscussionDetails">Naziv1</p></b>
                        <p className="opisDiscussionDetails">Opis1</p>
                    </div>
                </div>

                {/* Polja za unos */}
                <div className="DiscussionContainer">
                    {users.map((user) => (
                        <div key={user.id} className="user-response-container">
                            <div className="header-section-discussionDetailsResponse">
                                <img src={user.avatar} alt="Avatar" className="avatarDiscussionDetails"/>
                                <div className="discussionDetailsResponse-info">
                                    <b><p className="imeUseraDiscussionDetails">{user.username}: </p></b>
                                    <p className="opisDiscussionDetails">{user.response}</p>
                                </div>
                            </div>
                            <textarea
                                className="inputDiscussionDetails"
                                placeholder={`Unesite odgovor za ${user.username}`}
                                onChange={(e) => handleResponseChange(user.id, e.target.value)}
                            ></textarea>

                            {/* Prikaz poruke samo za ovog korisnika */}
                            {responseMessages[user.id] && (
                                <p className="response-message-discussion">{responseMessages[user.id]}</p>
                            )}

                            <div className="button-container">
                                <button
                                    className="sendResponseDiscussion"
                                    onClick={() => handleSubmit(user.id)}
                                >
                                    Pošalji odgovor
                                </button>
                                <button
                                    className="discardResponseDiscussion"
                                    onClick={() => handleCancel(user.id)}
                                >
                                    Otkaži slanje odgovora
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="backToForum"
                    onClick={() => navigate('/forum')}
                >
                    Nazad na forum
                </button>
            </div>
        </div>
    );
};

export default DiscussionDetails;