import jwt from 'jsonwebtoken';
import config from '../config/env.js';

export const generateAccessToken = (payload, options = {}) => {
  return jwt.sign(payload, config.security.jwtSecret, {
    expiresIn: config.security.jwtExpiresIn,
    ...options,
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.security.jwtSecret);
};
