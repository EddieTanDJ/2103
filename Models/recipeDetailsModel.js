const { compareSync } = require('bcrypt');
const DBConnections = require('./db');
const sql = DBConnections.mySqlConnection;
const mongo = DBConnections.mongoConnection;

const recipe = function (recipe){
    this.recipeID = recipe.recipeID;
    this.authorID = recipe.authorID;
    this.reviewID = recipe.reviewID;
    this.name = recipe.name;
    this.rating = recipe.rate;
    this.reviewDesc = recipe.comment;
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

//  SQLLL
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

//  SQLLL
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

        mongo.collection("review").find().project(
            {reviewID:1, _id:0}).sort({reviewID:-1}).limit(1).toArray((err, result) => {
                // if (err) throw err;
                if(err){
                    reject(err);
                }else{
                    resolve(result[0].reviewID+1);
                    
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
            reviewID: recipe.reviewID,
            authorID: recipe.authorID,
            recipeID: recipe.recipeID,
            rating: recipe.rating,
            reviewDesc: recipe.reviewDesc,
            dateSubmitted: new Date().toISOString().replace('T', ' ').substr(0, 19),
            dateModified: new Date().toISOString().replace('T', ' ').substr(0, 19)
        };
        mongo.collection("review").insertOne(
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

recipe.comment_aggregate = (recipe) => {
    return new Promise((resolve, reject) => {

        // update aggrRating, numOfComments in Recipe Table
        mongo.collection("Recipe_Review").updateOne(
        [
            { $match: { recipeID:recipe.recipeID } },
            { $group: {
                _id: null,
                aggregatedRating: {
                    $divide: [{
                        $sum: {
                            "$add": [ {
                                $multiply: [ "$aggregatedRating", "$reviewCount" ]}, recipe.rating
                            ]
                        }}, { $inc: {"$reviewCount": 1} }
                    ]
                }, // ((rating x count) + currRating)/(count+1)
                reviewCount: { $inc: {"$reviewCount": 1} },
            }}
        ]).then((err,result) =>{
            if (err){
                reject(err);
            }
            else{
                console.log(result);
            }
        });
    })
}
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

        var updateObj = {
            authorID: recipe.authorID,
            recipeID: recipe.recipeID,
            rating: recipe.rating,
            reviewDesc: recipe.reviewDesc,
            dateModified: new Date().toISOString().replace('T', ' ').substr(0, 19)
        };

        try {
            mongo.collection("review").updateOne(
                { reviewID: recipe.reviewID },
                { $set: updateObj},{ upsert: true },(err,result) =>{
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
        // update aggrRating
    })
}

//  SQLLL
recipe.comment_delete = (recipe) => {
    return new Promise((resolve, reject) => {
        try {
            mongo.collection("review").deleteOne(
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

    // update aggrRating, numOfComments in Recipe Table
}

module.exports = recipe;
