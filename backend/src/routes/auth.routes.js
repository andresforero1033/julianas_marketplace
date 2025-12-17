import { Router } from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser, getCurrentUser, adminPing } from '../controllers/index.js';
import { validateRequest, requireAuth, authorizeRoles } from '../middlewares/index.js';
import { ROLES } from '../models/index.js';

const router = Router();

const registerValidations = [
  body('email').isEmail().withMessage('Debe proporcionar un email válido.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres.'),
  body('role')
    .optional()
    .isIn(ROLES)
    .withMessage('El rol debe ser compradora, vendedora o admin.'),
];

const loginValidations = [
  body('email').isEmail().withMessage('Debe proporcionar un email válido.'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria.'),
];

router.post('/register', validateRequest(registerValidations), registerUser);
router.post('/login', validateRequest(loginValidations), loginUser);
router.get('/me', requireAuth, getCurrentUser);
router.get('/admin/ping', requireAuth, authorizeRoles('admin'), adminPing);

export default router;
