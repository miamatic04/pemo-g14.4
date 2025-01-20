import React, { useState, useEffect } from 'react';
import './stilovi/AssignDisciplinaryMeasure.css';

const AssignDisciplinaryMeasure = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [measureType, setMeasureType] = useState('warning');
    const [disciplinaryMeasure, setDisciplinaryMeasure] = useState('');
    const [note, setNote] = useState('');
    const [showResults, setShowResults] = useState(false);

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
            <h2>Dodijeli disciplinsku mjeru</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="Search for a user"
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
                    <>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="warning"
                                    checked={measureType === 'warning'}
                                    onChange={() => setMeasureType('warning')}
                                />
                                Warning
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="disciplinary"
                                    checked={measureType === 'disciplinary'}
                                    onChange={() => setMeasureType('disciplinary')}
                                />
                                Disciplinary Measure
                            </label>
                        </div>
                        {measureType === 'disciplinary' && (
                            <select
                                value={disciplinaryMeasure}
                                onChange={(e) => setDisciplinaryMeasure(e.target.value)}
                            >
                                <option value="">Select a measure</option>
                                <option value="THREE_DAY_BAN">Three Day Ban</option>
                                <option value="ONE_WEEK_BAN">One Week Ban</option>
                                <option value="ONE_MONTH_BAN">One Month Ban</option>
                                <option value="LIFETIME_BAN">Lifetime Ban</option>
                            </select>
                        )}
                        <textarea
                            placeholder="Add a note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                        <button type="submit">Submit</button>
                    </>
                )}
            </form>
        </div>
    );
};

export default AssignDisciplinaryMeasure;
