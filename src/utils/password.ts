import { compare, hash } from 'bcrypt';

export const createHashedPassword = async (
  password: string,
): Promise<string> => {
  const saltOrRounds = 10;
  return hash(password, saltOrRounds);
};

export const validatePassword = async (
  loginPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await compare(loginPassword, hashedPassword);
};
