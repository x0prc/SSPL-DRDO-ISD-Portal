import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const InternshipForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        institute: '',
        dob: '',
        gender: '',
        state: '',
        aadhar: '',
        branch: '',
        topic: '',
    });
    const history = useHistory();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic (e.g., API call)
        console.log(formData);
        // Redirect to review page after submission
        history.push('/review', { formData });
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2>SIT Data Form</h2>
                <form onSubmit={handleSubmit}>
                    <label>Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    
                    <label>Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                    
                    <label>Institute</label>
                    <input type="text" name="institute" value={formData.institute} onChange={handleChange} required />
                    
                    <label>DOB</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                    
                    <label>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>

                    <label>State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} required />

                    <label>Aadhar</label>
                    <input type="text" name="aadhar" value={formData.aadhar} onChange={handleChange} required />

                    <label>Branch/Field</label>
                    <input type="text" name="branch" value={formData.branch} onChange={handleChange} required />

                    <label>Topic/Domain</label>
                    <input type="text" name="topic" value={formData.topic} onChange={handleChange} required />

                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default InternshipForm;
