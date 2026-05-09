export const validateRegister = (
  body: any
) => {
  const {
    full_name,
    email,
    phone_number,
    password,
  } = body;

  if (
    !full_name ||
    !email ||
    !phone_number ||
    !password
  ) {
    return "All fields are required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  return null;
};

export const validateLogin = (
  body: any
) => {
  const { identifier, password } = body;

  if (!identifier || !password) {
    return "Identifier and password are required";
  }

  return null;
};