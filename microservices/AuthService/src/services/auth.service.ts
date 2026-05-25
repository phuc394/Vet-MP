import bcrypt from "bcrypt";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import crypto from "crypto";
import AuthModel from "../models/auth.model"; 
import transporter from "../config/mailer";

import pool from "../config/db";
import jwtUtil from "../utils/jwt.util";

import { User,LoginResponse } from "../models/user.model";
import { RefreshToken } from "../models/refresh-token.model";
import {ChangePasswordResponse, ForgotPasswordResponse,ResetPasswordResponse} from "../models/auth.type";

const DEMO_ADMIN_EMAIL = "admin@gmail.com";
const DEMO_ADMIN_PASSWORD = "Admin135";
const DEMO_ADMIN_PHONE = "admin-demo";

const ensureDemoAdmin = async () => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `
    SELECT user_id
    FROM Users
    WHERE email = ?
    `,
    [DEMO_ADMIN_EMAIL]
  );

  const passwordHash = await bcrypt.hash(DEMO_ADMIN_PASSWORD, 10);

  if (rows.length === 0) {
    await pool.execute<ResultSetHeader>(
      `
      INSERT INTO Users
      (
        full_name,
        email,
        phone_number,
        password_hash,
        role,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        "Demo Admin",
        DEMO_ADMIN_EMAIL,
        DEMO_ADMIN_PHONE,
        passwordHash,
        "admin",
        "active",
      ]
    );
    return;
  }

  await pool.execute<ResultSetHeader>(
    `
    UPDATE Users
    SET password_hash = ?,
        role = 'admin',
        status = 'active'
    WHERE email = ?
    `,
    [passwordHash, DEMO_ADMIN_EMAIL]
  );
};



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

  await ensureDemoAdmin();

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

  if (
    (user.role === "admin" || user.role === "staff") &&
    user.email !== DEMO_ADMIN_EMAIL
  ) {
    throw new Error("Only the demo admin account can sign in as admin");
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



const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
  // 1. Tìm kiếm user 
  const user = await AuthModel.findUserByEmail(email);

  if (!user) {
    return {
      message: "If the email exists, a reset link has been sent.",
    };
  }

  // 2. Tạo token ngẫu nhiên bảo mật (Opaque Token)
  const rawToken: string = crypto.randomBytes(32).toString("hex");

  // 3. Băm token bằng SHA-256 trước khi lưu vào Database
  const hashedToken: string = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  // 4. Tính toán thời gian hết hạn (5 phút kể từ hiện tại)
  const expiredAt: Date = new Date(Date.now() + 5 * 60 * 1000);

  // 5. Gọi Model để lưu token đã băm vào DB
  await AuthModel.saveResetToken(user.user_id, hashedToken, expiredAt);

  // 6. Tạo đường dẫn gửi tới Client (Cổng 3000 hoặc theo biến môi trường CLIENT_URL của Frontend)
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000"; // có thể chỉnh sửa sau khi mà lên giao diện
  const resetLink = `${clientUrl}/reset-password?token=${rawToken}`;

 
  // Bọc vào try-catch để nếu lỗi cấu hình SMTP Gmail không làm sập (crash) toàn bộ API Auth
  try {
    await transporter.sendMail({
      from: `"PetClinic Security" <${process.env.SMTP_EMAIL}>`,
      to: user.email, // Dùng email chuẩn lấy trực tiếp từ DB ra
      subject: "Reset Password",
      text: `Click this link to reset password:\n\n${resetLink}\n\nThis link expires in 5 minutes.`,
      html: `<p>Bạn đã yêu cầu đặt lại mật khẩu tại PetClinic.</p>
             <p>Vui lòng click vào liên kết sau để thực hiện:</p>
             <p><a href="${resetLink}">Đặt lại mật khẩu</a></p>
             <p>Liên kết này sẽ hết hạn sau <strong>5 phút</strong>.</p>`,
    });
  } catch (mailError) {
    console.error("Lỗi gửi mail SMTP:", mailError);
    throw new Error("Could not send reset password email. Please try again later.");
  }

  return {
    message: "If the email exists, a reset link has been sent.",
  };
};



const resetPassword = async (
  token: string,
  newPassword: string
): Promise<ResetPasswordResponse> => {
  // 1. Băm token nhận được từ client để đối chiếu với DB
  const hashedToken: string = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // 2. Tìm user dựa trên token đã băm (Kết quả trả về là User | null nhờ tầng Model)
  const user: User | null = await AuthModel.findUserByResetToken(hashedToken);

  // 3. Giữ nguyên logic kiểm tra 1: Kiểm tra xem token có tồn tại không
  if (!user) {
    throw new Error("Invalid or expired token");
  }

  // 4. Giữ nguyên logic kiểm tra 2: Kiểm tra xem token đã được dùng chưa
  if (user.reset_token_used) {
    throw new Error("Token already used");
  }

  // 5. Giữ nguyên logic kiểm tra 3: Kiểm tra xem token đã hết hạn chưa
  // TypeScript sẽ hiểu 'user.reset_token_expired' có thể là Date hoặc null (như interface đã định nghĩa),
  // nên ta bọc kiểm tra null hoặc ép kiểu Date để so sánh chuẩn xác.
  if (
    !user.reset_token_expired || 
    new Date(user.reset_token_expired) < new Date()
  ) {
    throw new Error("Token expired");
  }

  // 6. Mã hóa mật khẩu mới
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 7. Cập nhật mật khẩu mới vào DB thông qua Model
  await AuthModel.updatePassword(user.user_id, hashedPassword);

  // 8. Xóa sạch token (clear / invalidate) để đảm bảo không tái sử dụng được nữa
  await AuthModel.clearResetToken(user.user_id);

  return {
    message: "Password reset successful",
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

const changePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<ChangePasswordResponse> => {

  // 1. Lấy password hiện tại
  const user =
    await AuthModel.findUserPasswordById(
      userId
    );

  if (!user) {
    throw new Error("User not found");
  }

  // 2. Compare password cũ
  const isMatch = await bcrypt.compare(
    currentPassword,
    user.password_hash
  );

  if (!isMatch) {
    throw new Error(
      "Current password is incorrect"
    );
  }

  // 3. Không cho trùng password cũ
  const isSamePassword = await bcrypt.compare(
    newPassword,
    user.password_hash
  );

  if (isSamePassword) {
    throw new Error(
      "New password must be different"
    );
  }

  // 4. Hash password mới
  const hashedPassword =
    await bcrypt.hash(newPassword, 10);

  // 5. Update DB
  await AuthModel.updatePassword(
    userId,
    hashedPassword
  );

  return {
    message: "Password changed successfully",
  };
};

export default {
  registerCustomer,
  login,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  changePassword
};
