import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './stilovi/addProduct.css';

const AddProduct = () => {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productImage, setProductImage] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const shopId = location.state?.shopId;

    const handleFileChange = (e) => {
        setProductImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!productName || !productDescription || !productCategory || !productPrice || !productImage) {
            alert('Molimo ispunite sva polja i dodajte sliku proizvoda.');
            return;
        }

        const formData = new FormData();
        formData.append('name', productName);
        formData.append('description', productDescription);
        formData.append('category', productCategory);
        formData.append('price', productPrice);
        formData.append('image', productImage);
        formData.append('shopId', shopId);

        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/addProduct`, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                alert('Proizvod je uspješno dodan.');
                navigate(-1); 
            } else {
                alert('Dodavanje proizvoda nije uspjelo.');
            }
        } catch (error) {
            console.error('Greška:', error);
            alert('Dodavanje proizvoda nije uspjelo.');
        }
    };

    return (
        <div className="pozadina2">
            <div className="product-creator">
                <h1 className="dodajProizvod">Dodaj novi proizvod</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="productName">Naziv proizvoda:</label>
                        <input
                            className="unosZaProizvod"
                            id="productName"
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            required
                            placeholder="Unesite naziv proizvoda"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="productDescription">Opis proizvoda:</label>
                        <textarea
                            id="productDescription"
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            required
                            placeholder="Opišite proizvod"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="productCategory">Kategorija proizvoda:</label>
                        <input
                            className="unosZaProizvod"
                            id="productCategory"
                            type="text"
                            value={productCategory}
                            onChange={(e) => setProductCategory(e.target.value)}
                            required
                            placeholder="Unesite kategoriju proizvoda"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="productPrice">Cijena proizvoda (€):</label>
                        <input
                            className="unosZaProizvod"
                            id="productPrice"
                            type="number"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                            required
                            placeholder="Unesite cijenu proizvoda"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="productImage">Dodajte sliku proizvoda:</label>
                        <input
                            id="productImage"
                            type="file"
                            onChange={handleFileChange}
                            required
                            accept="image/*"
                        />
                    </div>

                    <button type="submit" className="submit-button">
                        Dodaj proizvod
                    </button>
                </form>

                <button className="back-button" onClick={() => navigate(-1)}>
                    Natrag
                </button>
            </div>
        </div>
    );
};

export default AddProduct;
