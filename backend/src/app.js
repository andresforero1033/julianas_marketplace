import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import config from './config/env.js';

const app = express();

// Core middlewares shared across all routes
app.use(cors({ origin: config.client.url, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
