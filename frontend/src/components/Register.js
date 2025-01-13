import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/users/register', { username, password });
            alert("Registration successful! You can now log in.");
        } catch (error) {
            alert("Registration failed: " + error.response.data);
        }
    };

    return (
        <div className="form-container">
            <h2>Create Admin Account</h2>
            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />

                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <button type="submit">Create Account</button>
            </form>
            <p>Already have an account? <a href="/">Login</a></p>
        </div>
    );
};

export default Register;
