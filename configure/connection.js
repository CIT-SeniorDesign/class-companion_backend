// Used to establish a connection with a database
const mysql = require('mysql');


let con = mysql.createConnection({
    host: "localhost",
    user: "rs-217",
    password: "$udoPowers37",
    database:'node_app'
  });
  
  // con.connect(function(err) {
  //   if (err) throw err;
  //   console.log("Connected!");

    // Create database
    // con.query("CREATE DATABASE node_app", function (err, result) {
    //   if (err) throw err;
    //   console.log("Database created");

    // Creates a table in database
  //   var sql = "CREATE TABLE users (email VARCHAR(255), password VARCHAR(255),phone_number VARCHAR(20))";
  //   con.query(sql, function (err, result) {
  //     if (err) throw err;
  //     console.log("Table created");
  // });