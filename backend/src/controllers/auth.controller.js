import { createUser, authenticateUser } from '../services/index.js';
import { generateAccessToken } from '../utils/index.js';

const mapErrorToResponse = (error) => {
  switch (error.message) {
    case 'EMAIL_IN_USE':
      return { status: 409, message: 'El correo ya está registrado.' };
    case 'INVALID_ROLE':
      return { status: 400, message: 'El rol proporcionado no es válido.' };
    case 'INVALID_CREDENTIALS':
      return { status: 401, message: 'Credenciales inválidas.' };
    case 'USER_INACTIVE':
      return { status: 403, message: 'La cuenta está inactiva.' };
    default:
      return { status: 500, message: 'No se pudo completar la operación.' };
  }
};

export const registerUser = async (req, res) => {
  try {
    const user = await createUser(req.body);
    return res.status(201).json({ message: 'Usuario registrado correctamente.', user });
  } catch (error) {
    const { status, message } = mapErrorToResponse(error);
    return res.status(status).json({ message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const user = await authenticateUser(req.body);
    const token = generateAccessToken({ sub: user._id, role: user.role, email: user.email });

    return res.json({ message: 'Inicio de sesión exitoso.', token, user });
  } catch (error) {
    const { status, message } = mapErrorToResponse(error);
    return res.status(status).json({ message });
  }
};

export const getCurrentUser = (req, res) => {
  return res.json({ user: req.user });
};

export const adminPing = (_req, res) => {
  return res.json({ message: 'Acceso de administrador autorizado.' });
};
*** End of File