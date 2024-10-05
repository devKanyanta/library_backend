const { pool } = require('../db');

exports.addFine = async function(req, res){
    const { loan_id, student_id, amount, payment_status, payment_date } = req.body;

    const sql = `INSERT INTO fine (loan_id, student_id, amount, payment_status, payment_date) 
                 VALUES (?, ?, ?, ?, ?)`;
  
    pool.execute(sql, [loan_id, student_id, amount, payment_status, payment_date], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to add fine', details: err });
      }
      res.status(201).json({ message: 'Fine added successfully', fineId: results.insertId });
    });
}

exports.getFines = async function(req, res){
    pool.query('SELECT * FROM fine', (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve fines', details: err });
        }
        res.json({ fines: results });
      });
}

exports.getFineById = async function(req, res){
    const fineId = req.params.id;

    pool.execute('SELECT * FROM fine WHERE id = ?', [fineId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to retrieve fine', details: err });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'Fine not found' });
      }
  
      res.json({ fine: results[0] });
    });
}

exports.payFine = async function(req, res){
    const fineId = req.params.fineId;
    const paymentDate = new Date();

    const sql = `UPDATE fine SET payment_status = ?, payment_date = ? WHERE id = ?`;

    pool.execute(sql, ['Paid', paymentDate, fineId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update fine payment', details: err });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Fine not found' });
        }

        res.json({ message: 'Fine paid successfully' });
    });
}

exports.updateFine = async function(req, res){
    const fineId = req.params.id;
    const { loan_id, student_id, amount, payment_status, payment_date } = req.body;
  
    const sql = `UPDATE fine SET loan_id = ?, student_id = ?, amount = ?, payment_status = ?, payment_date = ? 
                 WHERE id = ?`;
  
    pool.execute(sql, [loan_id, student_id, amount, payment_status, payment_date, fineId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update fine', details: err });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Fine not found' });
      }
  
      res.json({ message: 'Fine updated successfully' });
    });
}

exports.deleteFine = async function(req, res){
    const fineId = req.params.id;

    pool.execute('DELETE FROM fine WHERE id = ?', [fineId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete fine', details: err });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Fine not found' });
      }
  
      res.json({ message: 'Fine deleted successfully' });
    });
}