const {
  validateLogin,
  validateRegister,
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

  it("requires login identifier and password", () => {
    expect(validateLogin({ identifier: "user@example.com" })).toBe(
      "Identifier and password are required",
    );
  });
});
