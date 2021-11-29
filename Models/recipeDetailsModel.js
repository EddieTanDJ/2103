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

// function currentDate() {
//     let dateObj = new Date();
//     // adjust 0 before single digit date
//     let date = ("0" + dateObj.getDate()).slice(-2);
//     let month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
//     let year = dateObj.getFullYear();
//     let hours = dateObj.getHours();
//     let minutes = dateObj.getMinutes();
//     let seconds = dateObj.getSeconds();
//     // return date & time in YYYY-MM-DD HH:MM:SS format
//     return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
// };


recipe.details = (recipe) => {
    return new Promise((resolve, reject) => {
        
        mongo.collection("Recipe_Nutrition_Ingredient_Duration").find(
            {recipeID:recipe.recipeID}).toArray(function(err, result) {
            // if (err) throw err;
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
            console.log(result);    //for testing
        });
    })
}

recipe.comment_get = (recipe) => {
    return new Promise((resolve, reject) => {
        
        mongo.collection("Recipe_Review").find(
            {recipeID:recipe.recipeID}).toArray(function(err, result) {
            // if (err) throw err;
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
            console.log(result);    //for testing
        });
    })
}

//  SQLLL
recipe.comment_id = (recipe) => {
    return new Promise((resolve, reject) => {

        mongo.collection("Recipe_Review").find().project(
            {reviewID:1, _id:0}).sort({reviewID:-1}).limit(1).toArray((err, result) => {
                // if (err) throw err;
                if(err){
                    reject(err);
                }else{
                    if (result) resolve(result[0].reviewID+1);
                    else resolve(0);
                    
                }
        });
    });
}

//  SQLLL
recipe.comment_insert = (recipe) => {
    return new Promise((resolve, reject) => {

        // let dateObj = new Date();
        // // adjust 0 before single digit date
        // let date = ("0" + dateObj.getDate()).slice(-2);
        // let month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
        // let year = dateObj.getFullYear();
        // let hours = dateObj.getHours();
        // let minutes = dateObj.getMinutes();
        // let seconds = dateObj.getSeconds();
        // // prints date & time in YYYY-MM-DD HH:MM:SS format
        // let currentDate = `${year}-${month}-${date} ${hours}:${minutes}:${seconds} `;

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

recipe.comment_aggregate_update = (recipe) => {
    return new Promise((resolve, reject) => {

        // update aggrRating, numOfComments in Recipe Table
        // make this as pipeline
        // https://stackoverflow.com/questions/36926618/mongodb-calculating-score-from-existing-fields-and-putting-it-into-a-new-field-i
        // ^ Step 2
        var addORminus = recipe.flag==1?1:-1;

        mongo.collection("Recipe_Nutrition_Ingredient_Duration").aggregate(
        [
            { $match: { recipeID:recipe.recipeID } },
            { $group: {
                _id: "$recipeID",
                aggregatedRating: {
                    // $divide: [{
                    $sum: {
                        "$add": [
                            { "$ifNull": [ { $multiply: [ "$aggregatedRating", "$reviewCount" ] }, 0 ] },
                            { "$ifNull": [ { $multiply: [ addORminus, recipe.rating ] }, 0 ] }
                        ]
                    }
                        // }}, { $inc: {"$reviewCount": 1} }
                    // ]
                }, // ((rating x count) + currRating)/(count+1)
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
                        { $set: result[0] },(err,result) =>{ // result[0] OR to change back { reviewCount: 2, aggregatedRating: 4.5 }
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

/** remove match then it can flush all */
// recipe.comment_aggregate = (recipe) => {
//     return new Promise((resolve, reject) => {

//         // update aggrRating, numOfComments in Recipe Table
//         mongo.collection("review").aggregate([{ $match: { recipeID:recipe.recipeID } },
//         {   $group: {
//                 _id: "$recipeID",
//                 count: { $sum: 1 },
//                 aggregatedRating: {$avg: { $sum: "$rating" }}

//         }}]).toArray((err, result) =>{
//             if (err){
//                 reject(err);
//             }
//             else{
//                 resolve(result);
                
//             }
//         });
//     })
// }

//  SQLLL
recipe.comment_update = (recipe) => {
    return new Promise((resolve, reject) => {

        mongo.collection("Recipe_Review").aggregate(
        [
            { $match: { "reviewID": recipe.reviewID }},
            { $project: {
                _id: 0,
                // identical: {
                //     $and: [{
                //         $eq: ["$rating", recipe.rating]
                //     }, {
                //         $eq: ["$reviewDesc", recipe.reviewDesc]
                //     }]
                // },
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
                            { $set: updateObj},(err,result) => {        //,{ upsert: true }
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
                // update aggrRating
        });
    })
}

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
        ]).toArray((err, result) => {       // ,{ upsert: true }
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
                            { $set: { aggregatedRating: result[0].aggregatedRating } },(err,result) =>{ // result[0] OR to change back { reviewCount: 2, aggregatedRating: 4.5 }
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


//  SQLLL
recipe.comment_delete = (recipe) => {
    return new Promise((resolve, reject) => {
        try {
            mongo.collection("Recipe_Review").deleteOne(
                { reviewID:recipe.reviewID },(err,result) =>{   //later change back to reviewID:recipe.reviewID   reviewDesc:recipe.reviewDesc
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

// recipe.comment_aggregate_delete = (recipe) => {
//     return new Promise((resolve, reject) => {

//         mongo.collection("Recipe_Nutrition_Ingredient_Duration").aggregate(
//             [
//                 { $match: { recipeID:recipe.recipeID } },
//                 { $group: {
//                     _id: "$recipeID",
//                     aggregatedRating: {
//                             $sum: {
//                                 "$add": [
//                                     { "$ifNull": [ { $multiply: [ "$aggregatedRating", "$reviewCount" ] }, 0 ] },
//                                     { "$ifNull": [ -recipe.rating, 0 ] }
//                                 ]}
//                     }, // ((rating x count) - currRating)/(count-1)
//                     reviewCount: {
//                         $sum: {
//                             "$add": [
//                                 { "$ifNull": [ "$reviewCount", 0 ] },
//                                 { "$ifNull": [ -1, 0 ] }
//                             ]}
//                     }
//                 }},
//                 {
//                     $project: {
//                         _id: 0,
//                         reviewCount:  1,
//                         aggregatedRating: { $round: [ { $divide: ["$aggregatedRating", "$reviewCount"] }, 1 ] }
//                     }
//                 }                                                             
//             ]).toArray((err, result) => {
//                 if (err){
//                     reject(err);
//                 }
//                 else{
//                     console.log(result[0]);
//                     try {
//                         mongo.collection("Recipe_Review").updateMany(
//                             { recipeID: recipe.recipeID },
//                             { $set: result[0]},(err,result) =>{
//                             if (err){
//                                 reject(err);
//                             }
//                             else{
//                                 resolve(result);
//                             }
//                         });
//                     } catch (err) {
//                         reject(err);
//                     }
//                     try {
//                         mongo.collection("Recipe_Nutrition_Ingredient_Duration").updateOne(
//                             { recipeID: recipe.recipeID },
//                             { $set: result[0]},(err,result) =>{ // result[0] OR to change back { reviewCount: 2, aggregatedRating: 4.5 }
//                             if (err){
//                                 reject(err);
//                             }
//                             else{
//                                 resolve(result);
//                             }
//                         });
//                     } catch (err) {
//                         reject(err);
//                     }
//                 }
//             });
//     })
// }


module.exports = recipe;
