const { pool } = require('../db');

exports.addReservation = async function(req, res){
    const { book_id, user_id, librarian_id, status } = req.body;
    const reservationDate = new Date();  // Assuming current date for the reservation

    const sql = `INSERT INTO reservation (book_id, user_id, librarian_id, date, status) 
                 VALUES (?, ?, ?, ?, ?)`;

    pool.execute(sql, [book_id, user_id, librarian_id, reservationDate, status], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to create reservation', details: err });
        }
        res.json({ message: 'Reservation created successfully', reservationId: results.insertId });
    });
}

exports.getReservations = async function(req, res){
    const sql = `SELECT * FROM reservation`;

    pool.execute(sql, [], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve reservations', details: err });
        }
        res.json(results);
    });
}

exports.getReservationById = async function(req, res){
    const reservationId = req.params.id;
    
    const sql = `SELECT * FROM reservation WHERE id = ?`;

    pool.execute(sql, [reservationId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve reservation', details: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.json(results[0]);
    });
}

exports.updateReservations = async function(req, res){
    const reservationId = req.params.id;
    const { status } = req.body;

    const sql = `UPDATE reservation SET status = ? WHERE id = ?`;

    pool.execute(sql, [status, reservationId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update reservation', details: err });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.json({ message: 'Reservation updated successfully' });
    });
}

exports.deleteReservation = async function(req, res){
    const reservationId = req.params.id;

    const sql = `DELETE FROM reservation WHERE id = ?`;

    pool.execute(sql, [reservationId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete reservation', details: err });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.json({ message: 'Reservation deleted successfully' });
    });
}