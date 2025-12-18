import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  createCategoryController,
  listCategoriesController,
  getCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from '../controllers/index.js';
import { validateRequest, requireAuth, authorizeRoles } from '../middlewares/index.js';

const router = Router();
const adminOnly = [requireAuth, authorizeRoles('admin')];

const categoryValidations = ({ requireName = false } = {}) => [
  (requireName ? body('name').exists() : body('name').optional())
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage('El nombre debe tener al menos 3 caracteres.'),
  body('slug')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage('El slug debe tener al menos 3 caracteres.'),
  body('description')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripción admite máximo 500 caracteres.'),
  body('isActive').optional().isBoolean().withMessage('isActive debe ser booleano.').toBoolean(),
];

const paginationValidations = [
  query('page').optional().isInt({ min: 1 }).withMessage('page debe ser >= 1.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit debe estar entre 1 y 100.'),
  query('search').optional().isString().withMessage('search debe ser texto.'),
  query('isActive').optional().isBoolean().withMessage('isActive debe ser booleano.').toBoolean(),
];

const idValidation = [param('id').isMongoId().withMessage('El ID proporcionado no es válido.')];

router.get('/', validateRequest(paginationValidations), listCategoriesController);
router.get('/:id', validateRequest(idValidation), getCategoryController);

router.post('/', ...adminOnly, validateRequest(categoryValidations({ requireName: true })), createCategoryController);
router.patch(
  '/:id',
  ...adminOnly,
  validateRequest([...idValidation, ...categoryValidations()]),
  updateCategoryController,
);
router.delete('/:id', ...adminOnly, validateRequest(idValidation), deleteCategoryController);

export default router;
