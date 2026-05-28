import { ResultSetHeader, RowDataPacket } from "mysql2";

import pool from "../config/db";

import { UserDetail } from "../models/users.model";

const userSelectFields = `
  user_id,
  full_name,
  phone_number,
  email,
  role,
  status,
  avatar,
  address,
  created_at,
  updated_at
`;

const getAllUsers = async () => {
  const [rows] = await pool.execute<
    (UserDetail & RowDataPacket)[]
  >(
    `
    SELECT ${userSelectFields}
    FROM Users
    ORDER BY created_at DESC
    `
  );

  return rows;
};

const getUserById = async (userId: number) => {
  const [rows] = await pool.execute<
    (UserDetail & RowDataPacket)[]
  >(
    `
    SELECT ${userSelectFields}
    FROM Users
    WHERE user_id = ?
    `,
    [userId]
  );

  if (rows.length === 0) {
    throw new Error("User not found");
  }

  return rows[0]!;
};

const searchUsers = async (keyword: string) => {
  const searchKeyword = `%${keyword.trim().toLowerCase()}%`;

  const [rows] = await pool.execute<
    (UserDetail & RowDataPacket)[]
  >(
    `
    SELECT ${userSelectFields}
    FROM Users
    WHERE LOWER(full_name) LIKE ?
    OR LOWER(email) LIKE ?
    OR LOWER(phone_number) LIKE ?
    OR LOWER(role) LIKE ?
    OR LOWER(status) LIKE ?
    ORDER BY created_at DESC
    `,
    [
      searchKeyword,
      searchKeyword,
      searchKeyword,
      searchKeyword,
      searchKeyword,
    ]
  );

  return rows;
};

const deleteInactiveUser = async (userId: number) => {
  const user = await getUserById(userId);

  if (user.status !== "inactive") {
    throw new Error(
      "Only inactive users can be deleted"
    );
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute<ResultSetHeader>(
      `
      DELETE FROM RefreshTokens
      WHERE user_id = ?
      `,
      [userId]
    );

    await connection.execute<ResultSetHeader>(
      `
      DELETE FROM Employee
      WHERE user_id = ?
      `,
      [userId]
    );

    await connection.execute<ResultSetHeader>(
      `
      DELETE FROM Users
      WHERE user_id = ?
      AND status = 'inactive'
      `,
      [userId]
    );

    await connection.commit();

    return {
      message: "Delete user successful",
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export default {
  getAllUsers,
  getUserById,
  searchUsers,
  deleteInactiveUser,
};

