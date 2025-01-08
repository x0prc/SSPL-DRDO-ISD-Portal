import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 

const CertificateGenerator = () => {
    const [internships, setInternships] = useState([]);
    const [selectedInternship, setSelectedInternship] = useState(null);
    const [certificateDate, setCertificateDate] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch all internship applications
        const fetchInternships = async () => {
            try {
                const response = await axios.get('/api/internships'); // Adjust API endpoint as necessary
                setInternships(response.data);
            } catch (error) {
                console.error("Error fetching internships:", error);
            }
        };

        fetchInternships();
    }, []);

    const handleGenerateCertificate = async () => {
        if (!selectedInternship || !certificateDate) {
            setMessage("Please select an internship and enter a date.");
            return;
        }

        // Generate PDF Certificate
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Certificate of Completion", 105, 30, { align: "center" });
        
        doc.setFontSize(14);
        doc.text(`This is to certify that`, 105, 60, { align: "center" });
        
        doc.setFontSize(16);
        doc.text(selectedInternship.name, 105, 80, { align: "center" });
        
        doc.setFontSize(14);
        doc.text(`has successfully completed the internship at`, 105, 100, { align: "center" });
        
        doc.text(selectedInternship.institute, 105, 120, { align: "center" });
        
        doc.text(`on ${certificateDate}.`, 105, 140, { align: "center" });

        doc.autoTable({
            startY: 160,
            head: [['Field', 'Details']],
            body: [
                ['Email', selectedInternship.email],
                ['Phone', selectedInternship.phone],
                ['Branch', selectedInternship.branch],
                ['Topic', selectedInternship.topic],
            ],
            theme: 'grid',
            styles: { halign: 'center' },
        });

        doc.save(`${selectedInternship.name}_Certificate.pdf`);

        try {
            await axios.put(`/api/internships/${selectedInternship._id}`, { 
                joined: true, 
                joiningDate: certificateDate 
            });
            
            setMessage("Certificate generated successfully!");
        } catch (error) {
            console.error("Error updating internship status:", error);
            setMessage("Failed to generate certificate.");
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2>Generate Certificate</h2>
                <label>Select Internship:</label>
                <select onChange={(e) => setSelectedInternship(JSON.parse(e.target.value))}>
                    <option value="">Select an internship</option>
                    {internships.map((internship) => (
                        <option key={internship._id} value={JSON.stringify(internship)}>
                            {internship.name} - {internship.institute}
                        </option>
                    ))}
                </select>

                <label>Date of Certificate Issued:</label>
                <input 
                    type="date" 
                    value={certificateDate} 
                    onChange={(e) => setCertificateDate(e.target.value)} 
                    required 
                />

                <button onClick={handleGenerateCertificate}>Generate Certificate</button>

                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default CertificateGenerator;
