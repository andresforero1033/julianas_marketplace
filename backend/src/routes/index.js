import { Router } from 'express';
import { getHealthStatus } from '../controllers/index.js';
import authRoutes from './auth.routes.js';

const router = Router();

router.get('/health', getHealthStatus);
router.use('/auth', authRoutes);

const registerRoutes = (app) => {
  app.use('/api', router);
};

export default registerRoutes;
