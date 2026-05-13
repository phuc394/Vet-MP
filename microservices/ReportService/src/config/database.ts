import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123456",
    insecureAuth: true,
    database: "appointment_db_vet",
});

export default pool;
