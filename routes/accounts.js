const express = require('express');
const { restart } = require('nodemon');
const router = express.Router();
const account = require("../Controllers/accountController.js");

var itemRouter = express.Router({strict: true});


router.get("/register",(req,res)=>{
    res.render('register')
});

router.post("/register",account.register);

router.get("/userDetails",account.userDetails);

router.get("/login",account.login);

router.get("/",(req,res)=>{
    res.render('login')
});

module.exports = router;