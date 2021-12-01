const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require("express-session");
const passport = require("passport");
var cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Setting up the Environment
const port = process.env.PORT;
const host = process.env.HOST;
app.use(cors());

//Set view engine load an ejs file
app.set("view engine","ejs");
app.use(express.static(__dirname + "/views"));

//Initialising Express Session
app.use(
  session({
    secret: process.env.secretSession,
    resave: false,
    saveUninitialized: false,
  })
)

//Initialising passport and session
app.use(passport.initialize());
app.use(passport.session());

//Setting up account route
var accounts = require('./routes/accounts');
app.use('/accounts', accounts);

//Setting up recipes route
var recipes = require('./routes/recipes.js');
app.use('/recipes', recipes);

//Setting up homepage routes
var homepage = require('./routes/homepage');
app.use("/index",homepage);

//Setting up logout route
app.use('/logout',(req,res)=>{
  req.logOut()
  res.render("index",{error:null})
})

var searchByIngredients = require('./routes/searchByIngredients');
app.use("/searchByIngredients",searchByIngredients);

app.listen(port,host, () => {
  // print a message when the server starts listening
  console.log("server starting on " + host + ":" + port);
  
});