import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './stilovi/AssignDisciplinaryMeasure.css';
import logo1 from "./Components/Assets/logo1.png";  

const AssignRole = () => {
    const [users, setUsers] = useState([]); // State for users list
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [selectedUser, setSelectedUser] = useState(''); // State for selected user
    const [selectedRole, setSelectedRole] = useState(''); // State for selected role
    const [note, setNote] = useState(''); // State for the note input
    const [showResults, setShowResults] = useState(false); // State for showing search results
    const navigate = useNavigate();

    // Fetch users from the backend on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/getUsers`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data.map(user => ({ name: user.name, email: user.email })));
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

        if (!selectedUser || !selectedRole) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            const payload = {
                email: selectedUser.email,
                role: selectedRole,
                note: note, // Include the note in the payload
            };

            const response = await fetch(`http://${process.env.REACT_APP_WEB_URL}:8080/assignRole`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert('Role assigned successfully');
                setSearchTerm('');
                setSelectedUser('');
                setSelectedRole('');
                setNote('');
                setShowResults(false);
            } else {
                alert('Failed to assign role');
            }
        } catch (error) {
            console.error('Error assigning role:', error);
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
                <h1 className="header-title">Dodijeli ulogu</h1>
            </div>
            <form onSubmit={handleSubmit}>
                {/* Search User */}
                <div>
                    <input
                        type="text"
                        className="input1"
                        placeholder="Pretraži korisnika"
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

                {/* Role Selection */}
                {selectedUser && (
                    <div className="forma-za-biranje">
                        <div>
                            <label className="label11">
                                <input
                                    type="radio"
                                    value="admin"
                                    checked={selectedRole === 'admin'}
                                    onChange={() => setSelectedRole('admin')}
                                />
                                Admin
                            </label>
                            <label className="label11">
                                <input
                                    type="radio"
                                    value="moderator"
                                    checked={selectedRole === 'moderator'}
                                    onChange={() => setSelectedRole('moderator')}
                                />
                                Moderator
                            </label>
                            <label className="label11">
                                <input
                                    type="radio"
                                    value="owner"
                                    checked={selectedRole === 'owner'}
                                    onChange={() => setSelectedRole('owner')}
                                />
                                Vlasnik trgovine
                            </label>
                            <label className="label11">
                                <input
                                    type="radio"
                                    value="user"
                                    checked={selectedRole === 'user'}
                                    onChange={() => setSelectedRole('user')}
                                />
                                Korisnik
                            </label>
                        </div>

                        {/* Note Textarea */}
                        <div>
                            <textarea
                                placeholder="Napomena (opcionalno)"
                                value={note}
                                className="textarea11"
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="submit11">Dodijeli ulogu</button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default AssignRole;
