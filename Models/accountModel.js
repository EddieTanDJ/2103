const DBConnections=require('./db');
const sql = DBConnections.mySqlConnection;
const mongo = DBConnections.mongoConnection;

/*
* Create a account object which contains the following properties:
* name, email, password
*/
const account = function (account){
    this.name = account.name;
    this.email = account.email;
    this.password = account.password;
};

// Insert new user to MySQL database
account.registerMySQL = (account) => {
    return new Promise((resolve, reject) => {
    
        sql.query('INSERT INTO users (username,fname,lname,email,password) VALUES (?, ?, ?, ?,?)', [account.username, account.fname,account.lname,account.email,account.password], (err,result) => {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })

    })
}

// Insert new user to NoSQL database
// => Means function
account.registerNoSQL = (account) => {
    return new Promise((resolve, reject) => {
        // Encapsulate into a JSON object
        var noSQLObj = {
            username: account.username,
            fname: account.fname,
            lname: account.lname,
            email: account.email,
            password: account.password};
        mongo.collection("users").insertOne(
            noSQLObj,(err,result) =>{
            if (err){
                reject(err);
            }
            else{
                resolve(result);
            }
        });

    })
}

// Select all the users base on the input email
account.login = (account) => {
    return new Promise((resolve,reject) => {
        sql.query('SELECT * from users where email = ? ', [account.email], (err,result) => {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })
}


// Update user's password base on the input email into MySQL database
account.updateUserInfoMySQL = (account) => {
    return new Promise((resolve, reject) => {

        sql.query('UPDATE users SET password = ? WHERE email = ?', [account.pwd, account.email], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })

    })
}

// Update user's password base on the input email into NoSQL database
account.updateUserInfoNoSQL = (account) => {
    return new Promise((resolve, reject) => {

        mongo.collection("users").updateOne({
            email: account.email
        }, {
            $set: {
                password: account.pwd
            }
        }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });

    })
}

// Delete user from MySQL database
account.deleteUserInfoMySQL = (account) => {
    return new Promise((resolve, reject) => {

        sql.query('DELETE FROM users WHERE email = ?', [account.email], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })

    })
}

// Delete user from NoSQL database
account.deleteUserInfoNoSQL = (account) => {
    return new Promise((resolve, reject) => {

        mongo.collection("users").deleteOne({
            email: account.email
        }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });

    })
}

// Export the account object. It will be used in other files. 
module.exports = account;