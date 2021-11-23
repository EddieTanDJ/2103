const express = require('express');
const router = express.Router();
const homepage = require("../Controllers/homepageController.js");

var itemRouter = express.Router({strict: true});



router.get("/",homepage.search);

module.exports = router;