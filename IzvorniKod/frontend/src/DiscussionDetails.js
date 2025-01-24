import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/DiscussionDetails.css';
import logo1 from './Components/Assets/logo1.png';
import avatarImage from './Components/Assets/avatar.png'; // Path to avatar image

const DiscussionDetails = () => {
    const discussionId = localStorage.getItem("discussionId");
    const authorName = localStorage.getItem("discussionAuthor");
    const text = localStorage.getItem("discussionText");
    const title = localStorage.getItem("discussionTitle");
    const dateTime = localStorage.getItem("dateTime");
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState(''); // State for posting a new reply
    const userRole = localStorage.getItem('role');
    const navigate = useNavigate();

    // Fetch discussion replies on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getDiscussionReplies/${discussionId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                // Sort replies by dateTime (oldest first, newest at the bottom)
                const sortedReplies = data.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
                setReplies(sortedReplies);
            })
            .catch(error => console.error('Error fetching discussion replies:', error));
    }, [discussionId]);


    const handlePostReply = () => {
        const token = localStorage.getItem('token');

        if (!newReply.trim()) {
            alert('Odgovor ne može biti prazan!');
            return;
        }

        fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/postReply/${discussionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text: newReply })
        })
            .then(response => {
                if (response.ok) {
                    alert('Odgovor uspješno poslan!');
                    setNewReply(''); // Clear the input field
                    // Refresh replies after successful posting
                    return fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getDiscussionReplies/${discussionId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }).then(res => res.json()).then(data => setReplies(data));
                } else {
                    alert('Došlo je do greške prilikom slanja odgovora.');
                }
            })
            .catch(error => console.error('Error posting reply:', error));
    };

    const handleDeleteReply = (replyId) => {
        const token = localStorage.getItem('token');

        fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/deleteReply/${replyId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    alert('Odgovor uspješno obrisan!');
                    // Remove the deleted reply from state
                    setReplies((prevReplies) => prevReplies.filter((reply) => reply.id !== replyId));
                } else {
                    alert('Došlo je do greške prilikom brisanja odgovora.');
                }
            })
            .catch(error => console.error('Error deleting reply:', error));
    };

    return (
        <div className="discussion-details-page">
            <div className="discussion-details-container">
                <div className="logo1DiscussionDetails">
                    <img
                        src={logo1}
                        className="logo1DiscussionImage"
                        onClick={() => navigate(userRole === 'owner' ? '/ownerhome' : '/userhome')}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <div className="header-section-discussionDetails">
                    <img src={avatarImage} alt="Avatar" className="avatarDiscussionDetails"/>
                    <div className="discussionDetails-info">
                        <b>
                            <p className="imeUseraDiscussionDetails">{authorName}</p>
                        </b>
                        <b>
                            <p className="nazivDiscussionDetails">{title}</p>
                        </b>
                        <p className="opisDiscussionDetails">{text}</p>
                        {/* Display DateTime of the discussion */}
                        <p className="discussionDateTime">
                            {new Date(dateTime).toLocaleString()} {/* Format the stored dateTime */}
                        </p>
                    </div>
                </div>

                {/* Display Replies */}
                <div className="DiscussionContainer">
                    {replies.map((reply) => (
                        <div key={reply.id} className="user-response-container">
                            <div className="header-section-discussionDetailsResponse">
                                <img src={avatarImage} alt="Avatar" className="avatarDiscussionDetails"/>
                                <div className="discussionDetailsResponse-info">
                                    <b>
                                        <p className="imeUseraDiscussionDetails">{reply.authorName}:</p>
                                    </b>
                                    <p className="opisDiscussionDetails">{reply.text}</p>
                                    {/* Display Timestamp */}
                                    <p className="replyTimestamp">
                                        {new Date(reply.dateTime).toLocaleString()} {/* Format timestamp */}
                                    </p>
                                </div>
                            </div>
                            {/* Conditionally render delete button if user is the author */}
                            {reply.author && (
                                <button
                                    className="deleteReplyButton"
                                    onClick={() => handleDeleteReply(reply.id)}
                                >
                                    Obriši odgovor
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add New Reply Section */}
                <div className="reply-form">
                    <textarea
                        className="inputDiscussionDetails"
                        placeholder="Unesite novi odgovor"
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                    ></textarea>
                    <div className="button-container">
                        <button className="sendResponseDiscussion" onClick={handlePostReply}>
                            Pošalji odgovor
                        </button>
                    </div>
                </div>

                <button className="backToForum" onClick={() => navigate('/forum')}>
                    Nazad na forum
                </button>
            </div>
        </div>
    );
};

export default DiscussionDetails;
