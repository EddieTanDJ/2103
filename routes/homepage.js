const express = require('express');
const { restart } = require('nodemon');
const router = express.Router();
const homepage = require("../Controllers/homepageController.js");

var itemRouter = express.Router({strict: true});
router.use("/:index", itemRouter)

//Route to homepage/index page
router.get("/",homepage.start);

//Route to the search function on the header
router.post("/search",homepage.search);



module.exports = router;