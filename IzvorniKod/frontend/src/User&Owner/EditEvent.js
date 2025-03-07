import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../stilovi/editEvent.css';
import logo1 from '../Components/Assets/logo1.png';

const EditEvent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [eventDetails, setEventDetails] = useState({
        name: '',
        description: '',
        address: '',
        dateTime: '',
        imagePath: '',
        frequency: ''
    });
    const [loading, setLoading] = useState(true);
    const [customFrequencyValue, setCustomFrequencyValue] = useState('');
    const [authenticationTried, setAuthenticationTried] = useState(false);
    const eventId = location.state?.eventId;

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

        const fetchEventDetails = async () => {
            if (!eventId) {
                console.log('No event ID found in state');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getEvent/${eventId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch event details');
                }

                const data = await response.json();
                setEventDetails({
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    address: data.address,
                    dateTime: data.dateTime || '',
                    imagePath: data.imagePath || '',
                });
            } catch (error) {
                console.error('Error fetching event details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [eventId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    /*const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };*/

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("id", eventId);
        formData.append('name', eventDetails.name);
        formData.append('description', eventDetails.description);
        formData.append('address', eventDetails.address);
        formData.append('dateTime', eventDetails.dateTime);
        console.log(eventDetails);
        console.log(formData);

        try {
            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/editEvent`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(eventDetails),
            });

            if (response.ok) {
                alert('Detalji događaja uspješno ažurirani');
                navigate(`/myEvents`, { state: { eventId: eventId } });
            } else {
                throw new Error('Failed to update event details');
            }
        } catch (error) {
            console.error('Error updating event details:', error);
            alert('Neuspješno ažuriranje događaja');
        }
    };

    if (loading) {
        return <div>Učitavanje...</div>;
    }

    return (
        <div className="edit-event-page">
            <div className="edit-event-container">
                <div className="edit-event-card">
                    <div className="logo12">
                        <img
                            src={logo1}
                            onClick={() => navigate('/ownerhome')}
                            style={{cursor: 'pointer'}}
                            alt="Logo"
                        />
                    </div>

                    <h2>Uredi događaj</h2>
                    <form onSubmit={handleSubmit} className="edit-event-form">
                        <div className="form-group">
                            <label>Ime događaja:</label>
                            <input
                                type="text"
                                name="name"
                                value={eventDetails.name}
                                onChange={handleInputChange}
                                placeholder={eventDetails.name} // Prikazuje trenutni naziv kao placeholder
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Opis događaja:</label>
                            <textarea
                                name="description"
                                value={eventDetails.description}
                                onChange={handleInputChange}
                                placeholder={eventDetails.description} // Prikazuje trenutni opis kao placeholder
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Adresa:</label>
                            <input
                                type="text"
                                name="address"
                                value={eventDetails.address}
                                onChange={handleInputChange}
                                placeholder={eventDetails.address} // Prikazuje trenutnu adresu kao placeholder
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Datum i vrijeme:</label>
                            <input
                                type="datetime-local"
                                name="dateTime"
                                value={eventDetails.dateTime}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Frekvencija ponavljanja:</label>
                                <select
                                    name="frequency"
                                    value={eventDetails.frequency || ''}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="" disabled>
                                        Odaberite frekvenciju
                                    </option>
                                    <option value="">Nikad</option>
                                    <option value="daily">Dnevno</option>
                                    <option value="weekly">Tjedno</option>
                                    <option value="biweekly">Svaka 2 tjedna</option>
                                    <option value="monthly">Mjesečno</option>
                                    <option value="bimonthly">Svaka 2 mjeseca</option>
                                    <option value="quarterly">Svaka 3 mjeseca</option>
                                </select>
                                {(eventDetails.frequency === 'customWeeks' || eventDetails.frequency === 'customMonths') && (
                                    <input
                                        type="number"
                                        min="1"
                                        className="unosZaDogadjaj"
                                        placeholder="Unesite broj"
                                        value={customFrequencyValue}
                                        onChange={(e) => setCustomFrequencyValue(e.target.value)}
                                        required
                                    />
                                )}
                            </div>
                        <div className="form-group">
                            <button type="submit">Spremi promjene</button>
                        </div>
                    </form>
                    <a onClick={() => navigate(-1)} className="back-button22">
                        ← Natrag
                    </a>
                </div>
            </div>
        </div>
    );
};

export default EditEvent;
