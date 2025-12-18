import { Router } from 'express';
import { getHealthStatus } from '../controllers/index.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import buyerRoutes from './buyer.routes.js';
import vendorRoutes from './vendor.routes.js';
import categoryRoutes from './category.routes.js';
import productRoutes from './product.routes.js';

const router = Router();

router.get('/health', getHealthStatus);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/buyer-profiles', buyerRoutes);
router.use('/vendor-profiles', vendorRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);

const registerRoutes = (app) => {
  app.use('/api', router);
};

export default registerRoutes;
