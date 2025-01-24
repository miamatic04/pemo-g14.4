import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './stilovi/EditShop.css';  
import logo1 from './Components/Assets/logo1.png';

const EditShop = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [shopDetails, setShopDetails] = useState({
        shopName: '',
        description: '',
        imagePath: ''
    });
    const [loading, setLoading] = useState(true);
    const [imageFile, setImageFile] = useState(null);
    const [authenticationTried, setAuthenticationTried] = useState(false);
    let shopId = location.state?.shopId;
    if(!shopId)
        shopId = localStorage.getItem("selectedShopId");

    const checkTokenValidation = async () => {
        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/validateToken`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok || !(localStorage.getItem("role") === "owner")) {
                if(localStorage.getItem("role") === "user")
                    navigate("/userhome");
                else if(localStorage.getItem("role") === "moderator")
                    navigate("/moderatorhome");
                else if(localStorage.getItem("role")=== "admin")
                    navigate("/adminhome");
                else
                    navigate("/");
            }

        } catch (error) {
            console.log(error);
            navigate("/");
        }
    };

    useEffect(() => {

        if(!authenticationTried) {
            setAuthenticationTried(true);
            checkTokenValidation();
        }

        const fetchShopDetails = async () => {
            if (!shopId) {
                console.log('No shop ID found in state');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/shops/${shopId}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch shop details');
                }

                const data = await response.json();
                setShopDetails({
                    shopName: data.shopName,
                    description: data.description,
                    imagePath: data.imagePath || ''
                });
            } catch (error) {
                console.error('Error fetching shop details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchShopDetails();
    }, [shopId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShopDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('shopName', shopDetails.shopName);
        formData.append('description', shopDetails.description);
        formData.append('id', shopId);
        console.log(formData);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/editShop`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: formData
            });

            if (response.ok) {
                alert('Shop details updated successfully');
                navigate(`/shop`, { state: { shopId: shopId } });
            } else {
                throw new Error('Failed to update shop details');
            }
        } catch (error) {
            console.error('Error updating shop details:', error);
            alert('Failed to update shop details');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="edit-shop-page">
            <div className="edit-shop-container">
                    <div className="edit-shop-card">
                        <div className="logo1">
                            <img
                                src={logo1}
                                onClick={() => navigate('/ownerhome')}
                                style={{ cursor: 'pointer' }}
                                alt="Logo"
                            />
                        </div>

                        <h2>Uredi trgovinu</h2>
                        <form onSubmit={handleSubmit} className="edit-shop-form">
                            <div className="form-group">
                                <label>Ime trgovine:</label>
                                <input
                                    type="text"
                                    name="shopName"
                                    value={shopDetails.shopName}
                                    onChange={handleInputChange}
                                    placeholder={shopDetails.shopName} // Show current shop name as placeholder
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Opis:</label>
                                <textarea
                                    name="description"
                                    value={shopDetails.description}
                                    onChange={handleInputChange}
                                    placeholder={shopDetails.description} // Show current description as placeholder
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Slika:</label>
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                                {shopDetails.imagePath && (
                                    <img
                                        src={shopDetails.imagePath}
                                        alt="Current shop image"
                                        className="current-image"
                                    />
                                )}
                            </div>
                            <div className="form-group">
                                <button type="submit">Spremi promjene</button>
                            </div>
                        </form>
                    </div>
            </div>
        </div>
    );
};

export default EditShop;
