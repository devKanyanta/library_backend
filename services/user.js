const express = require('express');
const bodyParser = require('body-parser');
const { pool, executeSchema } = require('../db');

const app = express();
app.use(bodyParser.json());

exports.getUsers = async function(req, res){
    pool.execute('SELECT * FROM users', (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
}

exports.getUserById = async function(req, res){
    const { id } = req.params;
    pool.execute('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(rows[0]);
    });
}

exports.getUserRole = async function(req, res){
    const { role } = req.params;
    pool.execute('SELECT * FROM users WHERE role = ?', [role], (err, rows) => {
      if (err) return res.status(500).send(err.message);
      if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
      res.json(rows);
    });
}

exports.updateUserDetails = async function(req, res){
    const { id } = req.params;
    const { first_name, last_name, email, phone_number, role, password } = req.body;
  
    try {
      let hashedPassword = password;
      if (password) {
        hashedPassword = await bcrypt.hash(password, saltRounds);
      }
  
      pool.execute(
        'UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ?, role = ?, password = ? WHERE id = ?',
        [first_name, last_name, email, phone_number, role, hashedPassword, id],
        (err, result) => {
          if (err) return res.status(500).send(err.message);
          if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
          res.json({ message: 'User updated successfully' });
        }
      );
    } catch (err) {
      res.status(500).json({ error: 'Failed to hash password' });
    }
}

exports.deleteUser = async function(req, res){
    const { id } = req.params;
    pool.execute('DELETE FROM users WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send(err.message);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    });
}