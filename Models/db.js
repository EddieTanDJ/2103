const mysql = require("mysql");
const MongoDb = require("mongodb").MongoClient;
const dbConfig = require("../Config/db.config");

// Create a connection to the database

const mySqlConnection = mysql.createConnection({
  
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});


const mongoDb = new MongoDb(dbConfig.URL);
mongoDb.connect().then(value => {
  console.log("Connected to MongoDB")
}).catch(err =>{
  console.log(err)
})




module.exports = {
  mySqlConnection: mySqlConnection,
  mongoConnection: mongoDb.db('EzRecipe')
};
