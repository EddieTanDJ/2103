const express = require('express');
const { restart } = require('nodemon');
const router = express.Router();
const homepage = require("../Controllers/homepageController.js");

var itemRouter = express.Router({strict: true});
router.use("/:index", itemRouter)

//Route to homepage/index page
router.get("/",homepage.start);

//Route to display recipes results based on search
//router.get("/categories-result",recipe.search);


//Route to the search function on the header
router.post("/search",homepage.search);

// Route to search recipes based on categories
router.post("/getRecipeByCtg",homepage.getRecipeByCtg);

module.exports = router;