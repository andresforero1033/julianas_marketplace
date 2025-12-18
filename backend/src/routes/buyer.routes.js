import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  createBuyerProfile,
  listBuyerProfilesController,
  getBuyerProfileController,
  getMyBuyerProfile,
  updateBuyerProfileController,
  updateMyBuyerProfile,
  deleteBuyerProfileController,
} from '../controllers/index.js';
import { validateRequest, requireAuth, authorizeRoles } from '../middlewares/index.js';

const router = Router();
const adminOnly = [requireAuth, authorizeRoles('admin')];
const buyerAccess = [requireAuth, authorizeRoles('compradora', 'admin')];

const buyerProfileValidations = ({ requireFullName = false } = {}) => [
  (requireFullName ? body('fullName').exists() : body('fullName').optional())
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage('fullName debe tener al menos 3 caracteres.'),
  body('phone')
    .optional()
    .isString()
    .isLength({ min: 6, max: 20 })
    .withMessage('phone debe tener entre 6 y 20 caracteres.'),
  body('birthDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('birthDate debe ser una fecha válida (ISO8601).'),
  body('addresses')
    .optional()
    .isArray({ max: 5 })
    .withMessage('addresses debe ser un arreglo con máximo 5 elementos.'),
  body('addresses.*.label')
    .optional({ nullable: true })
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Cada dirección debe incluir label.'),
  body('addresses.*.recipientName')
    .optional({ nullable: true })
    .isString()
    .trim()
    .withMessage('recipientName debe ser texto.'),
  body('addresses.*.street')
    .optional({ nullable: true })
    .isString()
    .trim()
    .withMessage('street debe ser texto.'),
  body('addresses.*.city')
    .optional({ nullable: true })
    .isString()
    .trim()
    .withMessage('city debe ser texto.'),
  body('addresses.*.state')
    .optional({ nullable: true })
    .isString()
    .trim()
    .withMessage('state debe ser texto.'),
  body('addresses.*.country')
    .optional({ nullable: true })
    .isString()
    .trim()
    .withMessage('country debe ser texto.'),
  body('addresses.*.postalCode')
    .optional({ nullable: true })
    .isString()
    .trim()
    .withMessage('postalCode debe ser texto.'),
  body('addresses.*.phone')
    .optional({ nullable: true })
    .isString()
    .trim()
    .withMessage('phone debe ser texto.'),
  body('addresses.*.isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault debe ser booleano.')
    .toBoolean(),
  body('preferences')
    .optional()
    .isArray({ max: 20 })
    .withMessage('preferences debe ser un arreglo de strings.'),
  body('preferences.*')
    .optional({ nullable: true })
    .isString()
    .trim()
    .withMessage('Cada preferencia debe ser texto.'),
];

const paginationValidations = [
  query('page').optional().isInt({ min: 1 }).withMessage('page debe ser >= 1.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit debe estar entre 1 y 100.'),
  query('search').optional().isString().withMessage('search debe ser texto.'),
];

const idValidation = [param('id').isMongoId().withMessage('El ID proporcionado no es válido.')];

router.post(
  '/',
  ...buyerAccess,
  validateRequest([
    ...buyerProfileValidations({ requireFullName: true }),
    body('userId').optional().isMongoId().withMessage('userId debe ser un ObjectId válido.'),
  ]),
  createBuyerProfile,
);

router.get('/me', ...buyerAccess, getMyBuyerProfile);

router.patch(
  '/me',
  ...buyerAccess,
  validateRequest(buyerProfileValidations()),
  updateMyBuyerProfile,
);

router.get(
  '/',
  ...adminOnly,
  validateRequest(paginationValidations),
  listBuyerProfilesController,
);

router.get(
  '/:id',
  ...adminOnly,
  validateRequest(idValidation),
  getBuyerProfileController,
);

router.patch(
  '/:id',
  ...adminOnly,
  validateRequest([...idValidation, ...buyerProfileValidations()]),
  updateBuyerProfileController,
);

router.delete(
  '/:id',
  ...adminOnly,
  validateRequest(idValidation),
  deleteBuyerProfileController,
);

export default router;
