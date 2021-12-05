const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const account = require("../models/accountModel");
const jwt = require('jsonwebtoken');
const SK = require('../Config/SK.json').SK;
const passport = require('passport');
var itemRouter = express.Router({
    strict: true
});
router.use('/:user', itemRouter);

// Register User
exports.register = async (req, res) => {
    try {
        const userDetails = req.body
        console.log(req.body)

        // Generate salt to hash the password
        const salt =  bcrypt.genSaltSync(10);
        // now we set user password to hashed password
        const password = bcrypt.hashSync(userDetails.password, salt);
        userDetails.password = password;
        
        //Passed request to models to store in DB
        const resultMySQL = await account.registerMySQL(userDetails);
        const resultNoSQL = await account.registerNoSQL(userDetails);

        console.log(resultMySQL);
        console.log(resultNoSQL);
        res.send(resultMySQL);


    } catch (err) {
        console.error(err);
        res.status(401).send(err);

    }

}

//Login User
exports.login = async (req, res) => {

    const userDetails = req.body

    const result = await account.login(userDetails);

    if (result[0]) {

        if (bcrypt.compareSync(userDetails.password, result[0].password)) {
            // Create a JSON object to store
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
exports.setUserInfo = async (req, res) => {

    const isSave = req.body.isSave;
    const userInfo = req.body;

    if (isSave == 'true') {
        try {
            const salt = await bcrypt.genSaltSync(10);
            // now we set user password to hashed password
            const password = await bcrypt.hashSync(userInfo.pwd, salt);
            userInfo.pwd = password;

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
                        console.log("HIT");
            console.log(userInfo);

            const resultMySQL = await account.deleteUserInfoMySQL(userInfo);
            const resultNoSQL = await account.deleteUserInfoNoSQL(userInfo);
                req.logOut()

            res.send(resultMySQL);

        } catch (err) {
            console.error(err);
            res.status(500).send(err);

        }
    }

}

// Serialize User
passport.serializeUser(function (user, done) {

    done(null, user);
});

// Deserialize User
passport.deserializeUser(async function (userDetail, done) {
    let user = await account.login(userDetail);

    done(null, user);
});