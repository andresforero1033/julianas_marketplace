import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import config from './config/env.js';
import registerRoutes from './routes/index.js';

const app = express();

// Core middlewares shared across all routes
app.use(cors({ origin: config.client.url, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

registerRoutes(app);

export default app;
