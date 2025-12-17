import dotenv from 'dotenv';

dotenv.config();

const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const config = {
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: toNumber(process.env.PORT, 4000),
  },
  database: {
    uri: requireEnv('MONGODB_URI'),
  },
  security: {
    jwtSecret: requireEnv('JWT_SECRET'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  client: {
    url: process.env.CLIENT_URL || 'http://localhost:5173',
  },
};

export default config;
