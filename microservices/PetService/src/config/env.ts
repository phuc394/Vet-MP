import dotenv from "dotenv";

dotenv.config();

if (!process.env.SECRET_KEY) {
  throw new Error("Missing SECRET_KEY in .env");
}
if (!process.env.DB_HOST) {
  throw new Error("Missing DB_HOST");
}
if (!process.env.DB_USER) {
  throw new Error("Missing DB_USER");
}
if (!process.env.DB_NAME) {
  throw new Error("Missing DB_NAME");
}

interface EnvConfig {
  SECRET_KEY: string;
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
}

export const env: EnvConfig = {
  SECRET_KEY: process.env.SECRET_KEY as string,

  PORT: Number(process.env.PORT ?? 3002),

  DB_HOST: process.env.DB_HOST as string,

  DB_PORT: Number(process.env.DB_PORT ?? 3306),

  DB_USER: process.env.DB_USER as string,

  DB_PASSWORD: process.env.DB_PASSWORD ?? "",

  DB_NAME: process.env.DB_NAME as string,
};