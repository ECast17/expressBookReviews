const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username || password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. You can now login chief" });
        }
        else {
            return res.status(404).json({ message: "User already exists" });
        }
    }
    return res.status(404).json({ message: "Unable to register user" });
});

// Get the book list available in the shop | Exercise 2 1. - Practice Lab
public_users.get('/', function (req, res) {
    let getBooksPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 1000);
    });
    // using the promise to send the response
    getBooksPromise.then((books) => {
        res.send(JSON.stringify(books, null, 4));
    }).catch((error) => {
        res.status(500).send('Error retrieving book data');
    });
});

// Get book details based on ISBN
// plus using a promise 
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    let getisbnPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(isbn);
        }, 1000);
    });
    // using promise to send response
    getisbnPromise.then((isbn) => {
        res.send(books[isbn]);
    }).catch((error) => {
        res.status(500).send('Error retrieving book details thru ISBN');
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let filtered_authors = books.filter((books) => books.author === author);
    res.send(filtered_authors);
});

// Get all books based on title
// added Promise callback
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let filtered_title = books.filter((books) => books.title === title);

    let getBookByTitlePromise = new Promise((resolve, reject) => {
        setTimeout(() => {
        if (filtered_title.length > 0) {
                resolve(filtered_title);
            } 
            else {
            reject(new Error(`No book found with title ${title}`));
                }
        }, 1000);
    });
    // activating promise to send response
    getBookByTitlePromise.then((filtered_title) => {
        res.send(filtered_title);
    }).catch((error) => {
        res.status(500).send(`Error retrieving book by ${error.message}`);
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let filtered_review = books.filter((books) => books.isbn === isbn);
    res.send(filtered_review);
});

module.exports.general = public_users;
