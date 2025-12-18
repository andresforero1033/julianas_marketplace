import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  createVendorProfile,
  listVendorsController,
  getVendorProfileController,
  getMyVendorProfile,
  updateVendorProfileController,
  updateMyVendorProfile,
  deleteVendorProfileController,
} from '../controllers/index.js';
import { validateRequest, requireAuth, authorizeRoles } from '../middlewares/index.js';

const router = Router();
const adminOnly = [requireAuth, authorizeRoles('admin')];
const vendorAccess = [requireAuth, authorizeRoles('vendedora', 'admin')];

const vendorProfileValidations = ({ requireStoreName = false } = {}) => [
  (requireStoreName ? body('storeName').exists() : body('storeName').optional())
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage('storeName debe tener al menos 3 caracteres.'),
  body('slug')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage('slug debe ser texto.'),
  body('description').optional().isString().trim().isLength({ max: 1000 }).withMessage('description es muy larga.'),
  body('logo').optional().isString().trim().withMessage('logo debe ser texto.'),
  body('banner').optional().isString().trim().withMessage('banner debe ser texto.'),
  body('contactEmail').optional().isEmail().withMessage('contactEmail debe ser un email válido.').normalizeEmail(),
  body('contactPhone')
    .optional()
    .isString()
    .isLength({ min: 6, max: 20 })
    .withMessage('contactPhone debe tener entre 6 y 20 caracteres.'),
  body('location').optional().isString().trim().withMessage('location debe ser texto.'),
  body('socialLinks')
    .optional()
    .isObject()
    .withMessage('socialLinks debe ser un objeto con enlaces.'),
  body('socialLinks.website').optional().isString().trim().withMessage('website debe ser texto.'),
  body('socialLinks.instagram').optional().isString().trim().withMessage('instagram debe ser texto.'),
  body('socialLinks.facebook').optional().isString().trim().withMessage('facebook debe ser texto.'),
  body('socialLinks.tiktok').optional().isString().trim().withMessage('tiktok debe ser texto.'),
  body('socialLinks.whatsapp').optional().isString().trim().withMessage('whatsapp debe ser texto.'),
  body('policies')
    .optional()
    .isObject()
    .withMessage('policies debe ser un objeto con textos.'),
  body('policies.shipping').optional().isString().trim().withMessage('shipping debe ser texto.'),
  body('policies.returns').optional().isString().trim().withMessage('returns debe ser texto.'),
  body('isApproved').optional().isBoolean().withMessage('isApproved debe ser booleano.').toBoolean(),
  body('isActive').optional().isBoolean().withMessage('isActive debe ser booleano.').toBoolean(),
];

const listValidations = [
  query('page').optional().isInt({ min: 1 }).withMessage('page debe ser >= 1.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit debe estar entre 1 y 100.'),
  query('search').optional().isString().withMessage('search debe ser texto.'),
  query('isApproved').optional().isBoolean().withMessage('isApproved debe ser booleano.').toBoolean(),
  query('isActive').optional().isBoolean().withMessage('isActive debe ser booleano.').toBoolean(),
];

const idValidation = [param('id').isMongoId().withMessage('El ID proporcionado no es válido.')];

router.post(
  '/',
  ...vendorAccess,
  validateRequest([
    ...vendorProfileValidations({ requireStoreName: true }),
    body('userId').optional().isMongoId().withMessage('userId debe ser un ObjectId válido.'),
  ]),
  createVendorProfile,
);

router.get('/me', ...vendorAccess, getMyVendorProfile);

router.patch(
  '/me',
  ...vendorAccess,
  validateRequest(vendorProfileValidations()),
  updateMyVendorProfile,
);

router.get(
  '/',
  ...adminOnly,
  validateRequest(listValidations),
  listVendorsController,
);

router.get(
  '/:id',
  ...adminOnly,
  validateRequest(idValidation),
  getVendorProfileController,
);

router.patch(
  '/:id',
  ...adminOnly,
  validateRequest([...idValidation, ...vendorProfileValidations()]),
  updateVendorProfileController,
);

router.delete(
  '/:id',
  ...adminOnly,
  validateRequest(idValidation),
  deleteVendorProfileController,
);

export default router;
