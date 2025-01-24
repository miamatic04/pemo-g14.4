import React, { useState } from 'react';

function AddPlatformProduct() {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [ageRestriction, setAgeRestriction] = useState(0); // Default to 0 for no restriction
    const [file, setFile] = useState(null);

    // Predefined categories
    const categories = ['Igre', 'Filmovi', 'Glazba', 'Knjige', 'Elektronika', 'Hrana', 'Piće'];

    // Handle file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            name: name,
            category: category,
            ageRestriction: ageRestriction,
            file: file
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('file', file);
        formData.append('category', category);
        formData.append('ageRestriction', ageRestriction);

        console.log(data);

        // Send data to backend via POST request
        try {
            const response = await fetch(
                `http://${process.env.REACT_APP_WEB_URL}:8080/addProductToPlatform`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },

                }
            );

            if (response.ok) {
                // Handle successful submission (you can show a success message, reset the form, etc.)
                alert('Product added successfully');
            } else {
                alert('Error adding product');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form');
        }
    };

    return (
        <div className="pozadina2">
            <div className="product-creator">
                <h1>Dodaj proizvod na platformu</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Naziv:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="category">Kategorija:</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Odaberite kategoriju</option>
                            {categories.map((cat, index) => (
                                <option key={index} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="ageRestriction">Age Restriction:</label>
                        <input
                            type="number"
                            id="ageRestriction"
                            value={ageRestriction}
                            onChange={(e) => setAgeRestriction(Number(e.target.value))}
                            min="0"
                        />
                        <small>(0 means no restriction)</small>
                    </div>

                    <div>
                        <label htmlFor="pImage">Slika:</label>
                        <input
                            type="file"
                            id="pImage"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                        />
                    </div>

                    <button type="submit">Dodaj</button>
                </form>
            </div>
        </div>
    );
}

export default AddPlatformProduct;
