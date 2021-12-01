const express = require('express');
const router = express.Router();
const recipe = require("../Controllers/recipeController.js");


router.get("/",(req,res)=> {

    res.render('recipes');
})


router.post("/details",recipe.details);

router.get("/search-result",recipe.search);


module.exports = router;