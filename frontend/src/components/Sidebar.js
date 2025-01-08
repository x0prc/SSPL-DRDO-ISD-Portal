import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; 

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Internship Panel</h2>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/results">Results</Link></li>
                <li><Link to="/update">Update</Link></li>
                <li><Link to="/generate-certificate">Generate Certificate</Link></li> {/* New link added */}
                <li><Link to="/logout">Logout</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
