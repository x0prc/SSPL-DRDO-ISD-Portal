const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5500', 
    credentials: true
}));app.use(express.json());

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, 'frontend/public')));
// Serve static files from the public directory
// Specifically serve CSS files
app.use('/css', express.static(path.join(__dirname, 'frontend/public')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// User model
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

const InternshipSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    institute: String,
    dob: Date,
    gender: String,
    state: String,
    aadhar: String,
    branch: String,
    topic: String,
    periodOfTraining: String,
    emailSentDate: Date,
    joined: { type: Boolean, default: false },
    joiningDate: Date,
    relievingDate: Date,
    supervisingScientist: String,
});

const Internship = mongoose.model('Internship', InternshipSchema);

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Handle "Bearer" token format

    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid token.' });
    }
};

// API Routes
app.post('/components/LoginPage', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: "Error registering user" });
    }
});

app.post('/components/LoginPage', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, username: user.username });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: "Error during login" });
    }
});

app.post('/api/internships', authenticateToken, async (req, res) => {
    try {
        const internshipApplication = new Internship(req.body);
        await internshipApplication.save();
        res.status(201).json({ message: "Internship application submitted successfully" });
    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({ error: "Error submitting application" });
    }
});

app.get('/api/internships', authenticateToken, async (req, res) => {
    try {
        const internships = await Internship.find().sort({ _id: -1 });
        res.json(internships);
    } catch (error) {
        console.error('Retrieval error:', error);
        res.status(500).json({ error: "Error retrieving applications" });
    }
});

app.put('/api/internships/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedInternship = await Internship.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updatedInternship) {
            return res.status(404).json({ error: "Internship not found" });
        }
        
        res.json(updatedInternship);
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: "Error updating application" });
    }
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});