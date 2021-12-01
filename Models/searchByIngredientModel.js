const DBConnections=require('./db');
const sql = DBConnections.mySqlConnection;

// create ingredient object
const ingredient = function(ingredient){
    this.ingredientname1 = ingredient.ingredient1;
    this.ingredientname2 = ingredient.ingredient2;
    this.ingredientname3 = ingredient.ingredient3;
}

// Query the recipe based on ingredient
ingredient.query = (ingredient) => {
    console.log(ingredient);
    return new Promise((resolve, reject) => {
        sql.query('SELECT r.recipeID, r.aggregatedRating, r.recipeName, r.image, r.description, r.instructions , r.authorID, a.authorName, i.ingredientName, \
        i.ingredientQty from recipe r INNER JOIN ingredient i ON r.recipeID = i.recipeID  INNER JOIN author a ON r.authorID = a.authorID\
        WHERE i.ingredientName LIKE ? AND  i.ingredientName LIKE ? AND i.ingredientName LIKE ?',
        ['%'+ingredient[0].ingredient1 + '%',  '%'+ingredient[1].ingredient2 + '%', '%'+ingredient[2].ingredient3 + '%'], (err, res) => {
            if(err){
                reject(err);
            }
            else {
                resolve(res);
            }
          
        });
    });
}

module.exports = ingredient;
