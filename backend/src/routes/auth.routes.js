import { Router } from 'express';
import { body } from 'express-validator';
import { registerUser } from '../controllers/index.js';
import { validateRequest } from '../middlewares/index.js';
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

router.post('/register', validateRequest(registerValidations), registerUser);

export default router;
