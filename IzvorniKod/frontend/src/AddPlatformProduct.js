import React, { useState } from 'react';
import logo1 from './Components/Assets/logo1.png';
import { useNavigate } from 'react-router-dom';

const PlatformProductForm = () => {
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        file: null,
        ageRestriction: 0,
    });

    const categories = ['Electronics', 'Books', 'Fashion', 'Toys', 'Home Appliances'];

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.category || !formData.file) {
            alert('Please fill in all required fields.');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('file', formData.file);
        formDataToSend.append('ageRestriction', formData.ageRestriction);

        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/uploadProduct`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formDataToSend,
            });

            if (response.ok) {
                alert('Product uploaded successfully!');
                setFormData({
                    name: '',
                    category: '',
                    file: null,
                    ageRestriction: 0,
                });
            } else {
                alert('Failed to upload product. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading product:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="product-form">
            <div className="background"></div>
            <div className="header-shopsList">
                <div className="logo-container">
                    <img
                        src={logo1}
                        alt="Logo"
                        className="logo"
                        onClick={() => navigate('/adminhome')}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <h1 className="header-title">Add New Product</h1>
            </div>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label htmlFor="name">Product Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        className="input-field"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="input-field"
                    >
                        <option value="">Select a category</option>
                        <option value="Voce i povrce">Voce i povrce</option>
                        <option value="Elektronika">Elektronika</option>
                        <option value="Domacinstvo">Domacinstvo</option>
                        <option value="Moda i odjeca">Moda i odjeca</option>
                        <option value="Kozmetika i osobna njega">Kozmetika i osobna njega</option>
                        <option value="Hrana i pice">Hrana i pice</option>
                        <option value="Igracke i djecji proizvodi">Igracke i djecji proizvodi</option>
                        <option value="Knjige i casopisi">Knjige i casopisi</option>
                        <option value="Sport i rekreacija">Sport i rekreacija</option>
                        <option value="Kucni ljubimci i oprema za kucne ljubimce">Kucni ljubimci i oprema za kucne ljubimce</option>
                        <option value="Namjestaj">Namjestaj</option>
                        <option value="Alati i oprema">Alati i oprema</option>
                        <option value="Automobili i motocikli">Automobili i motocikli</option>
                        <option value="Glazbeni instrumenti">Glazbeni instrumenti</option>
                        <option value="Zdravlje i wellness">Zdravlje i wellness</option>
                        <option value="Racunala i dodatna oprema">Racunala i dodatna oprema</option>
                        <option value="Umjetnost i rukotvorine">Umjetnost i rukotvorine</option>
                        <option value="Putovanja i kampiranje">Putovanja i kampiranje</option>
                        <option value="Cvijece i vrt">Cvijece i vrt</option>
                        <option value="Gradevinski materijali">Gradevinski materijali</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="file">Product Image:</label>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        accept="image/*"
                        onChange={handleChange}
                        className="input-file"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="ageRestriction">Age Restriction:</label>
                    <input
                        type="number"
                        id="ageRestriction"
                        name="ageRestriction"
                        value={formData.ageRestriction}
                        onChange={handleChange}
                        placeholder="Enter age restriction (0 if none)"
                        className="input-field"
                    />
                </div>

                <button type="submit" className="submit-btn">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default PlatformProductForm;