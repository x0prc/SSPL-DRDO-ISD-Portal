import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const InternshipForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        regID: '',
        email: '',
        phone: '',
        institute: '',
        dob: '',
        gender: '',
        state: '',
        aadhar: '',
        branch: '',
        topic: '',
        periodOfTraining: '',
        emailSentDate: '',
        joined: '',
        joiningDate: '',
        relievingDate: '',
        supervisingScientist: '',
        certificateIssuedDate: '',
        remarks: ''
    });

    const [decision, setDecision] = useState(null); // "accepted" or "rejected"
    const history = useHistory();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDecision = (decision) => {
        setDecision(decision);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (decision === 'rejected' && !formData.remarks.trim()) {
            alert('Remarks are mandatory for rejection.');
            return;
        }
        console.log({ ...formData, decision });
        history.push('/review', { formData, decision });
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2>SIT Data Form</h2>
                <form onSubmit={handleSubmit}>
                    <label>Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                    <label>Roll Number</label>
                    <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} required />

                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                    <label>Reg ID</label>
                    <input type="text" name="regID" value={formData.regID} onChange={handleChange} required />

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

                    <div>
                        <button type="button" onClick={() => handleDecision('accepted')}>Accept</button>
                        <button type="button" onClick={() => handleDecision('rejected')}>Reject</button>
                    </div>

                    {decision === 'accepted' && (
                        <div>
                            <label>Period of Training</label>
                            <input type="text" name="periodOfTraining" value={formData.periodOfTraining} onChange={handleChange} required />

                            <label>Email Sent Date</label>
                            <input type="date" name="emailSentDate" value={formData.emailSentDate} onChange={handleChange} required />

                            <label>Joined?</label>
                            <select name="joined" value={formData.joined} onChange={handleChange} required>
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>

                            <label>Joining Date</label>
                            <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required />

                            <label>Relieving Date</label>
                            <input type="date" name="relievingDate" value={formData.relievingDate} onChange={handleChange} required />

                            <label>Supervising Scientist</label>
                            <input type="text" name="supervisingScientist" value={formData.supervisingScientist} onChange={handleChange} required />

                            <label>Date of Certificate Issued</label>
                            <input type="date" name="certificateIssuedDate" value={formData.certificateIssuedDate} onChange={handleChange} required />
                        </div>
                    )}

                    {decision === 'rejected' && (
                        <div>
                            <label>Remarks</label>
                            <textarea name="remarks" value={formData.remarks} onChange={handleChange} required></textarea>
                        </div>
                    )}

                    <button type="button" onClick={handlePreview}>Preview</button>
                </form>
            </div>
        </div>
    );
};

export default InternshipForm;
