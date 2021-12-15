const DBConnections=require('./db');
const sql = DBConnections.mySqlConnection;
const mongo = DBConnections.mongoConnection;


const searchQuery = function (searchQuery){
    this.search = search;
};

// Header search function
searchQuery.search = (searchQuery) => {
    return new Promise((resolve, reject) => {
        console.log("Hit Model");
        console.log(searchQuery.search);
        mongo.collection("Recipe_Nutrition_Ingredient_Duration").find({
            recipeName: {$regex: '.*' + searchQuery.search + '.*',$options: 'i'}
        }).toArray((err,result)=>{
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        });
    })
}

// Get recipes for the Categories improved
searchQuery.headerCtgImproved = () =>{
    return new Promise((resolve, reject) => {
        // Mongoose Query extract top record from each group
        mongo.collection("Recipe_Nutrition_Ingredient_Duration").aggregate([
            {
                $match: {image: {$ne: null }}
            },
                {$group:{
                    _id: "$categories", 
                    categories : {$first: "$categories"},
                    image : {$first: "$image"},
                    count: {$sum : 1}
                }
            },
            {$sort: {count: -1}},
            {$limit: 10}
        ]).toArray((err,result)=>{
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}

//Get recipes for Categories 
searchQuery.headerCtg = () =>{
    return new Promise((resolve,reject) =>{
        mongo.collection("Recipe_Nutrition_Ingredient_Duration").find({
            recipeID:{ $in: [1415,8709,412]}
        }).toArray((err,result)=>{
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}

//Get Popular recipes
searchQuery.popularRecipe = () => {
    return new Promise((resolve,reject) =>{
        mongo.collection("Recipe_Nutrition_Ingredient_Duration").find().sort({
            aggregatedRating : -1,
            reviewCount: -1
        }).limit(4).toArray((err,result) =>{
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}

//Get featured recipes
searchQuery.featuredRecipe = () => {
    return new Promise((resolve, reject) => {
        mongo.collection("Recipe_Nutrition_Ingredient_Duration").find({
            recipeID : {$in: [167,196,310,458]}
        }).limit(4).toArray((err,result)=>{
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}

module.exports = searchQuery;