const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    insecureAuth: true,
    database: 'inventory_db_vet'
});

export default connection;
