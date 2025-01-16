import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/review.css';
import logo from './Components/Assets/logo1.png';

const ReviewPage = () => {
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [image, setImage] = useState(null);
    const userRole = localStorage.getItem('role');

    const handleRatingClick = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleRatingHover = (hoveredRating) => {
        setHoverRating(hoveredRating);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        navigate('/product');
    };

    const handleOtkazi = () => {
        navigate('/product');
    };

    return (
        <div className="review-page">
            <div className="review-card">
                <div className="review-header">
                    <h2 className="review-title">MOJA RECENZIJA</h2>
                    <img src={logo} alt={"logo"} onClick={() => navigate(userRole === 'owner' ? '/ownerhome' : '/userhome')}/>
                </div>

                <div className="review-content">
                    <div className="rating-section">
                        <label className="section-label">Daj ocjenu:</label>
                        <div className="star-container">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} className="star-btn" onClick={() => handleRatingClick(star)}
                                        onMouseEnter={() => handleRatingHover(star)}
                                        onMouseLeave={() => handleRatingHover(0)}>
                                    <span
                                        className={`star ${star <= (hoverRating || rating) ? 'star-filled' : 'star-empty'}`}>★</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="comment-section">
                        <label className="section-label">Ostavi komentar:</label>
                        <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                                  className="comment-textarea" rows={4}/>
                    </div>

                    <div className="img-section">
                        <label className="section-label">Priloži sliku:</label>
                        <div className="image-upload-container">
                            <button className="upload-btn"
                                    onClick={() => document.getElementById('imageUpload').click()}>Uvezi sliku
                            </button>
                            <input type="file" id="imageUpload" className="hidden-input" accept="image/*"
                                   onChange={handleImageUpload}/>
                            {image && (
                                <div className="preview1">
                                    <button className="remove-img" onClick={() => setImage(null)}
                                            title="Ukloni sliku">✕
                                    </button>
                                    <img src={image} alt="Uploaded preview" className="preview2"/>
                                </div>
                            )}
                        </div>
                    </div>

                    <button className="submit-btn" onClick={handleSubmit}>Pošalji recenziju</button>
                    <button className="submit-btn" id="otkazi-btn" onClick={handleOtkazi}>Otkaži recenziju</button>
                </div>
            </div>
        </div>
    );
};

export default ReviewPage;