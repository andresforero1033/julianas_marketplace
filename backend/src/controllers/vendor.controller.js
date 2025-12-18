import {
  createVendorProfile as createVendorProfileService,
  listVendors,
  getVendorById,
  getVendorByUserId,
  updateVendorById,
  updateVendorByUserId,
  deleteVendorById,
} from '../services/index.js';

const vendorErrorMessages = {
  VENDOR_PROFILE_EXISTS: 'La usuaria ya cuenta con un perfil de vendedora.',
  VENDOR_PROFILE_NOT_FOUND: 'Perfil de vendedora no encontrado.',
  USER_NOT_VENDEDORA: 'El usuario no tiene rol de vendedora.',
  USER_NOT_FOUND: 'Usuario no encontrado.',
  USER_INACTIVE: 'El usuario está inactivo.',
  STORE_NAME_REQUIRED: 'Debes indicar el nombre de la tienda.',
  NO_FIELDS_TO_UPDATE: 'Debes especificar al menos un campo para actualizar.',
};

const handleError = (res, error) => {
  const status = error.statusCode || 500;
  const message = vendorErrorMessages[error.message] || 'No se pudo completar la operación.';
  return res.status(status).json({ message });
};

const resolveTargetUserId = (req, fallback = req.user._id) => {
  if (req.user.role === 'admin' && req.body.userId) {
    return req.body.userId;
  }
  return fallback;
};

const sanitizeVendorPayload = (role, payload) => {
  if (role === 'admin') {
    return payload;
  }
  const { isApproved, isActive, ...rest } = payload;
  return rest;
};

export const createVendorProfile = async (req, res) => {
  try {
    const rawPayload = { ...req.body };
    delete rawPayload.userId;
    const payload = sanitizeVendorPayload(req.user.role, rawPayload);
    const targetUserId = resolveTargetUserId(req);

    const profile = await createVendorProfileService({
      userId: targetUserId,
      ...payload,
    });

    return res.status(201).json({ message: 'Perfil de vendedora creado.', profile });
  } catch (error) {
    return handleError(res, error);
  }
};

export const listVendorsController = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, isApproved, isActive } = req.query;
    const normalizedIsApproved =
      typeof isApproved === 'undefined' ? undefined : Boolean(isApproved);
    const normalizedIsActive =
      typeof isActive === 'undefined' ? undefined : Boolean(isActive);
    const result = await listVendors({
      page: Number(page),
      limit: Number(limit),
      search,
      isApproved: normalizedIsApproved,
      isActive: normalizedIsActive,
    });
    return res.json(result);
  } catch (error) {
    return handleError(res, error);
  }
};

export const getVendorProfileController = async (req, res) => {
  try {
    const profile = await getVendorById(req.params.id);
    return res.json({ profile });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getMyVendorProfile = async (req, res) => {
  try {
    const profile = await getVendorByUserId(req.user._id);
    return res.json({ profile });
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateVendorProfileController = async (req, res) => {
  try {
    const payload = { ...req.body };
    delete payload.userId;
    const profile = await updateVendorById(req.params.id, payload);
    return res.json({ message: 'Perfil actualizado.', profile });
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateMyVendorProfile = async (req, res) => {
  try {
    const payload = sanitizeVendorPayload(req.user.role, req.body);
    const profile = await updateVendorByUserId(req.user._id, payload);
    return res.json({ message: 'Perfil actualizado.', profile });
  } catch (error) {
    return handleError(res, error);
  }
};

export const deleteVendorProfileController = async (req, res) => {
  try {
    await deleteVendorById(req.params.id);
    return res.json({ message: 'Perfil eliminado.' });
  } catch (error) {
    return handleError(res, error);
  }
};
