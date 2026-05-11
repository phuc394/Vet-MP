const validateUpdateProfile = (
  body: any
) => {
  if (
    body.email ||
    body.phone_number
  ) {
    return "Email and phone number cannot be updated";
  }

  return null;
};

export default {
  validateUpdateProfile,
};