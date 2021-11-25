const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const passport = require('passport');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

//Setting up the Environment
const port = process.env.PORT;
const host = process.env.HOST;
app.use(cors());

//Set view engine load an ejs file
app.set("view engine","ejs");
app.use(express.static(__dirname + "/views"));

//Setting up account route
var accounts = require('./routes/accounts');
app.use('/accounts', accounts);

//Setting up recipes route
var recipes = require('./routes/recipes.js');
app.use('/recipes', recipes);

//Setting up homepage routes
var homepage = require('./routes/homepage');
app.use("/index",homepage);

var searchByIngredients = require('./routes/searchByIngredients');
app.use("/searchByIngredients",searchByIngredients);

// var recipesDetail = require('./routes/recipes');
// app.use("/recipe-detail")

app.listen(port,host, () => {
  // print a message when the server starts listening
  console.log("server starting on " + host + ":" + port);
});