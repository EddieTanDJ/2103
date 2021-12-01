const express = require('express');
const router = express.Router();
const recipe = require("../Controllers/recipeController.js");


router.get("/",(req,res)=> {

    res.render('recipes');
})


router.post("/details",recipe.details);

router.get("/search-result",recipe.search);


router.post("/",recipe.comment_post);
router.post("/update",recipe.comment_update);
router.post("/delete",recipe.comment_delete);

module.exports = router;