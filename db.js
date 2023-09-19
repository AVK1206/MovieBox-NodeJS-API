const { MongoClient } = require('mongodb');

const URL = "mongodb://0.0.0.0:27017/moviebox";
let dbConnection;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(URL)
      .then((client) => {
        console.log('Connected to MongoDB');
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};