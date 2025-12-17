import { Router } from 'express';
import { getHealthStatus } from '../controllers/index.js';

const router = Router();

router.get('/health', getHealthStatus);

const registerRoutes = (app) => {
  app.use('/api', router);
};

export default registerRoutes;
