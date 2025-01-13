const Internship = require('../models/Internship');

exports.submitInternship = async (req, res) => {
    const internshipData = req.body;

    try {
        const internshipApplication = await Internship.create(internshipData);
        res.status(201).send("Internship application submitted successfully");
    } catch (error) {
        res.status(400).send("Error submitting application");
    }
};

exports.getInternships = async (req, res) => {
    try {
        const internships = await Internship.find();
        res.json(internships);
    } catch (error) {
        res.status(500).send("Error retrieving applications");
    }
};

exports.updateInternship = async (req, res) => {
    const { id } = req.params;

    try {
        await Internship.updateOne({ _id: id }, req.body);
        res.send("Internship updated successfully");
    } catch (error) {
        res.status(400).send("Error updating application");
    }
};
