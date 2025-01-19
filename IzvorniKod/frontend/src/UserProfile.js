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
    const userRole = localStorage.getItem('role');
    const districts = ['Kvart 1', 'Kvart 2', 'Kvart 3']; // Lista kvartova
    const navigate = useNavigate();

    useEffect(() => {
        // Učitavanje podataka iz localStorage prilikom učitavanja komponente
        const storedData = localStorage.getItem('userProfile');
        if (storedData) {
            setFormData(JSON.parse(storedData));
        }
    }, []);

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

    const handleAskOwner = () => {

        setBackendResult({ message: "Uspješno je zatražen vlasnički račun" });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Spriječava ponovno učitavanje stranice

        // Spremanje podataka u localStorage
        localStorage.setItem('userProfile', JSON.stringify(formData));

        console.log("Podaci su spremljeni:", formData);
        setBackendResult({ message: "Podaci su uspješno spremljeni!" }); // Postavljanje poruke o uspjehu
    };

    return (
        <div className="user-profile-page">
            <div className="user-profile-container">
                <div className="logo1">
                    <img src={logo1} onClick={() => navigate(userRole === 'owner' ? '/ownerhome' : '/userhome')} style={{ cursor: 'pointer' }} />
                </div>
                <form className="profile-form" onSubmit={handleSubmit}>
                    <h1 className="myProfile">MOJ PROFIL</h1>
                    <div className="header-section">
                        <img src={avatarImage} alt="Avatar" className="avatar"/>
                        <div className="profile-info">
                            <b><p className="imeUsera">{formData.firstName} {formData.lastName}</p></b>
                            <p className="mailUsera">{formData.email}</p>
                        </div>
                        <div className="izbrisiZatrazi">
                        <button type="button" className="delete-button" onClick={handleDeleteProfile}>
                            Izbriši profil
                        </button>
                        <button type="button" className="askOwnerButton" onClick={handleAskOwner}>
                            Zatraži vlasnički račun
                        </button>
                        </div>
                    </div>

                    {/* Polja za unos */}
                    <div className="form-columns">
                        {/* Lijevi stupac */}
                        <div className="left-column">
                            <div className="input-box-profile">
                                <label className="nameOfUser">Ime:</label>
                                <input
                                    type="text"
                                    id="firstNameProfile"
                                    name="firstName"
                                    placeholder="ime"
                                    onChange={handleChange}
                                    value={formData.firstName}
                                    required
                                />
                            </div>

                            <div className="input-box-profile">
                                <label className="lastNameOfUser">Prezime:</label>
                                <input
                                    type="text"
                                    id="lastNameProfile"
                                    name="lastName"
                                    placeholder="prezime"
                                    onChange={handleChange}
                                    value={formData.lastName}
                                    required
                                />
                            </div>

                            <div className="input-box-profile">
                                <label className="mailUser">Mail:</label>
                                <input
                                    type="email"
                                    id="emailProfile"
                                    name="email"
                                    placeholder="email"
                                    onChange={handleChange}
                                    value={formData.email}
                                    required
                                />
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
                                <label className="usernameUser">Korisničko ime:</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="korisničko ime"
                                    onChange={handleChange}
                                    value={formData.username}
                                    required
                                />
                            </div>

                            <div className="input-box-profile">
                                <label className="districtUser">Kvart:</label>
                                <input
                                    type="text"
                                    id="kvart"
                                    name="district"
                                    placeholder="odaberi kvart"
                                    value={formData.district}
                                    readOnly // onemogućava direktno tipkanje
                                />
                                <FaCaretDown className='iconDown' onClick={toggleDistricts} /> {/* ikona za otvaranje izbornika */}
                            </div>

                            {districtsVisible && (
                                <div className="dropdown">
                                    {districts.map((district) => (
                                        <div key={district} className="dropdown-item" onClick={() => handleDistrictSelect(district)}>
                                            {district}
                                        </div>
                                    ))}
                                </div>
                            )}
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