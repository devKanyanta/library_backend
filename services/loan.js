const { pool } = require('../db');

exports.addLoan = async function(req, res){
    const { book_id, user_id, librarian_id, loan_date, due_date, return_date } = req.body;

    const sql = `INSERT INTO loan (book_id, user_id, librarian_id, loan_date, due_date, return_date) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
  
    pool.execute(sql, [book_id, user_id, librarian_id, loan_date, due_date, return_date], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to add loan', details: err });
      }
      res.status(201).json({ message: 'Loan added successfully', loanId: results.insertId });
    });
}

exports.getLoans = async function(req, res){
    pool.query('SELECT * FROM loan', (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve loans', details: err });
        }
        res.json({ loans: results });
      });
}

exports.getLoanById = async function(req, res){
    const loanId = req.params.id;

  pool.execute('SELECT * FROM loan WHERE id = ?', [loanId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve loan', details: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    res.json({ loan: results[0] });
  });
}

exports.updateLoan = async function(req, res){
    const loanId = req.params.id;
  const { book_id, user_id, librarian_id, loan_date, due_date, return_date } = req.body;

  const sql = `UPDATE loan SET book_id = ?, user_id = ?, librarian_id = ?, loan_date = ?, due_date = ?, return_date = ?
               WHERE id = ?`;

  pool.execute(sql, [book_id, user_id, librarian_id, loan_date, due_date, return_date, loanId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update loan', details: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    res.json({ message: 'Loan updated successfully' });
  });
}

exports.deleteLoan = async function(req, res){
    const loanId = req.params.id;

  pool.execute('DELETE FROM loan WHERE id = ?', [loanId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete loan', details: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    res.json({ message: 'Loan deleted successfully' });
  });
}