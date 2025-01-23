import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PreviewPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { formData, decision } = location.state || {};
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!formData) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600">No Data Available</h2>
                    <p className="mt-4">Please fill out the internship form first.</p>
                    <button
                        onClick={() => navigate('/internship-form')}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Go to Form
                    </button>
                </div>
            </div>
        );
    }

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/internships', 
                { ...formData, status: decision },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            navigate('/results', { 
                state: { 
                    success: true, 
                    message: 'Application submitted successfully' 
                }
            });
        } catch (error) {
            setError(error.response?.data?.message || 'Error submitting application');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">Application Preview</h2>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <PreviewField label="Name" value={formData.name} />
                    <PreviewField label="Roll Number" value={formData.rollNumber} />
                    <PreviewField label="Email" value={formData.email} />
                    <PreviewField label="Phone" value={formData.phone} />
                    <PreviewField label="Institute" value={formData.institute} />
                    <PreviewField label="Date of Birth" value={formatDate(formData.dob)} />
                    <PreviewField label="Gender" value={formData.gender} />
                    <PreviewField label="State" value={formData.state} />
                    <PreviewField label="Branch/Field" value={formData.branch} />
                    <PreviewField label="Topic/Domain" value={formData.topic} />
                    
                    {decision === 'accepted' && (
                        <>
                            <PreviewField 
                                label="Period of Training" 
                                value={formData.periodOfTraining} 
                            />
                            <PreviewField 
                                label="Email Sent Date" 
                                value={formatDate(formData.emailSentDate)} 
                            />
                            <PreviewField 
                                label="Joining Date" 
                                value={formatDate(formData.joiningDate)} 
                            />
                            <PreviewField 
                                label="Relieving Date" 
                                value={formatDate(formData.relievingDate)} 
                            />
                            <PreviewField 
                                label="Supervising Scientist" 
                                value={formData.supervisingScientist} 
                            />
                        </>
                    )}

                    {decision === 'rejected' && (
                        <div className