const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sql = require('mssql'); // Import the mssql package
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express(); // Initialize Express app

// Middleware
app.use(cors({
    origin: 'http://localhost:5500', 
    credentials: true
}));
app.use(express.json()); // Parse JSON bodies

// SQL Server configuration
const dbConfig = {
    user: process.env.DB_USERNAME || 'scientist1', // Database username
    password: process.env.DB_PASSWORD || '$2a$10$EIXZB9XK7h5k5vYBvDgNqO9Q0YxF1U4J8aVtL5zFQ9cGq9x0A1z0y', // Database password
    server: process.env.DB_HOST || 'localhost', // Server IP address or hostname
    database: process.env.DB_NAME || 'InternshipPortal', // Database name
    options: {
        encrypt: false, // Use true if you're on Azure
        trustServerCertificate: true, // Change to true for local dev / self-signed certs
    },
};

// Connect to SQL Server
sql.connect(dbConfig)
    .then(() => console.log("Connected to SQL Server"))
    .catch(err => console.error("Database connection error:", err));

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Handle "Bearer" token format

    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token.' });
        req.user = user;
        next();
    });
};

// User registration route
app.post('/components/Register', async (req, res) => {
    try {
        const { username, password } = req.body;

        const request = new sql.Request();
        const result = await request.query(`SELECT * FROM Users WHERE username='${username}'`);

        if (result.recordset.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await request.query(`INSERT INTO Users (username, password) VALUES ('${username}', '${hashedPassword}')`);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: "Error registering user" });
    }
});

// User login route
app.post('/components/InternshipForm', async (req, res) => {
    try {
        const { username, password } = req.body;
        const request = new sql.Request();
        
        const result = await request.query(`SELECT * FROM Users WHERE username='${username}'`);

        if (result.recordset.length === 0 || !(await bcrypt.compare(password, result.recordset[0].password))) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const token = jwt.sign({ id: result.recordset[0].id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, username });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: "Error during login" });
    }
});

// Internship application submission route
app.post('/api/internships', authenticateToken, async (req, res) => {
    try {
        const { name, email, phone, institute } = req.body; // Add other fields as necessary

        const request = new sql.Request();
        await request.query(`INSERT INTO Internships (name, email, phone, institute) VALUES ('${name}', '${email}', '${phone}', '${institute}')`);

        res.status(201).json({ message: "Internship application submitted successfully" });
    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({ error: "Error submitting application" });
    }
});

// Get all internships route
app.get('/api/internships', authenticateToken, async (req, res) => {
    try {
        const request = new sql.Request();
        const result = await request.query(`SELECT * FROM Internships`);
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Retrieval error:', error);
        res.status(500).json({ error: "Error retrieving applications" });
    }
});

// Update internship route
app.put('/api/internships/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        const updates = Object.entries(req.body)
            .map(([key, value]) => `${key}='${value}'`)
            .join(', ');
        
        const request = new sql.Request();
        await request.query(`UPDATE Internships SET ${updates} WHERE id=${id}`);

        res.json({ message: "Internship updated successfully" });
    } catch (error) {
       console.error('Update error:', error);
       res.status(500).json({ error:"Error updating application" });
   }
});

app.use(express.static(path.join(__dirname, 'frontend/public')));
// Handle React routing for all requests to React app
app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname,'frontend/public','index.html'));
});


// Start the server 
const PORT = process.env.PORT || 5500; 
app.listen(PORT, () => { 
   console.log(`Server running on port ${PORT}`); 
});
