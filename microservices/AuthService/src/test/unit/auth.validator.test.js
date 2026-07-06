const {
  validateChangePassword,
  validateForgotPassword,
  validateLogin,
  validateRegister,
  validateRefreshToken,
  validateResetPassword,
} = require("../../validators/auth.validator");

describe("auth validators", () => {
  it("requires all register fields", () => {
    expect(validateRegister({ email: "user@example.com" })).toBe(
      "All fields are required",
    );
  });

  it("rejects short register passwords", () => {
    expect(validateRegister({
      full_name: "User",
      email: "user@example.com",
      phone_number: "0900000000",
      password: "secret",
    })).toBe("Password must be at least 8 characters");
  });

  it("accepts valid register payloads", () => {
    expect(validateRegister({
      full_name: "User",
      email: "user@example.com",
      phone_number: "0900000000",
      password: "secret123",
    })).toBeNull();
  });

  it("rejects non-string register fields before trimming", () => {
    expect(validateRegister({
      full_name: "User",
      email: "user@example.com",
      phone_number: 900000000,
      password: "secret123",
    })).toBe("All fields must be strings");
  });

  it("rejects register emails longer than the users schema", () => {
    expect(validateRegister({
      full_name: "User",
      email: `${"a".repeat(90)}@example.com`,
      phone_number: "0900000000",
      password: "secret123",
    })).toBe("Email cannot exceed 100 characters");
  });

  it("requires login identifier and password", () => {
    expect(validateLogin({ identifier: "user@example.com" })).toBe(
      "Identifier and password are required",
    );
  });

  it("rejects missing login body", () => {
    expect(validateLogin(undefined)).toBe(
      "Identifier and password are required",
    );
  });

  it("validates forgot password email", () => {
    expect(validateForgotPassword({ email: "bad-email" })).toBe(
      "Invalid email format",
    );
  });

  it("validates reset password payloads", () => {
    expect(validateResetPassword({
      token: "abc",
      newPassword: "short",
    })).toBe("New password must be at least 8 characters");
  });

  it("validates change password payloads", () => {
    expect(validateChangePassword({
      currentPassword: "oldpass123",
      newPassword: "        ",
    })).toBe("New password cannot be empty");
  });

  it("validates refresh token values", () => {
    expect(validateRefreshToken("   ")).toBe(
      "Refresh token cannot be empty",
    );
  });
});
