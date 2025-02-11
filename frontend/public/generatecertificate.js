const students = [
    {
        name: "John Doe",
        rollNumber: "12345",
        institute: "IIT Delhi",
        branch: "Computer Science",
        topic: "Machine Learning",
        duration: "4 weeks"
    },
    {
        name: "Jane Smith",
        rollNumber: "67890",
        institute: "NIT Trichy",
        branch: "Electronics",
        topic: "IoT",
        duration: "6 weeks"
    }
];

// Function to populate the table with student data
function populateStudentsTable(data) {
    const tableBody = document.getElementById("studentsTableBody");
    tableBody.innerHTML = ""; // Clear existing rows

    data.forEach((student, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.rollNumber}</td>
            <td>${student.institute}</td>
            <td>${student.branch}</td>
            <td>${student.topic}</td>
            <td>${student.duration}</td>
            <td><button class='btn btn-primary btn-sm' onclick='generateCertificate(${index})'>Generate PDF</button></td>`;
        tableBody.appendChild(row);
    });
}

// Function to generate a certificate for a single student
function generateCertificate(index) {
    const student = students[index];
    
    // Send request to backend to generate PDF (mocked here)
    alert(`Generating certificate for ${student.name}`);
}

// Function to generate certificates for all students
document.getElementById("generateAllCertificates").addEventListener("click", () => {
    students.forEach((_, index) => generateCertificate(index));
});

// Populate the table on page load
document.addEventListener("DOMContentLoaded", () => {
    populateStudentsTable(students);
});
