import db from "../config/db"; // File này nên trả về pool của thư viện 'mysql2/promise'
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { User } from "./user.model"; // Import interface User bạn đã định nghĩa trước đó

// 1. Thêm kiểu dữ liệu cho các tham số đầu vào: userId (number), token (string), expiredAt (Date)
const saveResetToken = async (
  userId: number,
  token: string,
  expiredAt: Date
): Promise<void> => {
  const sql = `
    UPDATE Users
    SET
      reset_token_hash = ?,
      reset_token_expired = ?,
      reset_token_used = FALSE
    WHERE user_id = ?
  `;

  // Update trả về kiểu ResultSetHeader
  await db.execute<ResultSetHeader>(sql, [token, expiredAt, userId]);
};

const findUserByEmail= async (email: string): Promise<User | null> => {
    const sql = `SELECT * FROM Users WHERE LOWER(email) = LOWER(?)`;
    
    // Ép kiểu RowDataPacket[] để TypeScript hiểu kết quả trả về là một mảng dòng dữ liệu
    const [rows] = await db.execute<RowDataPacket[]>(sql, [email]);
    
    if (rows.length === 0) return null;
    
    // Ép kiểu dòng đầu tiên về interface User (Bây giờ đã có đủ các trường reset_token)
    return rows[0] as User;
  };

// 2. Thêm kiểu RowDataPacket[] để TypeScript hiểu 'rows' là một mảng dữ liệu có thể chứa User
const findUserByResetToken = async (
  token: string
): Promise<User | null> => {
  const sql = `
    SELECT *
   FROM Users
    WHERE reset_token_hash = ?
  `;

  // Ép kiểu RowDataPacket[] vào hàm execute giúp giải quyết lỗi "Property '0' does not exist..."
  const [rows] = await db.execute<RowDataPacket[]>(sql, [token]);

  if (rows.length === 0) return null;

  // Ép kiểu bản ghi đầu tiên về interface User của bạn
  return rows[0] as User;
};

// 3. Thêm kiểu dữ liệu number cho userId
const clearResetToken = async (
  userId: number
): Promise<void> => {
  const sql = `
    UPDATE Users
    SET
      reset_token_hash = NULL,
      reset_token_expired = NULL,
      reset_token_used = TRUE
    WHERE user_id = ?
  `;

  await db.execute<ResultSetHeader>(sql, [userId]);
};
 const updatePassword = async (
    userId: number,
    hashedPassword: string
  ): Promise<void> => {
    const sql = `
      UPDATE Users
      SET password_hash = ?
      WHERE user_id = ?
    `;

    // Vì đây là câu lệnh UPDATE nên chúng ta ép kiểu <ResultSetHeader>
    await db.execute<ResultSetHeader>(sql, [hashedPassword, userId]);
  };

  const findUserPasswordById = async (
  userId: number
): Promise<any> => {
  const [rows]: any = await db.query(
    `
      SELECT user_id, password_hash
      FROM Users
      WHERE user_id = ?
    `,
    [userId]
  );

  return rows[0] || null;
};



export default {saveResetToken,findUserByResetToken,clearResetToken, findUserByEmail, updatePassword,findUserPasswordById}