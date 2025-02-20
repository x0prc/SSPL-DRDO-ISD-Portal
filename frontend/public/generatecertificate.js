function fetchStudents() {
    showLoading();
    fetch('/api/students')
        .then(response => response.json())
        .then(data => {
            populateStudentsTable(data);
            hideLoading();
        })
        .catch(error => {
            handleFetchError(error, "Error fetching students");
            hideLoading();
        });
}

// Function to populate the table with student data
function populateStudentsTable(data) {
    const tableBody = document.getElementById("studentsTableBody");
    tableBody.innerHTML = ""; 

    data.forEach((student, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.rollNumber}</td>
            <td>${student.institute}</td>
            <td>${student.branch}</td>
            <td>${student.topic}</td>
            <td>${student.duration}</td>
            <td><button class='btn btn-primary btn-sm' onclick='generateCertificate("${student.id}")'>Generate PDF</button></td>`;
        tableBody.appendChild(row);
    });
}

// Function to generate a certificate for a single student
function generateCertificate(studentId) {
    showLoading();
    fetch(`/api/generate-certificate/${studentId}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            alert(`Certificate generated for ${data.name}`);
            hideLoading();
        })
        .catch(error => {
            handleFetchError(error, "Error generating certificate");
            hideLoading();
        });
}

// Function to generate certificates for all students
function generateAllCertificates() {
    showLoading();
    fetch('/api/generate-all-certificates', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            alert(`Generated ${data.count} certificates`);
            hideLoading();
        })
        .catch(error => {
            handleFetchError(error, "Error generating certificates");
            hideLoading();
        });
}

// Add event listener for the "Generate All Certificates" button
document.addEventListener("DOMContentLoaded", () => {
    const generateAllButton = document.getElementById("generateAllCertificates");
    if (generateAllButton) {
        generateAllButton.addEventListener("click", generateAllCertificates);
    }
    fetchStudents(); 
});

// Periodically update the table (e.g., every 30 seconds)
setInterval(fetchStudents, 30000);

// Error handling function
function handleFetchError(error, message) {
    console.error(message, error);
    alert(`An error occurred: ${message}. Please try again later.`);
}

// Add loading indicator
function showLoading() {
    const loadingIndicator = document.createElement("div");
    loadingIndicator.id = "loadingIndicator";
    loadingIndicator.textContent = "Loading...";
    document.body.appendChild(loadingIndicator);
}

function hideLoading() {
    const loadingIndicator = document.getElementById("loadingIndicator");
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
}