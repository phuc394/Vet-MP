import bcrypt from "bcrypt";

import {
  RowDataPacket,
  ResultSetHeader,
} from "mysql2";

import pool from "../config/db";

import { User } from "../models/user.model";


import {
  CreateStaffPayload,
  UpdateStaffPayload,
  StaffDetail,
} from "../models/staff.model";

const createStaff = async (
  data: CreateStaffPayload
) => {
  const {
    full_name,
    email,
    phone_number,
    password,
    role,
    position,
    license_number,
  } = data;

  const [existingRows] =
    await pool.execute<
      (User & RowDataPacket)[]
    >(
      `
      SELECT *
      FROM Users
      WHERE email = ?
      OR phone_number = ?
      `,
      [email, phone_number]
    );

  if (existingRows.length > 0) {
    throw new Error(
      "Email or phone already exists"
    );
  }

  const passwordHash =
    await bcrypt.hash(password, 10);

  const connection =
    await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [userResult] =
      await connection.execute<ResultSetHeader>(
        `
        INSERT INTO Users
        (
          full_name,
          email,
          phone_number,
          password_hash,
          role
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          full_name,
          email,
          phone_number,
          passwordHash,
          role,
        ]
      );

    const userId =
      userResult.insertId;

    await connection.execute<ResultSetHeader>(
      `
      INSERT INTO Employee
      (
        user_id,
        position,
        license_number
      )
      VALUES (?, ?, ?)
      `,
      [
        userId,
        position,
        license_number || null,
      ]
    );

    await connection.commit();

    return {
      message:
        "Create staff successful",
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const getAllStaff = async () => {
  const [rows] =
    await pool.execute<
      (StaffDetail & RowDataPacket)[]
    >(
      `
      SELECT
        u.user_id,
        u.full_name,
        u.email,
        u.phone_number,
        u.role,
        u.status,
        e.employee_id,
        e.position,
        e.license_number
      FROM Users u
      INNER JOIN Employee e
      ON u.user_id = e.user_id
      WHERE u.role IN ('staff', 'admin')
      `
    );

  return rows;
};

const getStaffById = async (
  userId: number
) => {
  const [rows] =
    await pool.execute<
      (StaffDetail & RowDataPacket)[]
    >(
      `
      SELECT
        u.user_id,
        u.full_name,
        u.email,
        u.phone_number,
        u.role,
        u.status,
        e.employee_id,
        e.position,
        e.license_number
      FROM Users u
      INNER JOIN Employee e
      ON u.user_id = e.user_id
      WHERE u.user_id = ?
      `,
      [userId]
    );

  if (rows.length === 0) {
    throw new Error(
      "Staff not found"
    );
  }

  return rows[0]!;
};

const updateStaff = async (
  userId: number,
  data: UpdateStaffPayload
) => {
  const {
    full_name,
    position,
    license_number,
  } = data;

  const connection =
    await pool.getConnection();

  try {
    await connection.beginTransaction();

    if (full_name) {
      await connection.execute(
        `
        UPDATE Users
        SET full_name = ?
        WHERE user_id = ?
        `,
        [full_name, userId]
      );
    }

    await connection.execute(
      `
      UPDATE Employee
      SET
        position = COALESCE(
          ?,
          position
        ),
        license_number = COALESCE(
          ?,
          license_number
        )
      WHERE user_id = ?
      `,
      [
        position || null,
        license_number || null,
        userId,
      ]
    );

    await connection.commit();

    return {
      message:
        "Update staff successful",
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const deactivateStaff = async (
  userId: number
) => {
  await pool.execute(
    `
    UPDATE Users
    SET status = 'inactive'
    WHERE user_id = ?
    `,
    [userId]
  );

  await pool.execute(
    `
    DELETE FROM RefreshTokens
    WHERE user_id = ?
    `,
    [userId]
  );

  return {
    message:
      "Deactivate staff successful",
  };
};

export default {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deactivateStaff,
};