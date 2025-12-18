import bcrypt from 'bcryptjs';
import { User, ROLES } from '../models/index.js';

const SALT_ROUNDS = 10;

export const sanitizeUser = (userDoc) => {
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

const findUserByEmail = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  return user;
};

export const findUserById = async (id) => User.findById(id);

export const authenticateUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    const error = new Error('INVALID_CREDENTIALS');
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('USER_INACTIVE');
    error.statusCode = 403;
    throw error;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    const error = new Error('INVALID_CREDENTIALS');
    error.statusCode = 401;
    throw error;
  }

  return sanitizeUser(user);
};

export const listUsers = async ({ role, isActive, page = 1, limit = 20 }) => {
  const query = {};

  if (role && ROLES.includes(role)) {
    query.role = role;
  }

  if (typeof isActive === 'boolean') {
    query.isActive = isActive;
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(query),
  ]);

  return {
    items: items.map(sanitizeUser),
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
  };
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    const error = new Error('USER_NOT_FOUND');
    error.statusCode = 404;
    throw error;
  }
  return sanitizeUser(user);
};

export const updateUserById = async (id, payload) => {
  const updates = {};

  if (payload.role) {
    if (!ROLES.includes(payload.role)) {
      const error = new Error('INVALID_ROLE');
      error.statusCode = 400;
      throw error;
    }
    updates.role = payload.role;
  }

  if (typeof payload.isActive === 'boolean') {
    updates.isActive = payload.isActive;
  }

  if (payload.email) {
    updates.email = payload.email.trim().toLowerCase();
  }

  const user = await User.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true },
  );

  if (!user) {
    const error = new Error('USER_NOT_FOUND');
    error.statusCode = 404;
    throw error;
  }

  return sanitizeUser(user);
};

export const softDeleteUserById = async (id) => {
  const user = await User.findByIdAndUpdate(
    id,
    { $set: { isActive: false } },
    { new: true },
  );

  if (!user) {
    const error = new Error('USER_NOT_FOUND');
    error.statusCode = 404;
    throw error;
  }

  return sanitizeUser(user);
};