module.exports = {
    // MYSQL CONFIG
    HOST: "ict2102assignment.ccgtxure9gnm.us-east-2.rds.amazonaws.com",
    USER: process.env.dbUser,
    PASSWORD: process.env.dbPassword,
    // MONGO CONFIG
    DB: "EzRecipe",
    URL: "mongodb+srv://Ivan:ICT2103NOSQL@ict2103.zjqsz.mongodb.net/ICT2103?retryWrites=true&w=majority"
  };