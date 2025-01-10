import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';

const ReviewPage = () => {
    const location = useLocation();
    const history = useHistory();
    const { formData } = location.state || {};

    const handleFinalSubmit = () => {
        // Logic for final submission (e.g., API call)
        console.log("Final Submission:", formData);
        
        history.push('/results', { accepted: true }); 
    };

    return (
        <div className="container">
            <h2>Review Your Submission</h2>
            {formData && (
                <>
                    {Object.entries(formData).map(([key, value]) => (
                        <p key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}</p>
                    ))}
                </>
            )}
            <button onClick={handleFinalSubmit}>Confirm Submission</button>
        </div>
    );
};

export default ReviewPage;
