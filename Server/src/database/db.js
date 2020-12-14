const mysql = require('mysql');
const dotenv = require('dotenv')

dotenv.config()

var connection = mysql.createConnection({
    host     : 'localhost',
    database : 'prices',
    user     : 'root',
    //password : process.env.MYSQL_PASSWORD,
});

connection.connect(function(err) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    console.log('Connected as id ' + connection.threadId);
});

module.exports = connection