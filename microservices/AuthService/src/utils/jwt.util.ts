import jwt from "jsonwebtoken";
import env from "../config/env";

const generateAccessToken = async (payload: object) => {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  });
};

const generateRefreshToken = async (payload: object) => {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  });
};

const verifyAccessToken = async (token: string) => {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET);
};

const verifyRefreshToken = async (token: string) => {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET);
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};