const validateCreateStaff = (body: any) => {
  const {
    full_name,
    email,
    phone_number,
    password,
    role,
    position,
  } = body;

  if (
    !full_name ||
    !email ||
    !phone_number ||
    !password ||
    !role ||
    !position
  ) {
    return "All required fields must be provided";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (
    role !== "staff" &&
    role !== "admin"
  ) {
    return "Invalid role";
  }

  return null;
};

const validateUpdateStaff = (body: any) => {
  const {
    full_name,
    position,
    license_number,
  } = body;

  if (
    !full_name &&
    !position &&
    !license_number
  ) {
    return "At least one field is required";
  }

  return null;
};

export default {
  validateCreateStaff,
  validateUpdateStaff,
};