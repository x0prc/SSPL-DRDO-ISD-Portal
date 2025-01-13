const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const authMiddleware = require('../middleware/authMiddleware');

// Submit internship application route (protected)
router.post('/', authMiddleware.authenticateToken, internshipController.submitInternship);

// Get all internships route (protected)
router.get('/', authMiddleware.authenticateToken, internshipController.getInternships);

// Update internship application status route (protected)
router.put('/:id', authMiddleware.authenticateToken, internshipController.updateInternship);

module.exports = router;
