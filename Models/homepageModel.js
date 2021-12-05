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

//Get recipes for Categories 
searchQuery.headerCtg = () =>{
    return new Promise((resolve,reject) =>{
        mongo.collection("Recipe_Nutrition_Ingredient_Duration").find({
            recipeID:{ $in: [1415,2710,412]}
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