const express = require('express');
const router = express.Router();
const account = require("../Controllers/accountController.js");

var itemRouter = express.Router({strict: true});

//Error Format
// const loginError = (code, message, desc) => {
//     var error = {
//         "Error code": code,
//         "Error message": message,
//         "Error description": desc
//     }
//     return error;
// };

router.post("/register",account.register);

module.exports = router;