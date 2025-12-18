import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  createProductController,
  listProductsController,
  getProductController,
  updateProductController,
  deleteProductController,
  addProductVariantController,
  updateProductVariantController,
  deleteProductVariantController,
  adjustProductStockController,
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
  body('stock')
    .optional()
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
  body('variants')
    .optional()
    .isArray({ max: 50 })
    .withMessage('variants debe ser un arreglo con máximo 50 elementos.'),
  body('variants.*.name')
    .optional()
    .isString()
    .trim()
    .withMessage('Cada variante debe incluir un nombre.'),
  body('variants.*.stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock de la variante debe ser >= 0.')
    .toInt(),
  body('variants.*.price').optional().isFloat({ gt: 0 }).withMessage('El precio de la variante debe ser > 0.').toFloat(),
  body('variants.*.salePrice')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('El precio en oferta de la variante debe ser > 0.')
    .toFloat(),
  body('variants.*.sku').optional().isString().trim().withMessage('El SKU de la variante debe ser texto.'),
  body('variants.*.images')
    .optional()
    .isArray({ max: 5 })
    .withMessage('Cada variante puede tener máximo 5 imágenes.'),
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
const variantIdValidation = [param('variantId').isMongoId().withMessage('El ID de la variante no es válido.')];

const singleVariantValidations = ({ requireName = false } = {}) => [
  (requireName ? body('name').exists() : body('name').optional())
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage('El nombre de la variante debe tener al menos 2 caracteres.'),
  body('sku').optional().isString().trim().withMessage('El SKU debe ser texto.'),
  body('color').optional().isString().trim().withMessage('color debe ser texto.'),
  body('size').optional().isString().trim().withMessage('size debe ser texto.'),
  body('price').optional().isFloat({ gt: 0 }).withMessage('price debe ser > 0.').toFloat(),
  body('salePrice').optional().isFloat({ gt: 0 }).withMessage('salePrice debe ser > 0.').toFloat(),
  body('stock').optional().isInt({ min: 0 }).withMessage('stock debe ser >= 0.').toInt(),
  body('images')
    .optional()
    .isArray({ max: 5 })
    .withMessage('images debe ser un arreglo con máximo 5 elementos.'),
  body('images.*').optional({ nullable: true }).isString().trim().withMessage('Cada imagen debe ser texto.'),
  body('attributes')
    .optional()
    .custom((value) => typeof value === 'object' && !Array.isArray(value))
    .withMessage('attributes debe ser un objeto.'),
  body('isActive').optional().isBoolean().withMessage('isActive debe ser booleano.').toBoolean(),
];

const stockAdjustmentValidations = [
  body('operation').optional().isIn(['set', 'increment']).withMessage('operation debe ser set o increment.'),
  body('quantity').exists().isFloat().withMessage('quantity debe ser numérico.').toFloat(),
  body('variantId').optional().isMongoId().withMessage('variantId debe ser válido.'),
];

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

router.post(
  '/:id/variants',
  ...managedAccess,
  validateRequest([...idValidation, ...singleVariantValidations({ requireName: true })]),
  addProductVariantController,
);

router.patch(
  '/:id/variants/:variantId',
  ...managedAccess,
  validateRequest([...idValidation, ...variantIdValidation, ...singleVariantValidations()]),
  updateProductVariantController,
);

router.delete(
  '/:id/variants/:variantId',
  ...managedAccess,
  validateRequest([...idValidation, ...variantIdValidation]),
  deleteProductVariantController,
);

router.patch(
  '/:id/stock',
  ...managedAccess,
  validateRequest([...idValidation, ...stockAdjustmentValidations]),
  adjustProductStockController,
);

export default router;
