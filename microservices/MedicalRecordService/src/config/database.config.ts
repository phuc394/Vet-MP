import dotenv from 'dotenv';
import { createPool } from 'mysql2/promise';

dotenv.config();

const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_CONNECTION_LIMIT
} = process.env;

if (!DB_HOST || !DB_USER || !DB_NAME) {
    throw new Error('Database configuration is missing required environment variables.');
}

const connection = createPool({
    host: DB_HOST,
    port: DB_PORT ? Number(DB_PORT) : 3306,
    user: DB_USER,
    password: DB_PASSWORD ?? '',
    database: DB_NAME,
    connectionLimit: DB_CONNECTION_LIMIT ? Number(DB_CONNECTION_LIMIT) : 10
});

export default connection;
