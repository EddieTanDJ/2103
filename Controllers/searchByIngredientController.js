const ingredient = require('../Models/searchByIngredientModel');

exports.query = async (req, res) => {
    const noOfIngredients   = req.body.noOfIngredients;
    console.log("Hit Ingredient Model")
    console.log(req.body);
    console.log(noOfIngredients);
    // console.log(noOfIngredients);
    const query = [];
    switch (noOfIngredients) {
        case "1":
            query.push({"ingredient1" : req.body.ingredient1});
            query.push({"ingredient2" : ""});
            query.push({"ingredient3" : ""});
            break;
        case "2":
            query.push({"ingredient1" : req.body.ingredient1});
            query.push({"ingredient2" : req.body.ingredient2});
            query.push({"ingredient3" : ""});
            break;
        case "3":
            query.push({"ingredient1" : req.body.ingredient1});
            query.push({"ingredient2" : req.body.ingredient2});
            query.push({"ingredient3" : req.body.ingredient3});
            break;
        default:
            break;
    }
    // console.log(req.body);
    // console.log("Query" + query);
    // console.log(typeof(query));
    console.log("Query New")
    console.log(query);
    const ingredients = await ingredient.query(query);
    res.send(ingredients); // Access the data from the request                                                                                                                                                                                                                                                                                                                                                                                                                                                       
}
