import dotenv from "dotenv";

dotenv.config();

function requireEnv(envName: string): string {
  const value = process.env[envName];

  if (!value) {
    throw new Error(`Missing ${envName}`);
  }

  return value;
}

const env = {
  PORT: process.env.PORT || 3001,

  DB_HOST: requireEnv("DB_HOST"),
  DB_PORT: Number(process.env.DB_PORT ?? 3306),
  DB_USER: requireEnv("DB_USER"),
  DB_PASSWORD: process.env.DB_PASSWORD ?? "",
  DB_NAME: requireEnv("DB_NAME"),
  DB_CONNECTION_LIMIT: Number(process.env.DB_CONNECTION_LIMIT ?? 10),

  ACCESS_TOKEN_SECRET: requireEnv("ACCESS_TOKEN_SECRET"),

  REFRESH_TOKEN_SECRET: requireEnv("REFRESH_TOKEN_SECRET"),

  ACCESS_TOKEN_EXPIRES_IN: "15m" as const,
  REFRESH_TOKEN_EXPIRES_IN: "7d" as const,
};

export default env;
