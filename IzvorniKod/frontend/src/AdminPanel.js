import React, { useState } from 'react';
import ModeratorActivity from './ModeratorActivity';
import UserActivity from './UserActivity';
import AssignDisciplinaryMeasure from './AssignDisciplinaryMeasure';
import AssignRole from './AssignRole';
import './stilovi/AdminPanel.css';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('moderatorActivity');

    return (
        <div className="admin-panel">
            <nav>
                <button onClick={() => setActiveTab('moderatorActivity')}>Aktivnost moderatora</button>
                <button onClick={() => setActiveTab('userActivity')}>Aktivnost korisnika</button>
                <button onClick={() => setActiveTab('assignMeasure')}>Dodijeli disciplinsku mjeru</button>
                <button onClick={() => setActiveTab('assignRole')}>Dodijeli ulogu</button>
            </nav>
            <div className="content">
                {activeTab === 'moderatorActivity' && <ModeratorActivity />}
                {activeTab === 'userActivity' && <UserActivity />}
                {activeTab === 'assignMeasure' && <AssignDisciplinaryMeasure />}
                {activeTab === 'assignRole' && <AssignRole />}
            </div>
        </div>
    );
};

export default AdminPanel;