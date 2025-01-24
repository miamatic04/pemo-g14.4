import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./stilovi/EditProduct.css";

const EditProduct = () => {
    const [platformProducts, setPlatformProducts] = useState([]);
    const [selectedPlatformProduct, setSelectedPlatformProduct] = useState("");
    const [selectedProductImage, setSelectedProductImage] = useState("");
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [authenticationTried, setAuthenticationTried] = useState(false);

    let productId = location.state?.productId;
    if(!productId)
        productId = localStorage.getItem("selectedProductId");

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

        const fetchProductDetails = async () => {
            try {
                const response = await fetch(
                    `http://${process.env.REACT_APP_WEB_URL}:8080/getProduct/${productId}`,
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
                    console.log(data);
                    setSelectedPlatformProduct(data.platformProduct);
                    setSelectedProductImage(data.imagePath || "");
                    setSelectedProductId(data.productId || null);
                    setDescription(data.description);
                    setPrice(data.price);
                    setQuantity(data.quantity);
                } else {
                    console.error("Failed to fetch product details");
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };

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

        if (productId) {
            fetchProductDetails();
        }
        fetchPlatformProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedPlatformProduct || !description || !price || !quantity) {
            alert("Molimo ispunite sva polja.");
            return;
        }

        const productData = {
            id: productId,
            platformProduct: selectedPlatformProduct,
            description,
            price,
            quantity,
        };

        try {
            const response = await fetch(
                `http://${process.env.REACT_APP_WEB_URL}:8080/editProduct`,
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
                alert("Proizvod je uspješno uređen.");
                navigate(-1); // Navigate back to the previous page
            } else {
                alert("Uređivanje proizvoda nije uspjelo.");
            }
        } catch (error) {
            console.error("Greška:", error);
            alert("Uređivanje proizvoda nije uspjelo.");
        }
    };

    return (
        <div className="pozadina2">
            <div className="product-editor">
                <h1 className="urediProizvod">Uredi proizvod</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="platformProduct">Platformski proizvod:</label>
                        <p id="platformProduct" className="product-name">
                            {selectedPlatformProduct}
                        </p>
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
                            placeholder={description}
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
                            placeholder={price}
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
                            placeholder={quantity}
                            min="1"
                        />
                    </div>

                    <button type="submit" className="submit-button">
                        Spremi promjene
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

export default EditProduct;
