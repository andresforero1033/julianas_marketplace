import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  createProductController,
  listProductsController,
  getProductController,
  updateProductController,
  deleteProductController,
} from '../controllers/index.js';
import { validateRequest, requireAuth, authorizeRoles } from '../middlewares/index.js';

const router = Router();
const managedAccess = [requireAuth, authorizeRoles('vendedora', 'admin')];

const productValidations = ({ requireCoreFields = false } = {}) => [
  (requireCoreFields ? body('name').exists() : body('name').optional())
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage('name debe tener al menos 3 caracteres.'),
  (requireCoreFields ? body('description').exists() : body('description').optional())
    .isString()
    .trim()
    .isLength({ min: 10 })
    .withMessage('description debe incluir al menos 10 caracteres.'),
  (requireCoreFields ? body('price').exists() : body('price').optional())
    .isFloat({ gt: 0 })
    .withMessage('price debe ser mayor que 0.')
    .toFloat(),
  (requireCoreFields ? body('stock').exists() : body('stock').optional())
    .isInt({ min: 0 })
    .withMessage('stock debe ser un entero >= 0.')
    .toInt(),
  body('salePrice').optional().isFloat({ gt: 0 }).withMessage('salePrice debe ser mayor que 0.').toFloat(),
  body('images')
    .optional()
    .isArray({ max: 10 })
    .withMessage('images debe ser un arreglo con máximo 10 elementos.'),
  body('images.*')
    .optional({ nullable: true })
    .isString()
    .trim()
    .withMessage('Cada imagen debe ser texto.'),
  body('tags')
    .optional()
    .isArray({ max: 20 })
    .withMessage('tags debe ser un arreglo con máximo 20 elementos.'),
  body('tags.*')
    .optional({ nullable: true })
    .isString()
    .trim()
    .withMessage('Cada tag debe ser texto.'),
  (requireCoreFields ? body('categoryId').exists() : body('categoryId').optional())
    .isMongoId()
    .withMessage('categoryId debe ser un ObjectId válido.'),
  body('vendorId').optional().isMongoId().withMessage('vendorId debe ser un ObjectId válido.'),
  body('slug').optional().isString().trim().isLength({ min: 3 }).withMessage('slug debe tener al menos 3 caracteres.'),
  body('isActive').optional().isBoolean().withMessage('isActive debe ser booleano.').toBoolean(),
  body('isPublished').optional().isBoolean().withMessage('isPublished debe ser booleano.').toBoolean(),
];

const listValidations = [
  query('page').optional().isInt({ min: 1 }).withMessage('page debe ser >= 1.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit debe estar entre 1 y 100.'),
  query('search').optional().isString().withMessage('search debe ser texto.'),
  query('categoryId').optional().isMongoId().withMessage('categoryId debe ser válido.'),
  query('vendorId').optional().isMongoId().withMessage('vendorId debe ser válido.'),
  query('isActive').optional().isBoolean().withMessage('isActive debe ser booleano.').toBoolean(),
  query('isPublished').optional().isBoolean().withMessage('isPublished debe ser booleano.').toBoolean(),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice debe ser >= 0.').toFloat(),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice debe ser >= 0.').toFloat(),
];

const idValidation = [param('id').isMongoId().withMessage('El ID proporcionado no es válido.')];

router.post('/', ...managedAccess, validateRequest(productValidations({ requireCoreFields: true })), createProductController);
router.get('/', validateRequest(listValidations), listProductsController);
router.get('/:id', validateRequest(idValidation), getProductController);
router.patch(
  '/:id',
  ...managedAccess,
  validateRequest([...idValidation, ...productValidations()]),
  updateProductController,
);
router.delete('/:id', ...managedAccess, validateRequest(idValidation), deleteProductController);

export default router;
