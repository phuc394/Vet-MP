import {
  RowDataPacket,
} from "mysql2";

import pool from "../config/db";

import {
  ProfileResponse,
  UpdateProfileInput,
} from "../models/profile.model";

const getMyProfile = async (
  userId: number
) => {
  const [rows] =
    await pool.execute<
      (ProfileResponse &
        RowDataPacket)[]
    >(
      `
      SELECT
        user_id,
        full_name,
        email,
        phone_number,
        role,
        status,
        avatar,
        address
      FROM Users
      WHERE user_id = ?
      `,
      [userId]
    );

  if (rows.length === 0) {
    throw new Error(
      "User not found"
    );
  }

  return rows[0]!;
};

const updateMyProfile = async (
  userId: number,
  data: UpdateProfileInput
) => {
  const {
    full_name,
    avatar,
    address,
  } = data;

  await pool.execute(
    `
    UPDATE Users
    SET
      full_name = COALESCE(
        ?,
        full_name
      ),
      avatar = COALESCE(
        ?,
        avatar
      ),
      address = COALESCE(
        ?,
        address
      )
    WHERE user_id = ?
    `,
    [
      full_name || null,
      avatar || null,
      address || null,
      userId,
    ]
  );

  return {
    message:
      "Update profile successful",
  };
};

export default {
  getMyProfile,
  updateMyProfile,
};