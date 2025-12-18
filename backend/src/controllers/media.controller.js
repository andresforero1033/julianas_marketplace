import {
  generateUploadUrl,
  createMediaAsset,
  listMediaAssets,
  deleteMediaAsset,
} from '../services/index.js';

const mediaErrorMessages = {
  UPLOAD_METADATA_REQUIRED: 'Debes indicar nombre y tipo de archivo.',
  INVALID_OWNER_TYPE: 'El ownerType proporcionado no es válido.',
  ASSET_URL_REQUIRED: 'La URL del archivo es obligatoria.',
  MEDIA_ASSET_NOT_FOUND: 'No se encontró el recurso solicitado.',
  MEDIA_DELETE_FORBIDDEN: 'No tienes permisos para eliminar este recurso.',
};

const handleError = (res, error) => {
  const status = error.statusCode || 500;
  const message = mediaErrorMessages[error.message] || 'No se pudo completar la operación.';
  return res.status(status).json({ message });
};

export const generateUploadUrlController = async (req, res) => {
  try {
    const payload = generateUploadUrl(req.body);
    return res.json(payload);
  } catch (error) {
    return handleError(res, error);
  }
};

export const createMediaAssetController = async (req, res) => {
  try {
    const asset = await createMediaAsset({ ...req.body, uploadedBy: req.user?._id });
    return res.status(201).json({ message: 'Imagen registrada.', asset });
  } catch (error) {
    return handleError(res, error);
  }
};

export const listMediaAssetsController = async (req, res) => {
  try {
    const { ownerType, ownerId, page = 1, limit = 20 } = req.query;
    const result = await listMediaAssets({ ownerType, ownerId, page: Number(page), limit: Number(limit) });
    return res.json(result);
  } catch (error) {
    return handleError(res, error);
  }
};

export const deleteMediaAssetController = async (req, res) => {
  try {
    const requester = { role: req.user.role, userId: req.user._id?.toString() };
    await deleteMediaAsset({ id: req.params.id, requester });
    return res.json({ message: 'Imagen eliminada.' });
  } catch (error) {
    return handleError(res, error);
  }
};
