import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  JwtPayload,
} from "jsonwebtoken";

import jwtUtil from "../utils/jwt.util";

import pool from "../config/db";

import {
  RowDataPacket,
} from "mysql2";

export interface AuthRequest
  extends Request {
  user?: {
    user_id: number;
    role: string;
  };
}

const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith(
        "Bearer "
      )
    ) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token =
      authHeader.split(" ")[1];

    const decoded =
      (await jwtUtil.verifyAccessToken(
        token!
      )) as JwtPayload & {
        user_id: number;
        role: string;
      };

    const [rows] =
      await pool.execute<
        RowDataPacket[]
      >(
        `
        SELECT status
        FROM Users
        WHERE user_id = ?
        `,
        [decoded.user_id]
      );

    const users =
      rows as {
        status: string;
      }[];

    if (
      users.length === 0
    ) {
      return res.status(401).json({
        success: false,
        message:
          "User not found",
      });
    }

    if (
      users[0]!.status ===
      "inactive"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Account inactive",
      });
    }

    req.user = {
      user_id:
        decoded.user_id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid token",
    });
  }
};

export default authenticate;