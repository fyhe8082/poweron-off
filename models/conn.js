var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'seedubuntu',
    database: 'machine',
    port: 3306
});
module.exports = conn;
