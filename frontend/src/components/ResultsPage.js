import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

const Results = () => {
    const [students, setStudents] = useState([]);
    const location = useLocation();
    const history = useHistory();

    const isUpdateMode = new URLSearchParams(location.search).get('updateMode') === 'true';

    useEffect(() => {
        // Fetch students data
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/results');
                const data = await response.json();
                setStudents(data.results);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };
        fetchData();
    }, []);

    const handleSelect = (studentId) => {
        history.push(`/update/${studentId}`); 
    };

    return (
        <div>
            <h2>{isUpdateMode ? 'Select a Student to Update' : 'Results'}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Roll Number</th>
                        <th>Branch</th>
                        <th>Topic/Domain</th>
                        {isUpdateMode && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student._id}>
                            <td>{student.name}</td>
                            <td>{student.rollNumber}</td>
                            <td>{student.branch}</td>
                            <td>{student.topic}</td>
                            {isUpdateMode && (
                                <td>
                                    <button onClick={() => handleSelect(student._id)}>Select</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResultsPage;
