const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    institute: { type: String },
    dob: { type: Date },
    gender: { type: String },
    state: { type: String },
    aadhar: { type: String },
    branch: { type: String },
    topic: { type: String },
    periodOfTraining: { type: String },
    emailSentDate: { type: Date },
    joined: { type: Boolean, default: false },
    joiningDate: { type: Date },
    relievingDate: { type: Date },
    supervisingScientist: { type: String },
});

module.exports = mongoose.model('Internship', InternshipSchema);
