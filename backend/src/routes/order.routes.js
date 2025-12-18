import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  createOrderController,
  listOrdersController,
  getOrderController,
} from '../controllers/index.js';
import { validateRequest, requireAuth, authorizeRoles } from '../middlewares/index.js';

const router = Router();
router.use(requireAuth);

const shippingValidations = [
  body('shippingAddress').notEmpty().withMessage('Debes proporcionar la dirección de envío.'),
  body('shippingAddress.recipientName')
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage('recipientName debe tener al menos 3 caracteres.'),
  body('shippingAddress.street')
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage('street debe tener al menos 3 caracteres.'),
  body('shippingAddress.city').isString().trim().withMessage('city es obligatorio.'),
  body('shippingAddress.country').isString().trim().withMessage('country es obligatorio.'),
  body('shippingAddress.phone').optional().isString().trim().withMessage('phone debe ser texto.'),
  body('shippingAddress.state').optional().isString().trim().withMessage('state debe ser texto.'),
  body('shippingAddress.postalCode').optional().isString().trim().withMessage('postalCode debe ser texto.'),
  body('shippingAddress.notes').optional().isString().trim().withMessage('notes debe ser texto.'),
];

const paymentValidations = [
  body('paymentMethod')
    .optional()
    .isObject()
    .withMessage('paymentMethod debe ser un objeto.')
    .custom((value) => value !== null)
    .withMessage('paymentMethod no puede ser null.'),
  body('paymentMethod.type').optional().isString().trim().withMessage('paymentMethod.type debe ser texto.'),
  body('paymentMethod.provider')
    .optional()
    .isString()
    .trim()
    .withMessage('paymentMethod.provider debe ser texto.'),
  body('paymentMethod.reference')
    .optional()
    .isString()
    .trim()
    .withMessage('paymentMethod.reference debe ser texto.'),
];

const paginationValidations = [
  query('page').optional().isInt({ min: 1 }).withMessage('page debe ser >= 1.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit debe estar entre 1 y 100.'),
];

router.post(
  '/',
  authorizeRoles('compradora', 'admin'),
  validateRequest([
    ...shippingValidations,
    ...paymentValidations,
    body('shippingCost').optional().isFloat({ min: 0 }).withMessage('shippingCost debe ser >= 0.').toFloat(),
    body('notes').optional().isString().trim().isLength({ max: 500 }).withMessage('notes debe tener max 500 caracteres.'),
  ]),
  createOrderController,
);

router.get('/', validateRequest(paginationValidations), listOrdersController);

router.get('/:id', validateRequest([param('id').isMongoId().withMessage('El ID del pedido es inválido.')]), getOrderController);

export default router;
