const express = require('express');
const router = express.Router();
const recipe = require("../Controllers/recipeController.js");

//Route to recipes page
router.get("/",(req,res)=> {
    res.render('recipes', {user:req.user});
})

//Route to get recipe details based on recipe ID
router.post("/details",recipe.details);

//Route to display recipes results based on search
router.get("/search-result",recipe.search);

//Route to display recipes results based on categories
router.get("/categories-result",recipe.categories_result);

//Routes to post,update and delete comments
router.post("/",recipe.comment_post);
router.post("/update",recipe.comment_update);
router.post("/delete",recipe.comment_delete);

module.exports = router;