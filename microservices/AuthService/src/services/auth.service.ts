import bcrypt from "bcrypt";
import { RowDataPacket, ResultSetHeader } from "mysql2";

import pool from "../config/db";
import jwtUtil from "../utils/jwt.util";

import { User,LoginResponse } from "../models/user.model";
import { RefreshToken } from "../models/refresh-token.model";

const registerCustomer = async (data: {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
}) => {
  const { full_name, email, phone_number, password } = data;

  // Check existing user
  const checkQuery = `
    SELECT *
    FROM Users
    WHERE email = ? OR phone_number = ?
  `;

  const [existingRows] = await pool.execute<RowDataPacket[]>(
    checkQuery,
    [email, phone_number]
  );

  const existingUsers = existingRows as User[];

  if (existingUsers.length > 0) {
    throw new Error("Email or phone number already exists");
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Insert user
  const insertQuery = `
    INSERT INTO Users
    (
      full_name,
      email,
      phone_number,
      password_hash,
      role
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  await pool.execute<ResultSetHeader>(
    insertQuery,
    [
      full_name,
      email,
      phone_number,
      passwordHash,
      "customer",
    ]
  );

  return {
    message: "Register successful",
  };
};

const login = async (data: {
  identifier: string;
  password: string;
}) : Promise<LoginResponse> => {
  const { identifier, password } = data;

  // Determine email or phone
  const isEmail = identifier.includes("@");

  const query = isEmail
    ? `
      SELECT *
      FROM Users
      WHERE email = ?
    `
    : `
      SELECT *
      FROM Users
      WHERE phone_number = ?
    `;

  const [rows] = await pool.execute<RowDataPacket[]>(
    query,
    [identifier]
  );

  const users = rows as User[];

  if (users.length === 0) {
    throw new Error("Invalid credentials");
  }

  const user = users[0]!;

  // Check inactive account
  if (user.status === "inactive") {
    throw new Error("Account is inactive");
  }
  

  // Compare password
  const isMatch = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // JWT payload
  const payload = {
    user_id: user.user_id,
    role: user.role,
  };

  // Generate tokens
  const accessToken =
    await jwtUtil.generateAccessToken(payload);

  const refreshToken =
    await jwtUtil.generateRefreshToken(payload);

  // Save refresh token
  const insertRefreshQuery = `
    INSERT INTO RefreshTokens
    (
      user_id,
      refresh_token,
      expires_at
    )
    VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))
  `;

  await pool.execute<ResultSetHeader>(
    insertRefreshQuery,
    [
      user.user_id,
      refreshToken,
    ]
  );

  return {
    accessToken,
    refreshToken,
    user: {
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
    },
  };
};

const refreshAccessToken = async (
  refreshToken: string
) => {
  // Verify JWT
  const decoded = await jwtUtil.verifyRefreshToken(
    refreshToken
  ) as {
    user_id: number;
    role: string;
  };

  // Check token exists in DB
  const query = `
    SELECT *
    FROM RefreshTokens
    WHERE refresh_token = ?
  `;

  const [rows] = await pool.execute<RowDataPacket[]>(
    query,
    [refreshToken]
  );

  const refreshTokens = rows as RefreshToken[];

  if (refreshTokens.length === 0) {
    throw new Error("Refresh token not found");
  }

  const storedToken = refreshTokens[0]!;

  // Optional expiration check
  const now = new Date();

  if (new Date(storedToken.expires_at) < now) {
    throw new Error("Refresh token expired");
  }

  // Generate new access token
  const newAccessToken =
    await jwtUtil.generateAccessToken({
      user_id: decoded.user_id,
      role: decoded.role,
    });

  return {
    accessToken: newAccessToken,
  };
};

const logout = async (
  refreshToken: string
) => {
  const query = `
    DELETE FROM RefreshTokens
    WHERE refresh_token = ?
  `;

  await pool.execute<ResultSetHeader>(
    query,
    [refreshToken]
  );

  return {
    message: "Logout successful",
  };
};

export default {
  registerCustomer,
  login,
  refreshAccessToken,
  logout,
};