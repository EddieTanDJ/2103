const express = require('express');
const router = express.Router();
const recipe = require("../Controllers/recipeDetailsController.js");

router.get("/",recipe.details);
// router.get("/",recipe.comment_get);

router.post("/",recipe.comment_post);
router.post("/update",recipe.comment_update);
router.delete("/",recipe.comment_delete);

module.exports = router;