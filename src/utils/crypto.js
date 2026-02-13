import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const createHash = (passwordPlain) => {
  return bcrypt.hashSync(passwordPlain, bcrypt.genSaltSync(SALT_ROUNDS));
};

export const isValidPassword = (user, passwordPlain) => {
  return bcrypt.compareSync(passwordPlain, user.password);
};

