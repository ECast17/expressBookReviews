const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// a user-defined as middleware to intercept the requests and ensure the session is valid
app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

// Exercise 1 5. from Practice Lab
app.use("/customer/auth/*", function auth(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
    }
    return res.status(200).send("User successfully logged in");
    } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });

}});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
