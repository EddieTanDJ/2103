const DBConnections = require('./db');
const sql = DBConnections.mySqlConnection;
const mongo = DBConnections.mongoConnection;


const recipe = function (recipe){
    this.recipeID = recipe.recipeID;
    this.recipeName = recipe.recipeName;
    this.authorID = recipe.authorID;
    this.authorName = recipe.authorName;
    this.datePublished = recipe.datePublished;
    this.description = recipe.description;
    this.categories = recipe.categories;
    this.keywords = recipe.keywords;
    this.aggregatedRating = recipe.aggregatedRating;
    this.reviewCount = recipe.reviewCount;
    this.servings = recipe.servings;
    this.instructions = recipe.instructions;
    this.reviewID = recipe.reviewID;
    this.reviewAuthorID = recipe.reviewAuthorID;
    this.reviewAuthorName = recipe.name;
    this.rating = recipe.rate;
    this.reviewDesc = recipe.comment;
    this.flag = recipe.flag;
};

//Get recipe details 
recipe.details = (body) => {
    return new Promise((resolve, reject) => {
        mongo.collection("Recipe_Nutrition_Ingredient_Duration").aggregate([{

            $lookup: {
                from: "Recipe_Review",
                localField: "recipeID",
                foreignField: "recipeID",
                as: "RecipeDetails"
            }

        }, {
            $match: {
                recipeID: parseInt(body.recipeID)
            }
        }
        ]).toArray((err, result) => {
            if (err) {
                reject(err)
            }
            else {
                console.log(result)
                resolve(result)
            }
        })
    })
}

/**___________________ START OF INSERTION FOR NEW COMMENT ____________________*/
/** Getting maximum reviewID's value, Increment by 1 */
recipe.comment_id = () => {
    return new Promise((resolve, reject) => {

        mongo.collection("Recipe_Review").find().project(
            {reviewID:1, _id:0}).sort({reviewID:-1}).limit(1).toArray((err, result) => {
                if(err){
                    reject(err);
                }else{
                    if (result) resolve(result[0].reviewID+1);
                    else resolve(0);
                    
                }
        });
    });
}
/** Inserting required informations for new comment creation */
recipe.comment_insert = (recipe) => {
    return new Promise((resolve, reject) => {

        var commentObj = {
            recipeID: recipe.recipeID,
            recipeName: recipe.recipeName,
            authorID: recipe.authorID,
            authorName: recipe.authorName,
            datePublished: recipe.datePublished,
            description: recipe.description,
            categories: recipe.categories,
            keywords: recipe.keywords,
            aggregatedRating: recipe.aggregatedRating,
            reviewCount: recipe.reviewCount,
            servings: recipe.servings,
            instructions: recipe.instructions,
            reviewID: recipe.reviewID,
            reviewAuthorID: recipe.reviewAuthorID,
            reviewAuthorName: recipe.reviewAuthorName,
            rating: recipe.rating,
            reviewDesc: recipe.reviewDesc,
            dateSubmitted: new Date().toISOString().replace('T', ' ').substr(0, 19),
            dateModified: new Date().toISOString().replace('T', ' ').substr(0, 19)
        };
        mongo.collection("Recipe_Review").insertOne(
            commentObj,(err,result) =>{
            if (err){
                reject(err);
            }
            else{
                resolve(result);
            }
        });
    })
}
/** ACTTIVATE AFTER NEW INSERTION AND DELETION OF COMMENT
 *  Calculate and Update total aggregatedRating and reviewCount
 */
recipe.comment_aggregate_update = (recipe) => {
    return new Promise((resolve, reject) => {

        var addORminus = recipe.flag==1?1:-1;
        var addORminus_rating = recipe.flag==1?recipe.rating:-recipe.rating;

        mongo.collection("Recipe_Nutrition_Ingredient_Duration").aggregate(
        [
            { $match: { recipeID:parseInt(recipe.recipeID) } },
            { $group: {
                _id: "$recipeID",
                aggregatedRating: {
                    $sum: {
                        "$add": [
                            { "$ifNull": [ { $multiply: [ "$aggregatedRating", "$reviewCount" ] }, 0 ] },
                            { "$ifNull": [ addORminus_rating, 0 ] }
                        ]
                    }
                },
                reviewCount: {
                    $sum: {
                        "$add": [
                            { "$ifNull": [ "$reviewCount", 0 ] },
                            { "$ifNull": [ addORminus, 0 ] }
                        ]
                    }
                }
            }},
            {
                $project: {
                    _id: 0,
                    reviewCount:  1,
                    aggregatedRating: { $round: [ { $divide: ["$aggregatedRating", "$reviewCount"] }, 1 ] }
                }
            }                                                             
        ]).toArray((err, result) => {
            if (err){
                reject(err);
            }
            else{
                try {
                    mongo.collection("Recipe_Review").updateMany(
                        { recipeID: recipe.recipeID },
                        { $set: result[0] },(err,result) => {
                        if (err){
                            reject(err);
                        }
                        else{
                            resolve(result);
                        }
                    });
                } catch (err) {
                    reject(err);
                }
                try {
                    mongo.collection("Recipe_Nutrition_Ingredient_Duration").updateOne(
                        { recipeID: recipe.recipeID },
                        { $set: result[0] },(err,result) =>{
                        if (err){
                            reject(err);
                        }
                        else{
                            resolve(result);
                        }
                    });
                } catch (err) {
                    reject(err);
                }
            }
        });
    })
}
/**_____________________ END OF INSERTION FOR NEW COMMENT ____________________*/


/**_______________ START OF UPDATES FOR MODIFICATION OF COMMENT ______________*/
/** Updating any changes on recipe's rating or comment */
recipe.comment_update = (recipe) => {
    return new Promise((resolve, reject) => {

        mongo.collection("Recipe_Review").aggregate(
        [
            { $match: { "reviewID": recipe.reviewID }},
            { $project: {
                _id: 0,
                prvRating: "$rating",
                notIdentical: {
                    $switch: {
                       branches: [
                          { case: { $ne: ["$rating", recipe.rating] }, then: "rating" },
                          { case: { $ne: ["$reviewDesc", recipe.reviewDesc] }, then: "reviewDesc" },
                          { case: { $and: [{$ne: ["$rating", recipe.rating] }, { $ne: ["$reviewDesc", recipe.reviewDesc]}] }, then: "both" },
                          { case: { $and: [{$eq: ["$rating", recipe.rating] }, { $eq: ["$reviewDesc", recipe.reviewDesc]}] }, then: "none" }
                       ],
                       default: "noMatch"
                    }
                }
            }}
        ]).toArray((err, result) => {
            if (err){
                reject(err);
            }
            else{
                if (!(result[0].notIdentical == "none")) {
                    var updateObj = {
                        rating: recipe.rating,
                        reviewDesc: recipe.reviewDesc,
                        dateModified: new Date().toISOString().replace('T', ' ').substr(0, 19)
                    };

                    try {
                        mongo.collection("Recipe_Review").updateOne(
                            { reviewID: recipe.reviewID },
                            { $set: updateObj},(err,result) => {
                            if (err){
                                reject(err);
                            }
                            else{
                                console.log(result);
                            }
                        });
                        
                    } catch (err) {
                        reject(err);
                    }
                }
                resolve(result);
            }
        });
    })
}
/** ACTTIVATE AFTER UPDATES ON MODIFICATION OF COMMENT
 *  Calculate and Update total aggregatedRating
 */
recipe.comment_update_avgRating = (recipe) => {
    return new Promise((resolve, reject) => {

        mongo.collection("Recipe_Review").aggregate(
        [
            { $match: { reviewID: recipe.reviewID } },
            { $group: {
                _id: "$recipeID",
                aggregatedRating: {
                    $sum: {"$add": [
                        { "$ifNull": [ { $multiply: [ "$aggregatedRating", "$reviewCount" ] }, 0 ] },
                        { "$ifNull": [ -recipe.rating, 0 ] },
                        { "$ifNull": [ "$rating", 0 ] }
                    ]}
                },
                reviewCount: { $sum: { "$ifNull": ["$reviewCount", 0] } }
            }},
            { $project: {
                _id: 1,
                aggregatedRating: {
                    $round: [ { $divide: ["$aggregatedRating", "$reviewCount"] }, 1 ]
                }
            }}
        ]).toArray((err, result) => {
                if (err){
                    console.log(err, " err again");
                }
                else{
                    console.log(result[0].aggregatedRating);
                    try {
                        mongo.collection("Recipe_Review").updateMany(
                            { reviewID: recipe.reviewID },
                            { $set: { aggregatedRating: result[0].aggregatedRating } },(err,result) => {
                            if (err){
                                reject(err);
                            }
                            else{
                                resolve(result);
                            }
                        });
                    } catch (err) {
                        reject(err);
                    }
                    try {
                        mongo.collection("Recipe_Nutrition_Ingredient_Duration").updateOne(
                            { recipeID: result[0]._id },
                            { $set: { aggregatedRating: result[0].aggregatedRating } },(err,result) =>{
                            if (err){
                                reject(err);
                            }
                            else{
                                resolve(result);
                            }
                        });
                    } catch (err) {
                        reject(err);
                    }
                }
        });
    })
}
/**________________ END OF UPDATES FOR MODIFICATION OF COMMENT _______________*/


/**__________________ START OF DELETION FOR EXISTING COMMENT _________________*/
/** Deleting comment based on seleted review by reviewID */
recipe.comment_delete = (recipe) => {
    return new Promise((resolve, reject) => {
        try {
            mongo.collection("Recipe_Review").deleteOne(
                { reviewID:recipe.reviewID },(err,result) =>{
                    if (err){
                        reject(err);
                    }
                    else{
                        resolve(result);
                    }
            });
        } catch (err) {
            reject(err);
        }
    })
}
/** Getting required information for the
 *  calculation of aggregatedRating (recipe.comment_aggregate_update)
 *  after comment deletion
 */
recipe.comment_get_one = (recipe) => {
    return new Promise((resolve, reject) => {
        
        mongo.collection("Recipe_Review").find({reviewID:recipe.reviewID}).project(
            {_id: 0, reviewID:1, recipeID: 1, rating: 1}).toArray((err, result)=> {
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
        });
    })
}
/**_______________ END OF UPDATES FOR MODIFICATION OF COMMENTS _______________*/


module.exports = recipe;
