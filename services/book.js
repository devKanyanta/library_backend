const { pool } = require('../db');

exports.addBook = async function(req, res) {
  const { title, isbn, publisher, publication_year, genre_id, copies_available, shelf_location, authors } = req.body;

  try {
      // Insert or find publisher
      const publisherResult = await new Promise((resolve, reject) => {
          pool.execute('SELECT id FROM publisher WHERE name = ?', [publisher.name], (err, results) => {
              if (err) return reject(err);
              if (results.length > 0) {
                  resolve(results[0].id);  // Publisher exists
              } else {
                  pool.execute('INSERT INTO publisher (name, address, phone_number) VALUES (?, ?, ?)', 
                  [publisher.name, publisher.address, publisher.phone_number], 
                  (err, result) => {
                      if (err) return reject(err);
                      resolve(result.insertId);  // New publisher added
                  });
              }
          });
      });

      // Insert authors and associate them with the book
      const authorIds = [];
      for (const author of authors) {
          const authorResult = await new Promise((resolve, reject) => {
              pool.execute('SELECT id FROM author WHERE first_name = ? AND last_name = ?', [author.first_name, author.last_name], (err, results) => {
                  if (err) return reject(err);
                  if (results.length > 0) {
                      // Author already exists, create relation
                      resolve(results[0].id);
                  } else {
                      // Insert new author
                      pool.execute('INSERT INTO author (first_name, last_name, nationality, dob) VALUES (?, ?, ?, ?)', 
                      [author.first_name, author.last_name, author.nationality, author.dob], 
                      (err, result) => {
                          if (err) return reject(err);
                          resolve(result.insertId);  // New author added
                      });
                  }
              });
          });
          authorIds.push(authorResult);
      }

      // Insert book
      const bookResult = await new Promise((resolve, reject) => {
          pool.execute('INSERT INTO book (title, isbn, publisher_id, publication_year, genre_id, copies_available, shelf_location) VALUES (?, ?, ?, ?, ?, ?, ?)', 
          [title, isbn, publisherResult, publication_year, genre_id, copies_available, shelf_location], 
          (err, results) => {
              if (err) return reject(err);
              resolve(results.insertId);  // New book added
          });
      });

      // Insert into book_author relationship table
      const authorPromises = authorIds.map((authorId) => {
          return new Promise((resolve, reject) => {
              pool.execute('INSERT INTO book_author (book_id, author_id) VALUES (?, ?)', 
              [bookResult, authorId], (err, result) => {
                  if (err) return reject(err);
                  resolve(result);
              });
          });
      });

      await Promise.all(authorPromises);  // Wait for all author associations to complete

      res.status(201).json({ message: 'Book, publisher, and authors added successfully', bookId: bookResult });
  } catch (err) {
      res.status(500).json({ error: 'Failed to add book', details: err });
  }
};

exports.getBooks = async function(req, res){
    pool.query('SELECT * FROM book', (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve books', details: err });
        }
        res.json({ books: results });
      });
}

exports.getBookById = async function(req, res){
    const bookId = req.params.id;

  pool.execute('SELECT * FROM book WHERE id = ?', [bookId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve book', details: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ book: results[0] });
  });
}

exports.updateBook = async function(req, res) {
  const { bookId, title, isbn, publisher, publication_year, genre_id, copies_available, shelf_location, authors } = req.body;

  try {
      // Update or insert publisher
      const publisherResult = await new Promise((resolve, reject) => {
          pool.execute('SELECT id FROM publisher WHERE name = ?', [publisher.name], (err, results) => {
              if (err) return reject(err);  // Detailed error
              if (results.length > 0) {
                  resolve(results[0].id);  // Publisher exists
              } else {
                  pool.execute('INSERT INTO publisher (name, address, phone_number) VALUES (?, ?, ?)', 
                  [publisher.name, publisher.address, publisher.phone_number], 
                  (err, result) => {
                      if (err) return reject(err);  // Detailed error
                      resolve(result.insertId);  // New publisher added
                  });
              }
          });
      });

      // Update book details
      await new Promise((resolve, reject) => {
          pool.execute('UPDATE book SET title = ?, isbn = ?, publisher_id = ?, publication_year = ?, genre_id = ?, copies_available = ?, shelf_location = ? WHERE id = ?', 
          [title, isbn, publisherResult, publication_year, genre_id, copies_available, shelf_location, bookId], 
          (err, results) => {
              if (err) return reject(err);  // Detailed error
              resolve(results);
          });
      });

      // Update authors and associate them with the book
      const authorIds = [];
      for (const author of authors) {
          const authorResult = await new Promise((resolve, reject) => {
              pool.execute('SELECT id FROM author WHERE first_name = ? AND last_name = ?', [author.first_name, author.last_name], (err, results) => {
                  if (err) return reject(err);  // Detailed error
                  if (results.length > 0) {
                      // Author already exists, create relation
                      resolve(results[0].id);
                  } else {
                      // Insert new author
                      pool.execute('INSERT INTO author (first_name, last_name, nationality, dob) VALUES (?, ?, ?, ?)', 
                      [author.first_name, author.last_name, author.nationality, author.dob], 
                      (err, result) => {
                          if (err) return reject(err);  // Detailed error
                          resolve(result.insertId);  // New author added
                      });
                  }
              });
          });
          authorIds.push(authorResult);
      }

      // Clear existing author relationships in book_author table
      await new Promise((resolve, reject) => {
          pool.execute('DELETE FROM book_author WHERE book_id = ?', [bookId], (err, results) => {
              if (err) return reject(err);  // Detailed error
              resolve(results);
          });
      });

      // Insert new associations in book_author table
      const authorPromises = authorIds.map((authorId) => {
          return new Promise((resolve, reject) => {
              pool.execute('INSERT INTO book_author (book_id, author_id) VALUES (?, ?)', 
              [bookId, authorId], (err, result) => {
                  if (err) return reject(err);  // Detailed error
                  resolve(result);
              });
          });
      });

      await Promise.all(authorPromises);  // Wait for all author associations to complete

      res.status(200).json({ message: 'Book, publisher, and authors updated successfully', bookId: bookId });
  } catch (err) {
      // Return the error details for better insight
      res.status(500).json({ error: 'Failed to update book', details: err.message });
  }
};


exports.deleteBook =async function(req, res){
    const bookId = req.params.id;

  pool.execute('DELETE FROM book WHERE id = ?', [bookId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete book', details: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  });
}