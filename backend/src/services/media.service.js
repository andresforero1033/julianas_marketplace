import { randomUUID } from 'crypto';
import MediaAsset, { MEDIA_OWNER_TYPES } from '../models/mediaAsset.model.js';

const buildError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const sanitizeAsset = (doc) => {
  if (!doc) return null;
  const asset = doc.toObject({ versionKey: false });
  if (asset._id && typeof asset._id.toString === 'function') {
    asset._id = asset._id.toString();
  }
  if (asset.ownerId && typeof asset.ownerId.toString === 'function') {
    asset.ownerId = asset.ownerId.toString();
  }
  if (asset.uploadedBy && typeof asset.uploadedBy.toString === 'function') {
    asset.uploadedBy = asset.uploadedBy.toString();
  }
  return asset;
};

const validateOwnerType = (ownerType) => {
  if (ownerType && !MEDIA_OWNER_TYPES.includes(ownerType)) {
    throw buildError('INVALID_OWNER_TYPE');
  }
};

export const generateUploadUrl = ({ fileName, mimeType, fileSize }) => {
  if (!fileName || !mimeType) {
    throw buildError('UPLOAD_METADATA_REQUIRED');
  }

  const uploadId = randomUUID();
  const normalizedFileName = fileName.replace(/\s+/g, '-');
  const uploadUrl = `https://uploads.julianas.mock/${uploadId}/${encodeURIComponent(normalizedFileName)}`;
  const assetUrl = `https://cdn.julianas.mock/${uploadId}/${encodeURIComponent(normalizedFileName)}`;

  return {
    uploadUrl,
    assetUrl,
    requiredHeaders: {
      'Content-Type': mimeType,
      'X-Mock-Upload-Token': randomUUID(),
    },
    fileName: normalizedFileName,
    mimeType,
    fileSize,
    expiresInSeconds: 600,
  };
};

export const createMediaAsset = async ({ ownerType = 'general', ownerId, url, thumbnailUrl, meta = {}, tags = [], uploadedBy, ...rest }) => {
  if (!url) {
    throw buildError('ASSET_URL_REQUIRED');
  }

  validateOwnerType(ownerType);

  const asset = await MediaAsset.create({
    ownerType,
    ownerId,
    url,
    thumbnailUrl,
    metadata: meta,
    tags,
    uploadedBy,
    ...rest,
  });

  return sanitizeAsset(asset);
};

export const listMediaAssets = async ({ ownerType, ownerId, page = 1, limit = 20 }) => {
  const query = {};
  if (ownerType) {
    validateOwnerType(ownerType);
    query.ownerType = ownerType;
  }
  if (ownerId) {
    query.ownerId = ownerId;
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    MediaAsset.find(query).sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
    MediaAsset.countDocuments(query),
  ]);

  return {
    items: items.map(sanitizeAsset),
    total,
    page: safePage,
    pages: Math.max(Math.ceil(total / safeLimit), 1),
  };
};

export const getMediaAssetById = async (id) => {
  const asset = await MediaAsset.findById(id);
  if (!asset) {
    throw buildError('MEDIA_ASSET_NOT_FOUND', 404);
  }
  return asset;
};

export const deleteMediaAsset = async ({ id, requester }) => {
  const asset = await getMediaAssetById(id);

  if (
    requester?.role !== 'admin' &&
    asset.uploadedBy &&
    requester?.userId &&
    asset.uploadedBy.toString() !== requester.userId
  ) {
    throw buildError('MEDIA_DELETE_FORBIDDEN', 403);
  }

  await asset.deleteOne();
  return sanitizeAsset(asset);
};
