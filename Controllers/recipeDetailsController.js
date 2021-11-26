const recipe = require("../Models/recipeDetailsModel.js");

//Get Recipe Details
exports.details = async (req, res) => {
    const detsResult = await recipe.details(req.body);
    const cmtResult = await recipe.comment_get(req.body);

    res.send([detsResult,cmtResult]);
    // res.send(cmtResult);
}

// Post Comment
exports.comment_post = async (req, res) => {
    const cmtIDResult = await recipe.comment_id(req.body);

    if (cmtIDResult) {
        req.body["reviewID"] = cmtIDResult ;
        const insCmtResult = await recipe.comment_insert(req.body);

        if (insCmtResult) {
            const aggrCmtResult = await recipe.comment_aggregate(req.body);
            console.log(aggrCmtResult);
        }

        res.send(insCmtResult);
    }
    else {
        res.send("Some error has occur. Please try again later.");
    }
}

// Update Comment
exports.comment_update = async (req, res) => {
    try{
        const result = await recipe.comment_update(req.body);
        res.send(result);
    } catch(err) {
        res.send(err);
    }
}

exports.comment_delete = async (req, res) => {
    const result = await recipe.comment_delete(req.body);
    res.send(result);
}