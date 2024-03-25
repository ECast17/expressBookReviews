const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    }
    else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    if (req.body.isbn) {
        books[req.body.isbn] = {
            "author": req.body.author,
            "title": req.body.title,
            "review": req.body.review,
        }
    }
    res.send("Book review for " + (' ') + (req.body.title) + " has been added");
    // update review based off of isbn num
    const isbn = req.params.isbn;
    let book = books[isbn]
    if (book) { // checking if book exists
        let author = req.body.author;
        let title = req.body.title;
        let review = req.body.review;

        if (author) { // if author is changed, update it 
            book["author"] = author
        }
        if (title) { // if author is changed, update it 
            book["title"] = title
        }
        if (review) { // if author is changed, update it 
            book["review"] = review
        }

        books[isbn] = book;
        res.send('Friend with isbn code ${isbn} updated.');
    }
    else {
        res.send("Unable to find review");
    }
});
// Filter & delete the reviews based on the session username 
// so that a user can delete only his / her reviews and not other users
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.params.username;
    const isbn = req.params.isbn;

    if (books[isbn]) { // checks if a book with the given isbn is there
        if (books[isbn].reviews[username]) { // checks if the user has a review for the book
            delete books[isbn].reviews[username];

            res.send(`Book review by user ${username} for book ${isbn} is deleted`);
        }
        else {
            res.status(404).send(`Review not found for user ${username}`);
        }
    }
    else {
        res.status(404).send('Book not found');
    }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
