require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((err) => {
  if (err) {
    console.error("Unable to connect to the database:", err);
  } else {
    console.log('Connected to PlanetScale!');
    console.log("Connection has been established successfully.");
  }

  // Close the connection after logging the status
  connection.end();
});
