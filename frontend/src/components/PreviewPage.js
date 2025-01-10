import React from 'react';
import { useLocation } from 'react-router-dom';

const PreviewPage = () => {
    const location = useLocation();
    const { formData, decision } = location.state || {};

    if (!formData) {
        return <p>No data to preview</p>;
    }

    const handleSubmit = () => {
        alert('Successfully submitted');
        history.push('/ResultsPage'); 
    };

    return (
        <div className="container">
            <h2>Preview Form Data</h2>
            <div>
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Roll Number:</strong> {formData.rollNumber}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Reg ID:</strong> {formData.regID}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Institute:</strong> {formData.institute}</p>
                <p><strong>Date of Birth:</strong> {formData.dob}</p>
                <p><strong>Gender:</strong> {formData.gender}</p>
                <p><strong>State:</strong> {formData.state}</p>
                <p><strong>Aadhar:</strong> {formData.aadhar}</p>
                <p><strong>Branch/Field:</strong> {formData.branch}</p>
                <p><strong>Topic/Domain:</strong> {formData.topic}</p>
                <p><strong>Decision:</strong> {decision}</p>
                {decision === 'accepted' && (
                    <div>
                        <p><strong>Period of Training:</strong> {formData.periodOfTraining}</p>
                        <p><strong>Email Sent Date:</strong> {formData.emailSentDate}</p>
                        <p><strong>Joined:</strong> {formData.joined}</p>
                        <p><strong>Joining Date:</strong> {formData.joiningDate}</p>
                        <p><strong>Relieving Date:</strong> {formData.relievingDate}</p>
                        <p><strong>Supervising Scientist:</strong> {formData.supervisingScientist}</p>
                        <p><strong>Certificate Issued Date:</strong> {formData.certificateIssuedDate}</p>
                    </div>
                )}
                {decision === 'rejected' && (
                    <p><strong>Remarks:</strong> {formData.remarks}</p>
                )}
            </div>
        </div>
    );
};

export default PreviewPage;
