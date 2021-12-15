const homepage = require("../Models/homepageModel");


//Get User Details
exports.search = async (req, res) => {
    var user = null;
    if(req.isAuthenticated) user = req.user;
    const result = await homepage.search(req.body);
    console.log("After NoSQL")
    result["user"] = user;
    res.send(result)
}

//Start the index
exports.start = async (req, res) => {

    var user = null;
    if(req.isAuthenticated) user = req.user;

    const headerCtg = await homepage.headerCtgImproved();
    // img1 = headerCtg[0].image.split(", ")[0];
    // img2 = headerCtg[1].image.split(", ")[0];
    // img3 = headerCtg[2].image.split(", ")[0];

    // imgName1 = headerCtg[0].categories;
    // imgName2 = headerCtg[1].categories;
    // imgName3 = headerCtg[2].categories;

    // Get the first Image
    for (let j = 0; j < headerCtg.length; j++) {
        headerCtg[j].image = headerCtg[j].image.split(', ')[0];
    }


    const popularRecipe = await homepage.popularRecipe();
    console.log(popularRecipe);
    for (let i = 0; i < popularRecipe.length; i++) {
        popularRecipe[i].image = popularRecipe[i].image.split(', ')[0];
    }

    const featuredRecipe = await homepage.featuredRecipe();


    res.render("../views/index", {
        // img1: img1,
        // img2: img2,
        // img3: img3,

        // imgName1: imgName1,
        // imgName2: imgName2,
        // imgName3: imgName3,
        categoryImage : headerCtg,

        popularRecipe: popularRecipe,
        featuredRecipe: featuredRecipe,
        user: user
    });
}