const express = require('express');
/*
* Express router is a class which helps us to create router handlers. 
* By router handler it is not just providing routing to our app but also can extend this routing to handle validation, handle 404 or other errors etc.
*/
const router = express.Router();
// Hash and Verify Password
const bcrypt = require("bcrypt");
// To insert, update, delete data from SQL and NoSQL DB for user account
const account = require("app/models/accountModel");
// Share Security Information between clients and server
const jwt = require('jsonwebtoken');
// Secret Key for JWT
const SK = require('../Config/SK.json').SK;
// Authenticate User and handle login session 
const passport = require('passport');
// Enable strict routing. For example: if you have a route /user/id, then /user/id/ will not match.
var itemRouter = express.Router({
    strict: true
});
router.use('/:user', itemRouter);

// Register User
exports.register = async (req, res) => {
    try {
        console.log("HIT CONTROLLER");
        const userDetails = req.body
        console.log(req.body)
        // Check if password and confirm password match.
        if (req.body.password !== req.body.confirmPassword) {
            throw new Error("Password and Confirm Password do not match");
        }
        // Generate salt to hash the password
        const salt =  bcrypt.genSaltSync(10);
        // now we set user password to hashed password
        const password = bcrypt.hashSync(userDetails.password, salt);
        userDetails.password = password;
        
        //Passed request to models to store in DB
        const resultMySQL = await account.registerMySQL(userDetails);
        const resultNoSQL = await account.registerNoSQL(userDetails);

        console.log(resultMySQL);
        res.send(resultMySQL);
    } catch (err) {
        if(err.message == "Password and Confirm Password do not match"){
            console.log(err.message);
            res.status(500).send(err.message);
        }
        else {
            console.log(err.message);
            res.status(401).send(err.message);
        }
    }
}

//Login User
exports.login = async (req, res) => {

    const userDetails = req.body
    console.log("HIT");
    console.log(userDetails);
    // Check if user exists in MySQL DB
    const result = await account.login(userDetails);
    console.log(result);
    // If user exist check if password is correct
    // If use NoSQL for account login, we use result instead of result[0] as it only returns one row of data
    if (result[0]) {
        // Check if the password is correct
        if (bcrypt.compareSync(userDetails.password, result[0].password)) {
            // Create a JSON object to store the user details that is returned from MySQL DB
            let user = {
                id: result[0].id,
                username: result[0].username,
                fname: result[0].fname,
                lname: result[0].lname,
                email: result[0].email
            }
            req.login(user, function (err) {
                console.log(user)
                res.send(user)
            })
        } else {
            res.status(401).send("Wrong Password")
        }
    } else {
        res.status(500).send("Can't find user")
    }

}


//Update User Info
// isSave == true: Update user info in MySQL & NOSQL DB
// isSave == false: Delete user info in MySQL & NOSQL DB
exports.setUserInfo = async (req, res) => {

    const isSave = req.body.isSave;
    const userInfo = req.body;
    console.log(userInfo);
    if (isSave == 'true') {
        try {
            // Generate salt to hash the password
            const salt = await bcrypt.genSaltSync(10);
            // now we set user password to hashed password
            const password = await bcrypt.hashSync(userInfo.pwd, salt);
            userInfo.pwd = password;
            // Update user info in MySQL and NoSQL DB
            const resultMySQL = await account.updateUserInfoMySQL(userInfo);
            const resultNoSQL = await account.updateUserInfoNoSQL(userInfo);
            console.log(resultMySQL);
            console.log(resultNoSQL);
            res.send(resultMySQL);

        } catch (err) {
            console.error(err);
            res.status(500).send(err);

        }

    } else {
        try {
            console.log(userInfo);
            // Delete User Account
            const resultMySQL = await account.deleteUserInfoMySQL(userInfo);
            const resultNoSQL = await account.deleteUserInfoNoSQL(userInfo);
            req.logOut();
            console.log(resultMySQL);
            console.log(resultNoSQL);
            res.send(resultMySQL);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);

        }
    }

}

// Serialize User to store in session when login
passport.serializeUser(function (user, done) {

    done(null, user);
});

// Deserialize User to remove from session when logout
passport.deserializeUser(async function (userDetail, done) {
    // Finish checking for the user info from MySQL DB before deserialize user
    let user = await account.login(userDetail);

    done(null, user);
});