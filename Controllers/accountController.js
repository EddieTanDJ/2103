const bcrypt = require("bcrypt");
const { restart } = require("nodemon");
const account = require("../models/accountModel");
// Register User
exports.register = async (req,res)=>{
    try{
        const userDetails = req.body
        console.log(req.body)
    
        const salt = await bcrypt.genSaltSync(10);
        // now we set user password to hashed password
        const password = await bcrypt.hashSync(userDetails.password, salt);
        userDetails.password = password;

        const result = await account.register(userDetails);
        console.log(result);
        res.send(result);
    } catch(err) {
        console.error(err);
        res.status(500).send(err);
        
    }
    
}

// Login User
// // exports.post('/login',async(req,res)=>{
// //     const userDetails = req.body
// //     userDetailsAftQuery = []
// //     console.log(req.body)

// //     sql.execute('SELECT * from users where email = ? ', [userDetails.email], (err,result) => {
// //         if(err){
// //             res.send(err);
// //         }else{
// //             userDetailsAftQuery = result
// //             if(result = null){
// //                 res.send("Wrong email");
// //             }
// //             else{
// //                 if (bcrypt.compareSync(userDetails.password, userDetailsAftQuery[0].password)) {
// //                     res.send("Sucessful Login");
// //                 }
// //                 else{
// //                     var error = new Error('Invalid Credentials')
// //                     res.send(hashedPassword);
// //                 }
// //             }
// //         }
// //     })
    
// })