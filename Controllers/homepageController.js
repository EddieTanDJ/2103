const homepage = require("../Models/homepageModel.js");


//Get User Details
exports.search = async (req, res) => {
    
    const result = await homepage.search(req.body);
}

