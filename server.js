const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path'); 
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); 

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

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
};

app.use(express.static(path.join(__dirname, 'frontend/public/style.css')));

// Routes

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'frontend/public/index.html'));
});

// Register a new user
app.post('/admin/register', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).send("User registered successfully");
    } catch (error) {
        res.status(400).send("Error registering user");
    }
});

// Login route
app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send("Invalid username or password");
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
});

// Submit internship application
app.post('/api/internships', authenticateToken, async (req, res) => {
    const internshipData = req.body;

    try {
        const internshipApplication = new Internship(internshipData);
        await internshipApplication.save();
        res.status(201).send("Internship application submitted successfully");
    } catch (error) {
        res.status(400).send("Error submitting application");
    }
});

// Get all internship applications (protected)
app.get('/api/internships', authenticateToken, async (req, res) => {
    try {
        const internships = await Internship.find();
        res.json(internships);
    } catch (error) {
        res.status(500).send("Error retrieving applications");
    }
});

// Update internship application status
app.put('/api/internships/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    
    try {
        const updatedInternship = await Internship.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedInternship) return res.status(404).send("Internship not found");
        
        res.json(updatedInternship);
    } catch (error) {
        res.status(400).send("Error updating application");
    }
});

// Start the server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
