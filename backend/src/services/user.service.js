import bcrypt from 'bcryptjs';
import { User, ROLES } from '../models/index.js';

const SALT_ROUNDS = 10;

const sanitizeUser = (userDoc) => {
  if (!userDoc) return null;
  const user = userDoc.toObject({ versionKey: false });
  delete user.password;
  return user;
};

export const createUser = async ({ email, password, role = 'compradora' }) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (!ROLES.includes(role)) {
    const error = new Error('INVALID_ROLE');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error('EMAIL_IN_USE');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    email: normalizedEmail,
    password: hashedPassword,
    role,
  });

  return sanitizeUser(user);
};

export const findUserByEmail = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  return user;
};
*** End of File