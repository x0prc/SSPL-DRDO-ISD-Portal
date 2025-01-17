const express = require('express');
const router = express.Router();
const User = require('../models/User')(sequelize);
const Internship = require('../models/Internship')(sequelize);
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error:'Access denied. No token provided.' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ error:'Invalid token.' });
    }
};

// User registration route
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ where:{ username } });
        if (existingUser) return res.status(400).json({ error:'Username already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, password : hashedPassword });

        res.status(201).json({ message:"User registered successfully" });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error:"Error registering user" });
    }
});

// User login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where:{ username } });

        if (!user || !(await bcrypt.compare(password,user.password))) {
            return res.status(401).json({ error:"Invalid username or password" });
        }

        const token = jwt.sign({ id:user.id },process.env.JWT_SECRET,{ expiresIn:'24h' });
        res.json({ token, username });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error:"Error during login" });
    }
});

// Internship application submission route
router.post('/', authenticateToken, async (req,res) => {
    try {
        const internshipApplication = await Internship.create(req.body);
        res.status(201).json({ message:"Internship application submitted successfully", internshipApplication });
    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({ error:"Error submitting application" });
    }
});

// Get all internships route
router.get('/', authenticateToken, async (req,res) => {
    try {
        const internships = await Internship.findAll();
        res.json(internships);
    } catch (error) {
        console.error('Retrieval error:', error);
        res.status(500).json({ error:"Error retrieving applications" });
    }
});

// Update internship route
router.put('/:id', authenticateToken, async (req,res) => {
    try {
        const { id } = req.params;
        const updatedInternship = await Internship.update(req.body,{ where:{ id } });

        if (!updatedInternship[0]) return res.status(404).json({ error:"Internship not found" });

        res.json({ message:"Internship updated successfully" });
    } catch (error) {
       console.error('Update error:', error);
       res.status(500).json({ error:"Error updating application" });
   }
});

module.exports = router;
