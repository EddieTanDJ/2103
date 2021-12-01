const express = require('express');
const router = express.Router();


router.get("/",(req,res)=> {
<<<<<<< Updated upstream
    res.send("hit");
});
=======
    res.render('recipes');
})

router.post("/details",recipe.details);

router.get("/search-result",recipe.search);
>>>>>>> Stashed changes

module.exports = router;