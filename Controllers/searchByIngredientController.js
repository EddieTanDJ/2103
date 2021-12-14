const ingredient = require('../Models/searchByIngredientModel');

//Query based on ingredient user entered
exports.query = async (req, res) => {
    const noOfIngredients   = parseInt(req.body.noOfIngredients);
    console.log("Hit Ingredient Model")
    console.log(req.body);
    console.log(noOfIngredients);
    const query = [];
    switch (noOfIngredients) {
        case 1:
            query.push({"ingredient1" : (req.body.ingredient1).toLowerCase()});
            query.push({"ingredient2" : ""});
            query.push({"ingredient3" : ""});
            break;
        case 2:
            query.push({"ingredient1" : (req.body.ingredient1).toLowerCase()});
            query.push({"ingredient2" : (req.body.ingredient2).toLowerCase()});
            query.push({"ingredient3" : ""});
            break;
        case 3:
            query.push({"ingredient1" : (req.body.ingredient1).toLowerCase()});
            query.push({"ingredient2" : (req.body.ingredient2).toLowerCase()});
            query.push({"ingredient3" : (req.body.ingredient1).toLowerCase()});
            break;
        default:
            break;
    }
    console.log("Query New")
    console.log(query);
    const ingredients = await ingredient.query(query);
    res.send(ingredients); // Access the data from the request                                                                                                                                                                                                                                                                                                                                                                                                                                                       
}
