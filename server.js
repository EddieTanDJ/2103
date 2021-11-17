const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const passport = require('passport');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

//Setting up the Environment
const port = process.env.PORT;
const host = process.env.HOST;
app.use(cors());

//Setting up account route
var accounts = require('./routes/accounts');
app.use('/accounts', accounts);

//Setting up recipes route
var recipes = require('./routes/recipes.js');
app.use('/recipes', recipes);

//Setting up user detail route
var userDetails = require('./routes/userDetails');
app.use('/userDetails', userDetails);



app.get('/', function (req, res) {
    res.send("Test")
  });

app.listen(port,host, () => {
  // print a message when the server starts listening
  console.log("server starting on " + host + ":" + port);
  
});