const homepage = require("../Models/recipeModel");


//Get User Details
exports.search = async (req, res) => {
    
    res.render('search-result');
}
