import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

const UpdateForm = () => {
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const history = useHistory();

    useEffect(() => {
        // Fetch student data
        const fetchStudent = async () => {
            try {
                const response = await fetch(`http://localhost:5000/results/${studentId}`);
                const data = await response.json();
                setStudent(data);
            } catch (error) {
                console.error('Error fetching student:', error);
            }
        };
        fetchStudent();
    }, [studentId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent({ ...student, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/results/${studentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student),
            });
            if (response.ok) {
                alert('Student data updated successfully!');
                history.push('/results');
            } else {
                alert('Failed to update student data');
            }
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    if (!student) return <p>Loading...</p>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Update Student Data</h2>
            <input type="text" name="rollNumber" value={student.rollNumber} onChange={handleChange} required />
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

                        <div>
                            <label>Remarks</label>
                            <textarea name="remarks" value={formData.remarks} onChange={handleChange} required></textarea>
                        </div>
            <button type="submit">Update</button>
        </form>
    );
};

export default UpdateForm;
