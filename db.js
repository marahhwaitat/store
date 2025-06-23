const mysql = require ('mysql2')
const mysql = require('mysql2');

const mySqlpool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Omar123$',         
  database: 'database'
})     
 module.exports =mySqlpool;
