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
            <div className="gumbNovaRasprava">
            <btn className="novaRasprava" onClick={() => navigate("/newDiscussion")}>Pokreni novu raspravu</btn>
            </div>
            <div className="forum-container">
                    <div className="forum-card">
                        <div className="forum-column-left-column">
                            <div className="user-info-wrapper">
                                <img src={avatar} alt="avatar" className="avatarUser-image"/>
                                <div className="user-info">
                                    <h4 className="usernameForum">Username1</h4>
                                    <h4 className="nameOfDiscussion">Naziv1</h4>
                                </div>
                            </div>
                            <p className="opisRasprave">Opis1</p> {/* Opis ispod slike, username-a i naziva */}
                        </div>
                        <div className="forum-column-right-column">
                            <btn className="vidiViseRasprava" onClick={() => navigate('/aboutDiscusssion')}>Vidi detalje rasprave
                            </btn>
                            <p className="answerForum">Odgovori:</p>
                            <textarea className="answerHereForum"></textarea>
                        </div>
                    </div>
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
