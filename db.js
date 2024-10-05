// db.js - Handles database connection
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Create connection to the database
const pool = mysql.createPool({
  host: 'sql8.freesqldatabase.com',
  user: 'sql8735646',
  password: 'zztKXT1PBL',
  database: 'sql8735646',
  waitForConnections: true,
  port: '3306',
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true  // Allow multiple SQL statements to be executed in one query
});

// Load the SQL schema from the file
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql')).toString();

// Function to execute the schema
const executeSchema = () => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected to database.");

    // Execute schema.sql
    connection.query(schema, (err, result) => {
      connection.release();
      if (err) {
        console.error('Error executing schema: ', err.message);
      } else {
        console.log('Schema executed successfully.');
      }
    });
  });
};

module.exports = { pool, executeSchema };
