const express = require('express');
const { restart } = require('nodemon');
const router = express.Router();
const homepage = require("../Controllers/homepageController.js");

var itemRouter = express.Router({strict: true});
router.use("/:index", itemRouter)


router.get("/",homepage.start);

router.post("/search",homepage.search);



module.exports = router;