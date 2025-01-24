import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../stilovi/addProduct.css";

const AddProduct = () => {
    const [platformProducts, setPlatformProducts] = useState([]);
    const [selectedPlatformProduct, setSelectedPlatformProduct] = useState("");
    const [selectedProductImage, setSelectedProductImage] = useState("");
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const navigate = useNavigate();
    const [authenticationTried, setAuthenticationTried] = useState(false);

    // Retrieve shopId from local storage
    const shopId = localStorage.getItem("shopId");

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

    // Fetch platform products
    useEffect(() => {

        if(!authenticationTried) {
            setAuthenticationTried(true);
            checkTokenValidation();
        }
        const fetchPlatformProducts = async () => {
            try {
                const response = await fetch(
                    `http://${process.env.REACT_APP_WEB_URL}:8080/getPlatformProducts`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setPlatformProducts(data);
                } else {
                    console.error("Failed to fetch platform products");
                }
            } catch (error) {
                console.error("Error fetching platform products:", error);
            }
        };

        fetchPlatformProducts();
    }, []);

    const handleProductChange = (e) => {
        const selectedProductName = e.target.value;
        setSelectedPlatformProduct(selectedProductName);

        const selectedProduct = platformProducts.find(
            (product) => product.name === selectedProductName
        );
        setSelectedProductImage(selectedProduct?.imagePath || "");
        setSelectedProductId(selectedProduct?.id || null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedPlatformProduct || !description || !price || !quantity || !shopId) {
            alert("Molimo ispunite sva polja.");
            return;
        }

        const productData = {
            productId: selectedProductId,
            platformProduct: selectedPlatformProduct,
            description,
            price,
            quantity,
            shopId, // Include shopId from local storage
        };

        try {
            const response = await fetch(
                `http://${process.env.REACT_APP_WEB_URL}:8080/addProduct`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(productData),
                }
            );

            if (response.ok) {
                alert("Proizvod je uspješno dodan.");
                navigate(-1); // Navigate back to the previous page
            } else {
                alert("Dodavanje proizvoda nije uspjelo.");
            }
        } catch (error) {
            console.error("Greška:", error);
            alert("Dodavanje proizvoda nije uspjelo.");
        }
    };

    return (
        <div className="pozadina2">
            <div className="product-creator">
                <h1 className="dodajProizvod">Dodaj novi proizvod</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="platformProduct">Platformski Proizvod:</label>
                        <select
                            id="platformProduct"
                            className="unosZaProizvod"
                            value={selectedPlatformProduct}
                            onChange={handleProductChange}
                            required
                        >
                            <option value="">Odaberite platformski proizvod</option>
                            {platformProducts.map((product) => (
                                <option key={product.id} value={product.name}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedProductImage && (
                        <div className="form-group">
                            <img
                                src={selectedProductImage}
                                alt="Platform Product"
                                className="product-image"
                                style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="description">Opis proizvoda:</label>
                        <textarea
                            id="description"
                            className="unosZaProizvod"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder="Opišite proizvod"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Cijena proizvoda (€):</label>
                        <input
                            id="price"
                            className="unosZaProizvod"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            placeholder="Unesite cijenu proizvoda"
                            step="0.01"
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantity">Količina:</label>
                        <input
                            id="quantity"
                            className="unosZaProizvod"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                            placeholder="Unesite količinu proizvoda"
                            min="1"
                        />
                    </div>

                    <button type="submit" className="submit-button">
                        Dodaj proizvod
                    </button>
                    <button
                        type="button"
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        Natrag
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
