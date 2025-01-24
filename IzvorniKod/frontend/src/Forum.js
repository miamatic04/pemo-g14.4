import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/Forum.css';
import logo1 from './Components/Assets/logo1.png';
import avatar from './Components/Assets/avatar.png';

const Forum = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('role');
    const [currentPage, setCurrentPage] = useState(1);
    const [allDiscussions, setAllDiscussions] = useState([]);
    const [replyText, setReplyText] = useState({}); // Store reply texts for each discussion
    const discussionsPerPage = 3;
    const totalPages = Math.ceil(allDiscussions.length / discussionsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Handle change for a specific discussion's reply
    const handleReplyTextChange = (discussionId, text) => {
        setReplyText(prev => ({ ...prev, [discussionId]: text }));
        console.log(discussionId);
    };

    // Handle sending the reply
    const handleSendReply = (discussionId) => {
        const token = localStorage.getItem('token');
        const reply = replyText[discussionId] || ''; // Get the reply text for the specific discussion

        if (!reply.trim()) {
            alert('Odgovor ne može biti prazan!');
            return;
        }

        fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/postReply/${discussionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text: reply })
        })
            .then(response => {
                if (response.ok) {
                    alert('Odgovor uspješno poslan!');
                    setReplyText(prev => ({ ...prev, [discussionId]: '' })); // Clear reply text for this discussion
                } else {
                    alert('Došlo je do greške prilikom slanja odgovora.');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getDiscussions`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                // Sort discussions by dateTime (newest first)
                const sortedDiscussions = data.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
                setAllDiscussions(sortedDiscussions);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div className="forum-page">
            <div className="header-forum">
                <div className="logo-container">
                    <img src={logo1} alt="Logo" className="logo" onClick={() => navigate(userRole === 'owner' ? '/ownerhome' : '/userhome')}
                         style={{ cursor: 'pointer' }} />
                </div>
                <h1 className="header-title">Forum</h1>
            </div>
            <div className="spacer"></div>
            <div className="gumbNovaRasprava" onClick={() => navigate("/newDiscussion")}>
                <button className="novaRasprava">Pokreni novu raspravu</button>
            </div>
            <div className="forum-container">
                {allDiscussions
                    .slice((currentPage - 1) * discussionsPerPage, currentPage * discussionsPerPage)
                    .map((discussion) => (
                        <div className="forum-card" key={discussion.discussionId}>
                            <div className="forum-column-left-column">
                                <div className="user-info-wrapper">
                                    <img src={avatar} alt="avatar" className="avatarUser-image"/>
                                    <div className="user-info">
                                        <h4 className="usernameForum">{discussion.authorName}</h4>
                                        <h4 className="nameOfDiscussion">{discussion.title}</h4>
                                    </div>
                                </div>
                                <p className="opisRasprave">{discussion.text}</p>
                                {/* Display Timestamp */}
                                <p className="discussion-timestamp">
                                    {new Date(discussion.dateTime).toLocaleString()} {/* Format timestamp */}
                                </p>
                                <p className="prijavi-korisnika">Prijavi korisnika</p>
                            </div>
                            <div className="forum-column-right-column">
                                <button className="vidiViseRasprava" onClick={() => {
                                    localStorage.setItem('discussionId', discussion.discussionId);
                                    localStorage.setItem('discussionText', discussion.text);
                                    localStorage.setItem('discussionAuthor', discussion.authorName);
                                    localStorage.setItem('discussionTitle', discussion.title);
                                    localStorage.setItem('dateTime', discussion.dateTime);
                                    navigate('/DiscussionDetails');
                                }}>
                                    Vidi detalje rasprave
                                </button>
                                <p className="answerForum">Odgovori:</p>
                                <textarea
                                    className="answerHereForum"
                                    value={replyText[discussion.discussionId] || ''} // Unique value for each discussion
                                    onChange={(e) => handleReplyTextChange(discussion.discussionId, e.target.value)} // Pass discussion id
                                />
                                <button
                                    className="vidiViseRasprava"
                                    id="odg"
                                    onClick={() => handleSendReply(discussion.discussionId)} // Pass discussion id
                                >
                                    Pošalji odgovor
                                </button>
                            </div>
                        </div>
                    ))}
            </div>

            <div className="pagination">
                <button
                    className="navigation-btn"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>
                <span className="page-number">
                    {[...Array(totalPages)].map((_, index) => (
                        <span
                            key={index + 1}
                            className={currentPage === index + 1 ? "active" : ""}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </span>
                    ))}
                </span>
                <button
                    className="navigation-btn"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default Forum;
