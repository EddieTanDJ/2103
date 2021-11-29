const { comment_update } = require("../Models/recipeDetailsModel.js");
const recipe = require("../Models/recipeDetailsModel.js");

/** QUERY ALL RECIPE DETAILS
 * 
 *  detsResult -   Get all recipes description, instruction, duratoin, etc..
 *  cmtResult -   Get all recipes details for comments related
 * 
 *  Data to get: recipeID
 */
exports.details = async (req, res) => {
    const detsResult = await recipe.details(req.body);
    const cmtResult = await recipe.comment_get(req.body);

    res.send([detsResult,cmtResult]);
    // res.send(cmtResult);
}

/** INSERT COMMENT
 * 
 *  cmtIDResult -   Get max value of reviewID and increment by 1
 *  IF success,
 *      Get required details for table insertion and store into req.body
 *      Insert required details in to database table
 *      IF success,
 *          update the aggregateRating (i.e. total average rating)
 *          and the reviewCount (i.e. total review count)
 * 
 *  Data to get: reviewAuthorID, reviewAuthorName(name),
 *               recipeID, rating(rate), reviewDesc(comment)
 */
exports.comment_post = async (req, res) => {
    
    const cmtIDResult = await recipe.comment_id();

    if (cmtIDResult) {
        req.body["reviewID"] = cmtIDResult;
        
        const detsResult = await recipe.details({"recipeID":req.body.recipeID});
        req.body["recipeName"] = detsResult[0].recipeName;
        req.body["authorID"] = detsResult[0].authorID;
        req.body["authorName"] = detsResult[0].authorName;
        req.body["datePublished"] = detsResult[0].datePublished;
        req.body["description"] = detsResult[0].description;
        req.body["categories"] = detsResult[0].categories;
        req.body["keywords"] = detsResult[0].keywords;
        req.body["aggregatedRating"] = detsResult[0].aggregatedRating;
        req.body["reviewCount"] = detsResult[0].reviewCount;
        req.body["servings"] = detsResult[0].servings;
        req.body["instructions"] = detsResult[0].instructions;

        console.log(req.body); // remove later

        const result = await recipe.comment_insert(req.body);
        console.log(result);
        if (result) {
            req.body["flag"] = 1;
            const aggrUpdResult = await recipe.comment_aggregate_update(req.body);
            console.log(aggrUpdResult);
        }

        res.send(result);
    }
    else {
        res.send("Some error has occur. Please try again later.");
    }
}

/** UPDATE COMMENT
 * 
 *  Update database for any changes in reviews
 *  IF have update (i.e. NOT (none of it is notIdentical)),
 *      IF changes is on rating
 *          update the aggregateRating (i.e. total average rating)
 *      send succuessful message
 *  ELSE
 *      send no changes made
 * 
 *  Data to get: reviewID, rating(rate), reviewDesc(comment)
 */
exports.comment_update = async (req, res) => {
    try{
        const result = await recipe.comment_update(req.body);
        // console.log(!(result[0].notIdentical === "none")+"here");

        if(!(result[0].notIdentical === "none")) {
            console.log(req.body);

            if(result[0].notIdentical === "rating") {
                req.body["rating"] = result[0].prvRating;
                
                const updAvgRatingResult = await recipe.comment_update_avgRating(req.body);
                console.log(updAvgRatingResult,"empty?");
            }
            res.send("Successfully Updated!");
        }
        else res.send("No changes made.");
    } catch(err) {
        res.send(err);
    }
}

/** DELETE COMMENT
 * 
 *  Get review details for calculation (before deleting it)
 *  IF success,
 *      Delete a review by reviewID
 *      IF success,
 *          With review details,
 *          update the aggregateRating (i.e. total average rating)
 *          and the reviewCount (i.e. total review count)
 * 
 *  Data to get: reviewID
 */
exports.comment_delete = async (req, res) => {
    const cmtResult_one = await recipe.comment_get_one(req.body);
    console.log(cmtResult_one[0]);;

    if (cmtResult_one) {

        const result = await recipe.comment_delete(req.body);
        // console.log(req.body)
        try {
            if (result) {
                const body = cmtResult_one[0];
                body["flag"] = -1;
                const aggrDelResult = await recipe.comment_aggregate_update(body);
                console.log(aggrDelResult);
                
                res.send(result);
            }
        } catch (err){
            res.send("No existing data for this comment.");
        }

    }
}