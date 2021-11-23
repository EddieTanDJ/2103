const DBConnections=require('./db');
const sql = DBConnections.mySqlConnection;
const mongo = DBConnections.mongo;


const searchQuery = function (searchQuery){
    this.search = search;
};

searchQuery.search = (searchQuery) => {
    return new Promise((resolve, reject) => {
    
        sql.query('SELECT * from EzRecipe where categories = ?', [account.fname,account.lname,account.email,account.password], (err,result) => {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })
}