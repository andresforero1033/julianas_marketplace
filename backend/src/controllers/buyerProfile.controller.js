import {
  createBuyerProfile as createBuyerProfileService,
  listBuyerProfiles,
  getBuyerProfileById,
  getBuyerProfileByUserId,
  updateBuyerProfileById,
  updateBuyerProfileByUserId,
  deleteBuyerProfileById,
} from '../services/index.js';

const buyerErrorMessages = {
  BUYER_PROFILE_EXISTS: 'La usuaria ya cuenta con un perfil de compradora.',
  BUYER_PROFILE_NOT_FOUND: 'Perfil de compradora no encontrado.',
  USER_NOT_COMPRADORA: 'El usuario no tiene rol de compradora.',
  USER_NOT_FOUND: 'Usuario no encontrado.',
  USER_INACTIVE: 'El usuario está inactivo.',
  NO_FIELDS_TO_UPDATE: 'Debes especificar al menos un campo para actualizar.',
};

const handleError = (res, error) => {
  const status = error.statusCode || 500;
  const message = buyerErrorMessages[error.message] || 'No se pudo completar la operación.';
  return res.status(status).json({ message });
};

const resolveTargetUserId = (req, fallback = req.user._id) => {
  if (req.user.role === 'admin' && req.body.userId) {
    return req.body.userId;
  }
  return fallback;
};

export const createBuyerProfile = async (req, res) => {
  try {
    const payload = { ...req.body };
    delete payload.userId;
    const targetUserId = resolveTargetUserId(req);

    const profile = await createBuyerProfileService({
      userId: targetUserId,
      ...payload,
    });

    return res.status(201).json({ message: 'Perfil de compradora creado.', profile });
  } catch (error) {
    return handleError(res, error);
  }
};

export const listBuyerProfilesController = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const result = await listBuyerProfiles({
      page: Number(page),
      limit: Number(limit),
      search,
    });
    return res.json(result);
  } catch (error) {
    return handleError(res, error);
  }
};

export const getBuyerProfileController = async (req, res) => {
  try {
    const profile = await getBuyerProfileById(req.params.id);
    return res.json({ profile });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getMyBuyerProfile = async (req, res) => {
  try {
    const profile = await getBuyerProfileByUserId(req.user._id);
    return res.json({ profile });
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateBuyerProfileController = async (req, res) => {
  try {
    const payload = { ...req.body };
    delete payload.userId;
    const profile = await updateBuyerProfileById(req.params.id, payload);
    return res.json({ message: 'Perfil actualizado.', profile });
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateMyBuyerProfile = async (req, res) => {
  try {
    const profile = await updateBuyerProfileByUserId(req.user._id, req.body);
    return res.json({ message: 'Perfil actualizado.', profile });
  } catch (error) {
    return handleError(res, error);
  }
};

export const deleteBuyerProfileController = async (req, res) => {
  try {
    await deleteBuyerProfileById(req.params.id);
    return res.json({ message: 'Perfil eliminado.' });
  } catch (error) {
    return handleError(res, error);
  }
};
