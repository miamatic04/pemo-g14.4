import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/UserProfile.css';
import logo1 from './Components/Assets/logo1.png';
import avatarImage from './Components/Assets/avatar.png'; // Putanja do slike avatara
import { FaCaretDown } from 'react-icons/fa'; /* ikona za kvart */

const UserProfile = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        username: '',
        district: '',
        role: 'user'
    });

    const [backendResult, setBackendResult] = useState(null);
    const [districtsVisible, setDistrictsVisible] = useState(false); // stanje za prikazivanje kvartova
    const [userInfo, setUserInfo] = useState({ firstName: " ", lastName: " ", email: " " });
    const userRole = localStorage.getItem('role');
    const districts = [
        "Gornji Grad",
        "Donji Grad",
        "Kaptol",
        "Medvescak",
        "Tresnjevka Sjever",
        "Tresnjevka Jug",
        "Jarun",
        "Precko",
        "Vrbani",
        "Stenjevec",
        "Spansko",
        "Malesnica",
        "Maksimir",
        "Donja Dubrava",
        "Gornja Dubrava",
        "Ravnice",
        "Pescica",
        "Borongaj",
        "Zitnjak",
        "Trnje",
        "Pantovcak",
        "Sestine",
        "Mlinovi",
        "Gracani",
        "Remete",
        "Podsljeme",
        "Novi Zagreb Zapad",
        "Novi Zagreb Istok",
        "Laniste",
        "Remetinec",
        "Savski Gaj",
        "Trokut",
        "Sopot",
        "Dugave",
        "Slobostina",
        "Zaprude",
        "Travno",
        "Utrine",
        "Buzin",
        "Crnomerec",
        "Knezija",
        "Voltino",
        "Kustosija",
        "Rudes",
        "Savica",
        "Siget",
        "Kajzerica",
        "Gajnice"
    ]; // Lista kvartova
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Ukloni poruku o uspjehu prilikom promjene unosa
        setBackendResult(null);
    };

    const toggleDistricts = () => {
        setDistrictsVisible(!districtsVisible);
    };

    const handleDistrictSelect = (district) => {
        setFormData({ ...formData, district });
        setDistrictsVisible(false); // zatvori izbornik nakon odabira
    };

    const handleRequestPromotion = async () => {
        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/requestPromotion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Promotion request submitted successfully');
                setBackendResult({ message: "Uspješno je zatražen vlasnički račun!" });
            } else {
                if(data.code === "already")
                    alert("Request already submitted");
            }
        } catch (error) {
            console.error('Error:', error);
            setBackendResult({ message: "Došlo je do greške pri slanju zahtjeva." });
        }
    };

    const handleDeleteProfile = () => {
        // Ukloni podatke iz localStorage
        localStorage.removeItem('userProfile');

        // Resetiraj stanje forme
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            dateOfBirth: '',
            username: '',
            district: '',
            role: 'user'
        });

        setBackendResult({ message: "Profil je uspješno izbrisan!" });
    };

    const fetchUserInfo = async () => {
        try {
            let token = localStorage.getItem("token");
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getUserInfo`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setUserInfo(data);
            } else {
                console.error('Failed');
            }
        } catch (error) {
            console.error('Error ', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Spriječava ponovno učitavanje stranice

        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/editProfile`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                console.log("oh oh something went wrong :(");
            }

        } catch (error) {
            console.log("oh oh something went wrong :(");
        }

        setBackendResult({ message: "Podaci su uspješno spremljeni!" }); // Postavljanje poruke o uspjehu
    };

    useEffect(() => {
        // Učitavanje podataka iz localStorage prilikom učitavanja komponente
        const storedData = localStorage.getItem('userProfile');
        if (storedData) {
            setFormData(JSON.parse(storedData));
        }
        fetchUserInfo();
    }, []);

    return (
        <div className="user-profile-page">
            <div className="user-profile-container">
                <div className="logo1">
                    <img src={logo1} onClick={() => navigate(userRole === 'owner' ? '/ownerhome' : '/userhome')} style={{ cursor: 'pointer' }} />
                </div>
                <form className="profile-form" onSubmit={handleSubmit}>
                    <h1 className="myProfile">MOJ PROFIL</h1>
                    <div className="header-section">
                        <img src={avatarImage} alt="Avatar" className="avatar" />
                        <div className="profile-info">
                            <b><p className="imeUsera">{userInfo.firstName} {userInfo.lastName}</p></b>
                            <p className="mailUsera">{userInfo.email}</p>
                        </div>
                        <div className="izbrisiZatrazi">
                            {userRole === 'user' && (
                                <button className="askOwnerButton" onClick={handleRequestPromotion}>
                                    Zatraži vlasnički račun
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Polja za unos */}
                    <div className="form-columns">
                        {/* Lijevi stupac */}
                        <div className="left-column">
                            <div className="input-box-profile">
                                <label className="nameOfUser">Ime:</label>
                                <div id="firstNameProfile" className="user-info-display">
                                    {userInfo.firstName}
                                </div>
                            </div>

                            <div className="input-box-profile">
                                <label className="lastNameOfUser">Prezime:</label>
                                <div id="lastNameProfile" className="user-info-display">
                                    {userInfo.lastName}
                                </div>
                            </div>

                            <div className="input-box-profile">
                                <label className="mailUser">Mail:</label>
                                <div id="emailProfile" className="user-info-display">
                                    {userInfo.email}
                                </div>
                            </div>
                        </div>

                        {/* Desni stupac */}
                        <div className="right-column">
                            <div className="input-box-profile">
                                <label className="DateUser">Datum rođenja:</label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    onChange={handleChange}
                                    value={formData.dateOfBirth}
                                />
                            </div>

                            <div className="input-box-profile">
                                <label className="districtUser">Kvart:</label>
                                <select
                                    id="hood"
                                    name="hood"
                                    value={formData.hood}
                                    onChange={handleChange}
                                >
                                    <option value="">Odaberi kvart</option>
                                    {districts.map((hood) => (
                                        <option key={hood} value={hood}>
                                            {hood}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <input type="submit" id="submitProfile" value="Spremi promjene" />

                    {backendResult && (
                        <div>
                            <h2>{backendResult.message}</h2>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
