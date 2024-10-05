const express = require('express');
const bodyParser = require('body-parser');
const { pool, executeSchema } = require('../db');

exports.addGenre = async function(req, res){
    const { genres } = req.body;
  
    if (!Array.isArray(genres) || genres.length === 0) {
      return res.status(400).json({ error: 'Genres should be a non-empty array' });
    }
  
    const genrePromises = genres.map((genre) => {
      return new Promise((resolve, reject) => {
        // Check if genre already exists
        pool.execute('SELECT id FROM genre WHERE genre = ?', [genre], (err, results) => {
          if (err) return reject(err);
  
          if (results.length > 0) {
            // Genre already exists
            resolve(results[0].id);
          } else {
            // Insert new genre
            pool.execute('INSERT INTO genre (genre) VALUES (?)', [genre], (err, result) => {
              if (err) return reject(err);
              resolve(result.insertId);
            });
          }
        });
      });
    });
  
    Promise.all(genrePromises)
      .then((genreIds) => res.json({ message: 'Genres added successfully', genreIds }))
      .catch((err) => res.status(500).json({ error: 'Failed to add genres', details: err }));
}

exports.getAllGenre = async function(req, res){
    pool.query('SELECT * FROM genre', (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to retrieve genres', details: err });
    
        res.json({ genres: results });
    });
}

exports.getGenreById = async function(req, res){
    const genreId = req.params.id;

  pool.execute('SELECT * FROM genre WHERE id = ?', [genreId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to retrieve genre', details: err });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    res.json({ genre: results[0] });
  });
}

exports.updateGenre = async function(req, res){
    const genreId = req.params.id;
  const { genre } = req.body;

  if (!genre) {
    return res.status(400).json({ error: 'Genre name is required' });
  }

  pool.execute(
    'UPDATE genre SET genre = ? WHERE id = ?',
    [genre, genreId],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to update genre', details: err });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Genre not found' });
      }

      res.json({ message: 'Genre updated successfully' });
    }
  );
}

exports.deleteGenre = async function(req, res){
    const genreId = req.params.id;

  pool.execute('DELETE FROM genre WHERE id = ?', [genreId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete genre', details: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    res.json({ message: 'Genre deleted successfully' });
  });
}