import React, { useState, useEffect } from 'react';
import './stilovi/AssignDisciplinaryMeasure.css';
import { useNavigate } from 'react-router-dom';
import logo1 from "./Components/Assets/logo1.png";

const AssignDisciplinaryMeasure = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [measureType, setMeasureType] = useState('warning');
    const [disciplinaryMeasure, setDisciplinaryMeasure] = useState('');
    const [note, setNote] = useState('');
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();

    // Fetch users from the server
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getUsers`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }});
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data.map(user => ({ name: user.name, email: user.email })));
                    console.log(users);
                } else {
                    console.error('Failed to fetch users');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUserSelection = (user) => {
        setSelectedUser(user);
        setSearchTerm(user.name); // Populate the search field with the user's name
        setShowResults(false); // Hide the results list
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setSelectedUser(''); // Clear the selected user if search changes
        setShowResults(!!value); // Show results only if there's input
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedUser || !note) {
            alert('Please fill in all required fields.');
            return;
        }

        try {

            let response;

            if (measureType === 'warning') {
                // Create the warning DTO
                const warningDTO = {
                    warnedUserEmail: selectedUser.email,
                    note,
                };

                response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/sendWarning`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(warningDTO),
                });

                if (response.ok) {
                    console.log('Warning sent successfully!');
                } else {
                    console.error('Failed to send warning:', response.statusText);
                    alert('Failed to send warning. Please try again.');
                }
            } else if (measureType === 'disciplinary') {
                // Ensure disciplinary measure is selected
                if (!disciplinaryMeasure) {
                    alert('Please select a disciplinary measure.');
                    return;
                }

                // Create the disciplinary measure DTO
                const dcMeasureDTO = {
                    disciplinedUserEmail: selectedUser.email,
                    note,
                    type: disciplinaryMeasure,
                };

                response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/sendDcMeasure`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(dcMeasureDTO),
                });

                if (response.ok) {
                    console.log('Disciplinary measure sent successfully!');
                } else {
                    console.error('Failed to send disciplinary measure:', response.statusText);
                    alert('Failed to send disciplinary measure. Please try again.');
                }
            }

            if (response.ok) {
                setSearchTerm('');
                setSelectedUser('');
                setMeasureType('warning');
                setDisciplinaryMeasure('');
                setNote('');
                setShowResults(false);
            }
        } catch (error) {
            console.error('Error during submission:', error);
            alert('An error occurred. Please try again.');
        }
    };


    return (
        <div className="assign-measure">
            <div className="background"></div>
            <div className="header-shopsList">
                <div className="logo-container">
                    <img
                        src={logo1}
                        alt="Logo"
                        className="logo"
                        onClick={() => navigate('/adminhome')}
                        style={{cursor: 'pointer'}}
                    />
                </div>
                <h1 className="header-title">Dodijeli disciplinsku mjeru</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="Pretraži korisnika"
                        className="input1"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={() => setShowResults(!!searchTerm)} // Show results on focus
                    />
                    {showResults && filteredUsers.length > 0 && (
                        <ul className="user-list">
                            {filteredUsers.map((user, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleUserSelection(user)}
                                    className="user-list-item"
                                >
                                    {user.name} ({user.email})
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {selectedUser && (
                    <div className="forma-za-biranje">
                        <div>
                            <label className="label11">
                                <input
                                    type="radio"
                                    value="warning"
                                    checked={measureType === 'warning'}
                                    onChange={() => setMeasureType('warning')}
                                />
                                Upozorenje
                            </label>
                            <label className="label11">
                                <input
                                    type="radio"
                                    value="disciplinary"
                                    checked={measureType === 'disciplinary'}
                                    onChange={() => setMeasureType('disciplinary')}
                                />
                                Disciplinska mjera
                            </label>
                        </div>
                        {measureType === 'disciplinary' && (
                            <select
                                value={disciplinaryMeasure}
                                onChange={(e) => setDisciplinaryMeasure(e.target.value)}
                                className="select11"
                            >
                                <option value="">Izaberi disciplinsku mjeru</option>
                                <option value="THREE_DAY_BAN">3 dana zabrane pristupa</option>
                                <option value="ONE_WEEK_BAN">1 tjedan zabrane pristupa</option>
                                <option value="ONE_MONTH_BAN">1 mjesec zabrane pristupa</option>
                                <option value="LIFETIME_BAN">Doživotna zabrana pristupa</option>
                            </select>
                        )}
                        <textarea
                            placeholder="Napiši upozorenje"
                            className="textarea11"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                        <button type="submit" className="submit11">Predaj</button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default AssignDisciplinaryMeasure;
