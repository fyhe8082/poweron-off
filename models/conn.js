var mysql = require('mysql');
var conn = mysql.createConnection({
    host: '192.168.99.86',
    user: 'root',
    password: '12345',
    database: 'machine',
    port: 3306
});
module.exports = conn;
