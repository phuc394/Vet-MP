const MAX_USER_FIELD_LENGTH = 100;
const MIN_PASSWORD_LENGTH = 8;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{9}$/;

const isString = (value: any): value is string =>
  typeof value === "string";

const validatePassword = (
  password: any,
  fieldName = "Password"
) => {
  if (!password) {
    return `${fieldName} is required`;
  }

  if (!isString(password)) {
    return `${fieldName} must be a string`;
  }

  if (!password.trim()) {
    return `${fieldName} cannot be empty`;
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `${fieldName} must be at least 8 characters`;
  }

  return null;
};

const validateEmailValue = (
  email: any
) => {
  if (!email) {
    return "Email is required";
  }

  if (!isString(email)) {
    return "Email must be a string";
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return "Email cannot be empty";
  }

  if (normalizedEmail.length > MAX_USER_FIELD_LENGTH) {
    return "Email cannot exceed 100 characters";
  }

  if (!emailRegex.test(normalizedEmail)) {
    return "Invalid email format";
  }

  return null;
};

export const validateRegister = (
  body: any
) => {
  const {
    full_name,
    email,
    phone_number,
    password,
  } = body ?? {};

  if (!full_name || !email || !phone_number || !password) {
    return "All fields are required";
  }

  if (
    !isString(full_name) ||
    !isString(email) ||
    !isString(phone_number) ||
    !isString(password)
  ) {
    return "All fields must be strings";
  }

  if(!full_name.trim()){
    return "Full name cannot be empty";
  }
  
  if(full_name.trim().length > MAX_USER_FIELD_LENGTH){
    return "Full name cannot exceed 100 characters";
  }

  const emailError = validateEmailValue(email);

  if (emailError) {
    return emailError;
  }

  const normalizedPhone = phone_number.trim();
  if (!phoneRegex.test(normalizedPhone)) {
    return "Invalid phone number format";
  }

  const passwordError = validatePassword(password);

  if (passwordError) {
    return passwordError;
  }

  return null;
};

export const validateLogin = (
  body: any
) => {
  const { identifier, password } = body ?? {};

  if (!identifier || !password) {
    return "Identifier and password are required";
  }

  if(typeof identifier !== "string" || typeof password !== "string") {
    return "Identifier and password must be strings";
  }

  if(!identifier.trim()) {
    return "Identifier cannot be empty";
  }

  if(!password.trim()) {
    return "Password cannot be empty";
  }

  return null;
};

export const validateForgotPassword = (
  body: any
) => {
  const { email } = body ?? {};

  return validateEmailValue(email);
};

export const validateResetPassword = (
  body: any
) => {
  const {
    token,
    newPassword,
  } = body ?? {};

  if (!token || !newPassword) {
    return "Token and new password are required";
  }

  if (!isString(token) || !isString(newPassword)) {
    return "Token and new password must be strings";
  }

  if (!token.trim()) {
    return "Token cannot be empty";
  }

  const passwordError = validatePassword(
    newPassword,
    "New password"
  );

  if (passwordError) {
    return passwordError;
  }

  return null;
};

export const validateChangePassword = (
  body: any
) => {
  const {
    currentPassword,
    newPassword,
  } = body ?? {};

  if (!currentPassword || !newPassword) {
    return "Current password and new password are required";
  }

  if (
    !isString(currentPassword) ||
    !isString(newPassword)
  ) {
    return "Current password and new password must be strings";
  }

  if (!currentPassword.trim()) {
    return "Current password cannot be empty";
  }

  const passwordError = validatePassword(
    newPassword,
    "New password"
  );

  if (passwordError) {
    return passwordError;
  }

  return null;
};

export const validateRefreshToken = (
  refreshToken: any
) => {
  if (!refreshToken) {
    return "Refresh token is required";
  }

  if (!isString(refreshToken)) {
    return "Refresh token must be a string";
  }

  if (!refreshToken.trim()) {
    return "Refresh token cannot be empty";
  }

  return null;
};
