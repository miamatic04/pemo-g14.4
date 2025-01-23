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

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getDiscussions`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            setAllDiscussions(data);
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
                    .map((discussion, index) => (
                        <div className="forum-card" key={index}>
                            <div className="forum-column-left-column">
                                <div className="user-info-wrapper">
                                    <img src={avatar} alt="avatar" className="avatarUser-image"/>
                                    <div className="user-info">
                                        <h4 className="usernameForum">{discussion.authorName}</h4>
                                        <h4 className="nameOfDiscussion">{discussion.title}</h4>
                                    </div>
                                </div>
                                <p className="opisRasprave">{discussion.text}</p>
                            </div>
                            <div className="forum-column-right-column">
                                <button className="vidiViseRasprava" onClick={() => navigate('/DiscussionDetails')}>
                                    Vidi detalje rasprave
                                </button>
                                <p className="answerForum">Odgovori:</p>
                                <textarea className="answerHereForum"></textarea>
                                <button className="vidiViseRasprava" id={"odg"}>
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
