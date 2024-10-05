const express = require('express');
const bodyParser = require('body-parser');
const { pool, executeSchema } = require('../db');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());

const saltRounds = 10;

exports.registerUser = async function (req, res) {
  const { id, first_name, last_name, email, phone_number, role, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert into the users table
    pool.execute(
      'INSERT INTO users (id, first_name, last_name, email, phone_number, role, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, first_name, last_name, email, phone_number, role, hashedPassword],
      (err, result) => {
        if (err) {
          // Check for duplicate entry error (MySQL error code 1062)
          if (err.code === 'ER_DUP_ENTRY') {
            if (err.message.includes('PRIMARY')) {
              return res.status(409).json({ error: 'ID already exists.' });
            } else if (err.message.includes('email')) {
              return res.status(409).json({ error: 'Email already exists.' });
            }
          }
          return res.status(500).json({ error: err.message });
        }

        // Insert into the student or librarian table based on the role
        if (role === "student") {
          pool.execute(
            'INSERT INTO student (department, year_of_study, max_books, fine_amount, user_id) VALUES (?, ?, ?, ?, ?)',
            ["", 1, 5, 0, id],
            (err, result) => {
              if (err) {
                return res.status(500).json({ error: 'Failed to insert into student table: ' + err.message });
              }
              // Exclude password from response and return success
              res.status(201).json({ status_code: '200', id, ...req.body, password: undefined });
            }
          );
        } else if (role === "librarian") {
          pool.execute(
            'INSERT INTO librarian (user_id) VALUES (?)',
            [id],
            (err, result) => {
              if (err) {
                return res.status(500).json({ error: 'Failed to insert into librarian table: ' + err.message });
              }
              // Exclude password from response and return success
              res.status(201).json({ status_code: '200', id, ...req.body, password: undefined });
            }
          );
        }
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Failed to hash password: ' + err.message });
  }
};

exports.logInUser = async function (req, res) {
  const { email, password } = req.body;

  // Determine if the input is an email (if it contains '@') or an id
  const isEmail = email.includes('@');
  
  // Choose the appropriate query based on whether the input is an email or id
  const query = isEmail ? 'SELECT * FROM users WHERE email = ?' : 'SELECT * FROM users WHERE id = ?';

  pool.execute(query, [email], async (err, rows) => {
    if (err) return res.status(500).send(err.message);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = rows[0];

    // Compare the password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid password' });

    res.json({ status_code: '200', message: 'Login successful', user_id: user.id, email: user.email });
  });
};
