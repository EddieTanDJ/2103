const bcrypt = require("bcrypt")
const sql=require('./db');

const account = function (account){
    this.name = account.name;
    this.email = account.email;
    this.password = account.password;
};

account.register = (account) => {
    return new Promise((resolve, reject) => {
    
        sql.query('INSERT INTO users (name,email,password) VALUES ( ?, ?, ?)', [account.name,account.email,account.password], (err,result) => {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })
}

module.exports = account;