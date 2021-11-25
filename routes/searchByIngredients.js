const express = require('express');
const router = express.Router();


router.get("/",(req,res)=> {
    res.render('search-by-ingredient');
})


module.exports = router;