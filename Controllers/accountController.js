const bcrypt = require("bcrypt");
const account = require("../models/accountModel");
const jwt = require('jsonwebtoken');
const SK = require('../Config/SK.json').SK;

// Register User
exports.register = async (req, res) => {
    try {
        const userDetails = req.body
        console.log(req.body)

        const salt = await bcrypt.genSaltSync(10);
        // now we set user password to hashed password
        const password = await bcrypt.hashSync(userDetails.password, salt);
        userDetails.password = password;

        const resultMySQL = await account.registerMySQL(userDetails);
        const resultNoSQL = await account.registerNoSQL(userDetails);
        console.log(resultMySQL);
        console.log(resultNoSQL);
        res.send(resultMySQL);

    } catch (err) {
        console.error(err);
        res.status(500).send(err);

    }

}

//Login User
exports.login = async (req, res) => {

    const userDetails = req.body
    console.log(req.body)

    const result = await account.login(userDetails);

    if (result[0]) {

        if (bcrypt.compareSync(userDetails.password, result[0].password)) {
            let token = jwt.sign(userDetails,SK, {expiresIn: "24hr"});
            let payload = {
                    userDetails:{
                        id: result[0].id,
                        fname: result[0].fname,
                        lname: result[0].lname,
                        email: result[0].email
                    }, token
            }
            res.render("login",payload)
        }
        else {
            res.status(401).send("Unauthorized")
        }
    }
    else {
        res.status(401).send("Can't find user")
    }

}



//Get User Details
exports.userDetails = async (req, res) => {
    
}

