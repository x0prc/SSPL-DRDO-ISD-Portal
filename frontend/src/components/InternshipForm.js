import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { validateInternshipData } from '../utils/validation';
import './styles.css'; // Ensure this path is correct

const InternshipForm = () => {
    const navigate = useNavigate();
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
        joined: false,
        joiningDate: '',
        relievingDate: '',
        supervisingScientist: '',
        certificateIssuedDate: '',
        remarks: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [decision, setDecision] = useState(null);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? e.target.checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const validationErrors = validateInternshipData(formData, decision);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/internships', 
                { ...formData, status: decision },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 201) {
                navigate('/preview', { 
                    state: { 
                        formData: response.data,
                        decision 
                    }
                });
            }
        } catch (error) {
            setErrors({
                submit: error.response?.data?.message || 'Error submitting application'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePreview = () => {
        const validationErrors = validateInternshipData(formData, decision);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        navigate('/preview', { state: { formData, decision } });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">SIT Data Form</h2>

                {errors.submit && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {errors.submit}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Personal Information Section */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Personal Information</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.name ? 'border-red-500' : ''}`}
                                aria-describedby={errors.name ? 'name-error' : null}
                            />
                            {errors.name && <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                            <input
                                type="text"
                                name="rollNumber"
                                value={formData.rollNumber}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.rollNumber ? 'border-red-500' : ''}`}
                                aria-describedby={errors.rollNumber ? 'rollNumber-error' : null}
                            />
                            {errors.rollNumber && <p id="rollNumber-error" className="mt-1 text-sm text-red-600">{errors.rollNumber}</p>}
                        </div>

                        {/* Add similar input fields for other personal information */}
                    </div>

                    {/* Decision Buttons */}
                    <div className="flex space-x-4 justify-center mt-6">
                        <button
                            type="button"
                            onClick={() => setDecision('accepted')}
                            className={`px-4 py-2 rounded ${decision === 'accepted' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Accept
                        </button>
                        <button
                            type="button"
                            onClick={() => setDecision('rejected')}
                            className={`px-4 py-2 rounded ${decision === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Reject
                        </button>
                    </div>

                    {decision === 'accepted' && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Acceptance Details</h3>
                            {/* Add acceptance-specific fields */}
                        </div>
                    )}

                    {decision === 'rejected' && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Rejection Details</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Remarks</label>
                                <textarea
                                    name="remarks"
                                    value={formData.remarks}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    rows={4}
                                    aria-describedby={errors.remarks ? 'remarks-error' : null}
                                />
                                {errors.remarks && <p id="remarks-error" className="mt-1 text-sm text-red-600">{errors.remarks}</p>}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={handlePreview}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
                        >
                            Preview
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !decision}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded disabled:opacity-50"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InternshipForm;
