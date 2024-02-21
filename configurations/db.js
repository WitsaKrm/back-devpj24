const { Sequelize } = require("sequelize");
const config = require("./config");
require('dotenv').config()

const DB = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.pwd,
  {
    host: config.db.host,
    port: config.db.Port,
    dialect: config.db.type,
    logging: config.db.logging,
  }
);

DB
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");

  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = DB;