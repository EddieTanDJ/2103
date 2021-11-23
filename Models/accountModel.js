const DBConnections=require('./db');
const sql = DBConnections.mySqlConnection;
const mongo = DBConnections.mongoConnection;


const account = function (account){
    this.name = account.name;
    this.email = account.email;
    this.password = account.password;
};

account.registerMySQL = (account) => {
    return new Promise((resolve, reject) => {
    
        sql.query('INSERT INTO users (fname,lname,email,password) VALUES ( ?, ?, ?,?)', [account.fname,account.lname,account.email,account.password], (err,result) => {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })

    })
}

account.registerNoSQL = (account) => {
    return new Promise((resolve, reject) => {
        
        var noSQLObj = {
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

account.login = (account) => {
    return new Promise((resolve,reject) => {
        sql.query('SELECT * from users where email = ? ', [account.email], (err,result) => {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })
        async function findUsers(mongo,resultsLimit){
            const cursor = mongo
                .db('ICT2103')
                .collection('users')
                .find()
                .limit(resultsLimit);
                const results = await cursor.toArray();
                console.log(results);
        }

        
    })
}

module.exports = account;