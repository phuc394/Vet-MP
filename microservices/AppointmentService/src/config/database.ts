const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    insecureAuth: true,
    database: 'appointment_db_vet'
});

module.exports = connection;

