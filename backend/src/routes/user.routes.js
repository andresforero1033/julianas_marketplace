import { Router } from 'express';
import { param, body, query } from 'express-validator';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/index.js';
import { validateRequest, requireAuth, authorizeRoles } from '../middlewares/index.js';
import { ROLES } from '../models/index.js';

const router = Router();
const adminOnly = [requireAuth, authorizeRoles('admin')];

const userIdParam = [
  param('id').isMongoId().withMessage('El ID proporcionado no es válido.'),
];

const listValidations = [
  query('role')
    .optional()
    .isIn(ROLES)
    .withMessage('El rol debe ser compradora, vendedora o admin.'),
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive debe ser true o false.'),
  query('page').optional().isInt({ min: 1 }).withMessage('La página debe ser >= 1.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('El límite debe ser 1-100.'),
];

const updateValidations = [
  body('role')
    .optional()
    .isIn(ROLES)
    .withMessage('El rol debe ser compradora, vendedora o admin.'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive debe ser booleano.'),
  body('email').optional().isEmail().withMessage('Debe proporcionar un email válido.'),
];

router.get('/', adminOnly, validateRequest(listValidations), getUsers);
router.get('/:id', adminOnly, validateRequest(userIdParam), getUser);
router.patch('/:id', adminOnly, validateRequest([...userIdParam, ...updateValidations]), updateUser);
router.delete('/:id', adminOnly, validateRequest(userIdParam), deleteUser);

export default router;
