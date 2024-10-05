const express = require('express');
const bodyParser = require('body-parser');
const { pool, executeSchema } = require('./db');
const authServices = require('./auth/auth_services');
const userServices = require('./services/user');
const genreServices = require('./services/genre');
const bookServices = require('./services/book');
const loanServices = require('./services/loan');
const fineServices = require('./services/fine');
const reservServices = require('./services/reservation')

const app = express();
app.use(bodyParser.json());

// Execute schema on startup
executeSchema();

// User-related routes
app.post('/users/register', (req, res) => {
  authServices.registerUser(req, res); // Register a new user
});

app.post('/users/login', (req, res) => {
  authServices.logInUser(req, res); // User login
});

app.get('/users', (req, res) => {
  userServices.getUsers(req, res); // Get all users
});

app.get('/users/:id', (req, res) => {
  userServices.getUserById(req, res); // Get user by ID
});

app.get('/users/role/:role', (req, res) => {
  userServices.getUserRole(req, res); // Get users by role
});

app.put('/update/users/:id', (req, res) => {
  userServices.updateUserDetails(req, res); // Update user details
});

app.delete('/delete/users/:id', (req, res) => {
  userServices.deleteUser(req, res); // Delete a user
});

// Genre-related routes
app.get('/genres', (req, res) => {
  genreServices.getAllGenre(req, res); // Get all genres
});

app.get('/genres/:id', (req, res) => {
  genreServices.getGenreById(req, res); // Get genre by ID
});

app.post('/genres/new', (req, res) => {
  genreServices.addGenre(req, res); // Add one or more genres
});

app.put('/update/genres/:id', (req, res) => {
  genreServices.updateGenre(req, res); // Update a genre
});

app.delete('/delete/genres/:id', (req, res) => {
  genreServices.deleteGenre(req, res); // Delete a genre
});

// Book-related routes
app.post('/book/new', (req, res) => {
  bookServices.addBook(req, res); // Add a book
});

app.get('/books', (req, res) => {
  bookServices.getBooks(req, res); // Get all books
});

app.get('/book/:id', (req, res) => {
  bookServices.getBookById(req, res); // Get book by ID
});

app.put('/update/book/:id', (req, res) => {
  bookServices.updateBook(req, res); // Update book details
});

app.delete('/delete/book/:id', (req, res) => {
  bookServices.deleteBook(req, res); // Delete a book
});

// Loan-related routes
app.post('/loans/new', (req, res) => {
  loanServices.addLoan(req, res); // Create a new loan
});

app.get('/loans', (req, res) => {
  loanServices.getLoans(req, res); // Get all loans
});

app.get('/loan/:id', (req, res) => {
  loanServices.getLoanById(req, res); // Get loan by ID
});

app.put('/update/loans/:id', (req, res) => {
  loanServices.updateLoan(req, res); // Update loan details
});

app.delete('/delete/loans/:id', (req, res) => {
  loanServices.deleteLoan(req, res); // Delete a loan
});

// Fine-related routes
app.post('/fines/new', (req, res) => {
  fineServices.addFine(req, res); // Add a fine
});

app.get('/fines', (req, res) => {
  fineServices.getFines(req, res); // Get all fines
});

app.get('/fines/:id', (req, res) => {
  fineServices.getFineById(req, res); // Get fine by ID
});

app.put('/fines/:id/pay', (req, res) => {
  fineServices.payFine(req, res); // Pay fine
});

app.put('/update/fines/:id', (req, res) => {
  fineServices.updateFine(req, res); // Update fine
});

app.delete('/delete/fines/:id', (req, res) => {
  fineServices.deleteFine(req, res); // Delete fine
});

// Reservation-related routes
app.post('/reservations/new', (req, res) => {
  reservServices.addReservation(req, res); // Add a reservation
});

app.get('/reservations', (req, res) => {
  reservServices.getReservations(req, res); // Get all reservations
});

app.get('/reservations/:id', (req, res) => {
  reservServices.getReservationById(req, res); // Get reservation by ID
});

app.put('/update/reservations/:id', (req, res) => {
  reservServices.updateReservations(req, res); // Update reservation
});

app.delete('/delete/reservations/:id', (req, res) => {
  reservServices.deleteReservation(req, res); // Delete reservation
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
