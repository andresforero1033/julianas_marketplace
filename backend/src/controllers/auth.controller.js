import { createUser } from '../services/index.js';

const mapErrorToResponse = (error) => {
  switch (error.message) {
    case 'EMAIL_IN_USE':
      return { status: 409, message: 'El correo ya está registrado.' };
    case 'INVALID_ROLE':
      return { status: 400, message: 'El rol proporcionado no es válido.' };
    default:
      return { status: 500, message: 'No se pudo completar el registro.' };
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
*** End of File