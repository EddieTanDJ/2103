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


// const uri = "mongodb+srv://Ivan:Password@123@ict2103.zjqsz.mongodb.net/ICT2103?retryWrites=true&w=majority";
// const mongoDb = MongoDb.connect(uri,function(err,database){
//   if(err){
//     console.log(err)
//   }
// })

const uri = "mongodb+srv://Ivan:Password@123@ict2103.zjqsz.mongodb.net/ICT2103?retryWrites=true&w=majority";
const mongoDb = new MongoDb(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const mongoDBConnection = mongoDb.connect(err => {
  mongoDb.close();
});

 


module.exports = {
  mySqlConnection: mySqlConnection,
  mongo: mongoDBConnection
};
