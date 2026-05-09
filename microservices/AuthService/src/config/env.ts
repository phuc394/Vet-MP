import dotenv from "dotenv";

dotenv.config();

const env = {
  PORT: process.env.PORT || 3000,

  DB_HOST: process.env.DB_HOST! ,
  DB_USER: process.env.DB_USER!  ,
  DB_PASSWORD: process.env.DB_PASSWORD! ,
  DB_NAME: process.env.DB_NAME! ,

  ACCESS_TOKEN_SECRET:
    process.env.ACCESS_TOKEN_SECRET! ,

  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET! ,

  ACCESS_TOKEN_EXPIRES_IN: "15m" as const,
  REFRESH_TOKEN_EXPIRES_IN: "7d" as const,
};

export default env;