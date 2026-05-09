import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const hashPassword = async (
  password: string
) => {
  return await bcrypt.hash(
    password,
    SALT_ROUNDS
  );
};

const comparePassword = async (
  password: string,
  hash: string
) => {
  return await bcrypt.compare(
    password,
    hash
  );
};

export default {
  hashPassword,
  comparePassword,
};