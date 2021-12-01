const recipe = require("../Models/recipeModel");


//Get User Details
exports.search = async (req, res) => {
    
    res.render('search-result');
}

exports.details =async(req,res) => {
    console.log(req.body);
    const result = await recipe.details(req.body);
    res.send(result)
    
}
