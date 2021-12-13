// Import mysql
const mysql = require("mysql");
// Import mongo client
const MongoDb = require("mongodb").MongoClient;
// Importing the config file
const dbConfig = require("../Config/db.config");

// Create a connection to the SQL database
const mySqlConnection = mysql.createConnection({
  
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

//Create a connection to the mongoDB
/*
* .then is a promise function A promise is an object that may produce a single value some time in the future: 
either a resolved value, or reject/error value.
*/
const mongoDb = new MongoDb(dbConfig.URL);
mongoDb.connect().then(value => {
  console.log("Connected1 to MongoDB")
}).catch(err =>{
  console.log(err)
})


module.exports = {
  mySqlConnection: mySqlConnection,
  // Select the Database
  mongoConnection: mongoDb.db('EzRecipe')
};
