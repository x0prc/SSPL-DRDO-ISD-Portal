const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USERNAME || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sit_portal',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

pool.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to PostgreSQL database");
  }
});

// Middleware for Authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
};

// User Login Route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User Registration Route
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Internship Form Submission Route
app.post('/submit-internship-form', async (req, res) => {
  try {
    const {
      name,
      roll_number,
      registration_id,
      email,
      phone,
      institute,
      dob,
      gender,
      state,
      aadhar,
      branch,
      topic,
      period_of_training,
      email_sent_date,
      joined,
      joining_date,
      relieving_date,
      supervising_scientist,
      certificate_issued_date,
      remarks,
      rejection_remarks
    } = req.body;

    // Convert gender to lowercase
    const formattedGender = gender ? gender.toLowerCase() : null;

    const query = `
      INSERT INTO internship_form (
        name, roll_number, registration_id, email, phone, institute, dob, gender, state, aadhar, branch, topic,
        period_of_training, email_sent_date, joined, joining_date, relieving_date, supervising_scientist,
        certificate_issued_date, remarks, rejection_remarks
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18, $19, $20, $21
      ) RETURNING *`;

    const values = [
      name, roll_number, registration_id, email, phone, institute, dob, formattedGender, state, aadhar, branch, topic,
      period_of_training, email_sent_date, joined, joining_date, relieving_date, supervising_scientist,
      certificate_issued_date, remarks, rejection_remarks
    ];

    const result = await pool.query(query, values);
    res.status(201).json({ message: "Internship form submitted successfully", data: result.rows[0] });
  } catch (error) {
    console.error('Error submitting internship form:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch Internship Data with Filters
app.get('/get-internship-data', async (req, res) => {
  try {
    const { name, registration_id, supervising_scientist, custom } = req.query;

    let query = `SELECT * FROM internship_form WHERE 1=1`;
    let values = [];
    
    if (name) {
      values.push(`%${name.trim().toLowerCase()}%`);
      query += ` AND LOWER(TRIM(name)) LIKE $${values.length}`;
    }
    
    if (registration_id) {
      values.push(registration_id.trim());
      query += ` AND TRIM(registration_id) = $${values.length}`;
    }

    if (supervising_scientist) {
      values.push(`%${supervising_scientist.trim().toLowerCase()}%`);
      query += ` AND LOWER(TRIM(supervising_scientist)) LIKE $${values.length}`;
    }

    if (custom) {
      values.push(`%${custom.trim().toLowerCase()}%`);
      values.push(`%${custom.trim().toLowerCase()}%`);
      values.push(`%${custom.trim().toLowerCase()}%`);
      values.push(`%${custom.trim().toLowerCase()}%`);
      values.push(`%${custom.trim().toLowerCase()}%`);
      values.push(`%${custom.trim().toLowerCase()}%`);

      query += ` AND (
        LOWER(TRIM(name)) LIKE $${values.length - 5} OR
        LOWER(TRIM(email)) LIKE $${values.length - 4} OR
        LOWER(TRIM(topic)) LIKE $${values.length - 3} OR
        LOWER(TRIM(institute)) LIKE $${values.length - 2} OR
        LOWER(TRIM(state)) LIKE $${values.length - 1} OR
        LOWER(TRIM(branch)) LIKE $${values.length}
      )`;
    }

    console.log("Executing Query:", query);
    console.log("With Values:", values);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      console.log("No matching data found.");
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching internship data:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/generate-report/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM internship_form WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No data found for the given ID" });
    }

    const data = result.rows[0];
    const studentName = data.name.replace(/\s+/g, '_'); // Replace spaces with underscores
    const registrationId = data.registration_id;
    const filename = `${studentName}_${registrationId}.pdf`;

    // ✅ Set response headers before writing PDF
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/pdf');

    const doc = new PDFDocument();
    doc.pipe(res); // ✅ Stream PDF directly to response

    doc.fontSize(20).text("Internship Report", { align: 'center' });
    doc.moveDown();

    Object.keys(data).forEach((key) => {
      doc.fontSize(12).text(`${key}: ${data[key]}`);
    });

    doc.end();

  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, 'frontend/public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
