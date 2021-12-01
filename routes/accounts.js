const express = require('express');
const { restart } = require('nodemon');
const router = express.Router();
const account = require("../Controllers/accountController.js");
const passport = require('passport');

var itemRouter = express.Router({strict: true});
var user = null;

// check authentication before can access the route
const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/accounts');
    } else {
        next();
    }
}

// Get request (load) register view
router.get("/register",(req,res)=>{
    res.render('register', {err1:'', user:req.user})
});

// Post request to add new user, logic in Controller (Register new user into DB)
router.post("/register",account.register);

// Post request to authenticate login
router.post("/login",account.login);

// Get request to load login view
router.get("/",(req,res)=>{
    res.render('login', {user:req.user})
});

// Get request to load user details view 
// param authCheck, to check if the user login
router.get("/userDetails", authCheck ,(req,res)=>{
    res.render('user-detail', {user: req.user})
});

// Post request user info to the DB (Update user details)
router.post("/userDetails",account.setUserInfo);

// Get request log user out from the system and redirect to home page
router.get("/logout", (req, res) => {
    req.logOut()
    res.redirect("/index")
});


module.exports = router;