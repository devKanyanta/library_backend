CREATE DATABASE IF NOT EXISTS library_db;

USE library_db;

CREATE TABLE IF NOT EXISTS users(
    id INT NOT NULL UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(100) UNIQUE,
    phone_number VARCHAR(12),
    `role` ENUM('student', 'librarian'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `password` VARCHAR(255),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS student(
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    user_id INT NOT NULL,
    department VARCHAR(255),
    year_of_study INT,
    max_books INT,
    fine_amount INT,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS librarian(
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    user_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS author(
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    nationality VARCHAR(255),
    dob DATE,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS publisher(
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    name VARCHAR(255),
    phone_number VARCHAR(12),
    address VARCHAR(255),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS genre(
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    genre VARCHAR(255),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS book(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255),
    isbn INT UNIQUE,
    publisher_id INT NOT NULL,
    publication_year INT,
    genre_id INT NOT NULL,
    copies_available INT,
    shelf_location VARCHAR(255),
    PRIMARY KEY(id),
    FOREIGN KEY(publisher_id) REFERENCES publisher(id) ON DELETE CASCADE,
    FOREIGN KEY(genre_id) REFERENCES genre(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS loan(
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    book_id INT NOT NULL,
    user_id INT NOT NULL,
    librarian_id INT NOT NULL,
    loan_date DATE,
    due_date DATE,
    return_date DATE,
    PRIMARY KEY(id),
    FOREIGN KEY(book_id) REFERENCES book(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(librarian_id) REFERENCES librarian(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fine(
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    loan_id INT NOT NULL,
    student_id INT NOT NULL,
    amount INT,
    payment_status VARCHAR(255),
    payment_date DATE,
    PRIMARY KEY(id),
    FOREIGN KEY(loan_id) REFERENCES loan(id) ON DELETE CASCADE,
    FOREIGN KEY(student_id) REFERENCES student(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS book_author(
    book_id INT NOT NULL,
    author_id INT NOT NULL,
    FOREIGN KEY(book_id) REFERENCES book(id) ON DELETE CASCADE,
    FOREIGN KEY(author_id) REFERENCES author(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reservation(
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    book_id INT NOT NULL,
    user_id INT NOT NULL,
    librarian_id INT NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(255),
    PRIMARY KEY(id),
    FOREIGN KEY(book_id) REFERENCES book(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(librarian_id) REFERENCES librarian(user_id) ON DELETE CASCADE
);
