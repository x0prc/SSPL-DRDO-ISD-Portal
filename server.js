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
    console.log("\n📥 Received Form Data:", req.body); 

    let {
      name, roll_number, lor_check, cv_check, noc_check,
      registration_id, email, phone, institute, dob, gender,
      state, aadhar, branch, topic, period_of_training,
      email_sent_date, joined, joining_date, relieving_date,
      supervising_scientist, certificate_issued_date, remarks,
      rejection_remarks, decision
    } = req.body;

    // ✅ Convert empty strings to NULL (for VARCHAR fields)
    const convertEmptyToNull = (value) => (value === "" ? null : value);

    name = convertEmptyToNull(name);
    roll_number = convertEmptyToNull(roll_number);
    registration_id = convertEmptyToNull(registration_id);
    email = convertEmptyToNull(email);
    phone = convertEmptyToNull(phone);
    institute = convertEmptyToNull(institute);
    gender = convertEmptyToNull(gender);
    state = convertEmptyToNull(state);
    aadhar = convertEmptyToNull(aadhar);
    branch = convertEmptyToNull(branch);
    topic = convertEmptyToNull(topic);
    period_of_training = convertEmptyToNull(period_of_training);
    supervising_scientist = convertEmptyToNull(supervising_scientist);
    remarks = convertEmptyToNull(remarks);
    rejection_remarks = convertEmptyToNull(rejection_remarks);
    decision = convertEmptyToNull(decision) ; // Default to 'pending'

    // ✅ Convert empty string date values to NULL (for DATE fields)
    dob = convertEmptyToNull(dob);
    email_sent_date = convertEmptyToNull(email_sent_date);
    joining_date = convertEmptyToNull(joining_date);
    relieving_date = convertEmptyToNull(relieving_date);
    certificate_issued_date = convertEmptyToNull(certificate_issued_date);

    // ✅ Ensure boolean values are stored correctly (default to `false` if missing)
    lor_check = lor_check === true;
    cv_check = cv_check === true;
    noc_check = noc_check === true;
    joined = joined === true;

    // ✅ Ensure roll_number is not null (Prevent Database Error)
    if (!roll_number) {
      return res.status(400).json({ error: "❌ Roll Number is required and cannot be null." });
    }

    // ✅ SQL Query
    const query = `
      INSERT INTO internship_form (
        name, roll_number, lor_check, cv_check, noc_check, decision, 
        registration_id, email, phone, institute, dob, gender, state, 
        aadhar, branch, topic, period_of_training, email_sent_date, joined, 
        joining_date, relieving_date, supervising_scientist, certificate_issued_date, 
        remarks, rejection_remarks
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
      ) RETURNING *`;

    // ✅ Values to Insert
    const values = [
      name, roll_number, lor_check, cv_check, noc_check, decision,
      registration_id, email, phone, institute, dob, gender, state,
      aadhar, branch, topic, period_of_training, email_sent_date, joined,
      joining_date, relieving_date, supervising_scientist, certificate_issued_date,
      remarks, rejection_remarks
    ];

    console.log("\n🚀 Executing Query:", query);
    console.log("🔍 With Values:", values);

    // ✅ Execute Query
    const result = await pool.query(query, values);
    
    res.status(201).json({ message: "✅ Internship form submitted successfully", data: result.rows[0] });

  } catch (error) {
    console.error('❌ Error submitting internship form:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Fetch Internship Data
app.get('/get-internship-data', async (req, res) => {
  try {
    const { name, registration_id, supervising_scientist, custom } = req.query;

    let query = `
        SELECT id, name, roll_number, lor_check, cv_check, noc_check, 
        decision, registration_id, email, phone, institute, dob, gender, state, 
        aadhar, branch, topic, period_of_training, email_sent_date, joined, 
        joining_date, relieving_date, supervising_scientist, certificate_issued_date, 
        remarks, rejection_remarks
        FROM internship_form WHERE 1=1`;

    let values = [];
    let conditions = [];

    // ✅ Standard filters
    if (name) {
        values.push(`%${name.trim().toLowerCase()}%`);
        conditions.push(`LOWER(TRIM(name)) LIKE $${values.length}`);
    }

    if (registration_id) {
        values.push(registration_id.trim());
        conditions.push(`TRIM(registration_id) = $${values.length}`);
    }

    if (supervising_scientist) {
        values.push(`%${supervising_scientist.trim().toLowerCase()}%`);
        conditions.push(`LOWER(TRIM(supervising_scientist)) LIKE $${values.length}`);
    }

    // ✅ Custom Search Fix (Ensuring no invalid empty date comparisons)
    if (custom) {
        let searchFields = [
            "roll_number", "email", "phone", "institute", "gender", "state",
            "aadhar", "branch", "topic", "period_of_training", "remarks", "rejection_remarks"
        ];

        let dateFields = ["dob", "email_sent_date", "joining_date", "relieving_date", "certificate_issued_date"];

        let customValue = `%${custom.trim().toLowerCase()}%`;

        // ✅ Normal text fields
        searchFields.forEach((field) => {
            values.push(customValue);
            conditions.push(`LOWER(TRIM(COALESCE(${field}, ''))) LIKE $${values.length}`);
        });

        // ✅ Properly handle date fields to avoid empty string errors
        dateFields.forEach((field) => {
            values.push(customValue);
            conditions.push(`COALESCE(${field}::TEXT, '') LIKE $${values.length}`);
        });
    }

    // ✅ Apply conditions
    if (conditions.length > 0) {
        query += ` AND (${conditions.join(" OR ")})`;
    }

    // ✅ Ensure correct ID order
    query += ` ORDER BY id ASC;`;

    console.log("\n🚀 Executing Query:\n", query);
    console.log("🔍 With Values:\n", values);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
        console.log("⚠️ No matching data found.");
    }

    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching internship data:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Generate Report
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
