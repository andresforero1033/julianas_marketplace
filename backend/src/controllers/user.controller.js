import {
  listUsers,
  getUserById,
  updateUserById,
  softDeleteUserById,
} from '../services/index.js';

const handleError = (res, error) => {
  const status = error.statusCode || 500;
  const message =
    error.message === 'USER_NOT_FOUND'
      ? 'Usuario no encontrado.'
      : error.message === 'INVALID_ROLE'
        ? 'El rol proporcionado no es válido.'
        : 'No se pudo completar la operación.';

  return res.status(status).json({ message });
};

export const getUsers = async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 20 } = req.query;
    const parsedIsActive =
      typeof isActive === 'undefined' ? undefined : isActive === 'true';

    const result = await listUsers({
      role,
      isActive: parsedIsActive,
      page: Number(page),
      limit: Number(limit),
    });

    return res.json(result);
  } catch (error) {
    return handleError(res, error);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    return res.json({ user });
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await updateUserById(req.params.id, req.body);
    return res.json({ message: 'Usuario actualizado.', user });
  } catch (error) {
    return handleError(res, error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    await softDeleteUserById(req.params.id);
    return res.json({ message: 'Usuario desactivado.' });
  } catch (error) {
    return handleError(res, error);
  }
};
