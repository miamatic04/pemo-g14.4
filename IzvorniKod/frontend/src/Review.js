import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/review.css';
import logo from './Components/Assets/logo1.png';

const ReviewPage = () => {
    const navigate = useNavigate();
    // Replace location.state with localStorage
    const productId = localStorage.getItem('selectedProductId');
    const shopId = localStorage.getItem('selectedShopId');
    const shopName = localStorage.getItem('selectedShopName');

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const handleRatingClick = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleRatingHover = (hoveredRating) => {
        setHoverRating(hoveredRating);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file); // Store the actual file
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result); // Store the preview URL
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('text', comment);
            formData.append('rating', rating);

            if (imageFile) {
                formData.append('file', imageFile);
            }

            if (shopId) {
                formData.append('shopId', shopId);
            }

            if (productId) {
                formData.append('productId', productId);
            }

            const token = localStorage.getItem('token');

            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/postReview`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                // Navigate back to product page without state
                if(localStorage.getItem("cameFrom") === "product")
                    navigate('/product');
                else
                    navigate('/shop');
            } else {
                console.error('Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const handleOtkazi = () => {
        // Navigate back to product page without state
        if(localStorage.getItem("cameFrom") === "product")
            navigate('/product');
        else
            navigate('/shop');
    };

    return (
        <div className="review-page">
            <div className="review-card">
                <div className="review-header">
                    <h2 className="review-title">MOJA RECENZIJA</h2>
                    <img src={logo} alt={"logo"} onClick={() => navigate('/UserHome')}/>
                </div>

                <div className="review-content1">
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
                                  className="comment-textarea1" rows={4}/>
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
                                    <button className="remove-img" onClick={() => {
                                        setImage(null);
                                        setImageFile(null);
                                    }}
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