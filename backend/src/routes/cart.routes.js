import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getCartController,
  addCartItemController,
  updateCartItemController,
  removeCartItemController,
  clearCartController,
  validateCartStockController,
} from '../controllers/index.js';
import { validateRequest, requireAuth } from '../middlewares/index.js';

const router = Router();
router.use(requireAuth);

router.get('/', getCartController);
router.post('/validate', validateCartStockController);

router.post(
  '/items',
  validateRequest([
    body('productId').isMongoId().withMessage('productId es obligatorio.'),
    body('variantId').optional().isMongoId().withMessage('variantId debe ser un ObjectId válido.'),
    body('quantity').isInt({ min: 1 }).withMessage('quantity debe ser >= 1.').toInt(),
  ]),
  addCartItemController,
);

router.patch(
  '/items/:itemId',
  validateRequest([
    param('itemId').isMongoId().withMessage('itemId inválido.'),
    body('quantity').isInt({ min: 1 }).withMessage('quantity debe ser >= 1.').toInt(),
  ]),
  updateCartItemController,
);

router.delete(
  '/items/:itemId',
  validateRequest([param('itemId').isMongoId().withMessage('itemId inválido.')]),
  removeCartItemController,
);

router.post('/clear', clearCartController);

export default router;
