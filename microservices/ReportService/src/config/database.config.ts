import dotenv from 'dotenv';
import { createPool } from 'mysql2/promise';

dotenv.config();

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_CONNECTION_LIMIT,
  DB_AUTH_NAME,
  DB_PET_NAME,
  DB_CATALOG_NAME,
  DB_INVENTORY_NAME,
  DB_APPOINTMENT_NAME,
  DB_MEDICAL_RECORD_NAME,
} = process.env;

if (!DB_HOST || !DB_USER) {
  throw new Error('Database configuration is missing required environment variables.');
}

function requireDatabaseName(value: string | undefined, envName: string): string {
  if (!value) {
    throw new Error(`Missing ${envName}.`);
  }

  if (!/^[A-Za-z0-9_]+$/.test(value)) {
    throw new Error(`${envName} contains invalid characters.`);
  }

  return value;
}

export const databases = {
  auth: requireDatabaseName(DB_AUTH_NAME, 'DB_AUTH_NAME'),
  pet: requireDatabaseName(DB_PET_NAME, 'DB_PET_NAME'),
  catalog: requireDatabaseName(DB_CATALOG_NAME, 'DB_CATALOG_NAME'),
  inventory: requireDatabaseName(DB_INVENTORY_NAME, 'DB_INVENTORY_NAME'),
  appointment: requireDatabaseName(DB_APPOINTMENT_NAME, 'DB_APPOINTMENT_NAME'),
  medicalRecord: requireDatabaseName(DB_MEDICAL_RECORD_NAME, 'DB_MEDICAL_RECORD_NAME'),
};

export const qualifyTable = (databaseName: string, tableName: string): string => {
  return `\`${databaseName}\`.\`${tableName}\``;
};

const pool = createPool({
  host: DB_HOST,
  port: DB_PORT ? Number(DB_PORT) : 3306,
  user: DB_USER,
  password: DB_PASSWORD ?? '',
  connectionLimit: DB_CONNECTION_LIMIT ? Number(DB_CONNECTION_LIMIT) : 10,
});

export default pool;
