const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt .hashSync(password, 8);
    User.create(username, hashedPassword, (err, result) => {
        if (err) return res.status(500).send('Error registering user');
        res.status(201).send('User  registered successfully');
    });
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    User.findByUsername(username, (err, user) => {
        if (err || !user) return res.status(404).send('User  not found');
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) return res.status(401).send('Invalid password');

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    });
};