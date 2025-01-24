const db = require('../config/db');

const Internship = {
    create: (data, callback) => {
        const sql = 'INSERT INTO internships (userId, title, description) VALUES (?, ?, ?)';
        db.query(sql, [data.userId, data.title, data.description], callback);
    },
    findAll: (userId, callback) => {
        const sql = 'SELECT * FROM internships WHERE userId = ?';
        db.query(sql, [userId], callback);
    },
    update: (id, data, callback) => {
        const sql = 'UPDATE internships SET title = ?, description = ? WHERE id = ?';
        db.query(sql, [data.title, data.description, id], callback);
    }
};

module.exports = Internship;