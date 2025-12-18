import BuyerProfile from '../models/buyerProfile.model.js';
import { User } from '../models/index.js';
import { sanitizeUser } from './user.service.js';

const buildError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const ensureCompradoraUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw buildError('USER_NOT_FOUND', 404);
  }

  if (user.role !== 'compradora') {
    throw buildError('USER_NOT_COMPRADORA', 400);
  }

  if (!user.isActive) {
    throw buildError('USER_INACTIVE', 400);
  }

  return user;
};

const normalizeProfile = (doc) => {
  if (!doc) return null;
  const profile = doc.toObject({ versionKey: false });

  if (doc.userId && doc.userId._id && typeof doc.userId.toObject === 'function') {
    profile.user = sanitizeUser(doc.userId);
    profile.userId = doc.userId._id.toString();
  } else if (profile.userId && profile.userId.toString) {
    profile.userId = profile.userId.toString();
  }

  return profile;
};

const pickBuyerFields = (payload = {}) => {
  const allowed = ['fullName', 'phone', 'birthDate', 'addresses', 'preferences'];
  return allowed.reduce((acc, field) => {
    if (typeof payload[field] !== 'undefined') {
      acc[field] = payload[field];
    }
    return acc;
  }, {});
};

export const createBuyerProfile = async ({ userId, ...payload }) => {
  await ensureCompradoraUser(userId);

  const existing = await BuyerProfile.findOne({ userId });
  if (existing) {
    throw buildError('BUYER_PROFILE_EXISTS', 409);
  }

  const profile = await BuyerProfile.create({
    userId,
    ...pickBuyerFields(payload),
  });

  await profile.populate('userId');
  return normalizeProfile(profile);
};

export const listBuyerProfiles = async ({ page = 1, limit = 20, search }) => {
  const query = {};

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    BuyerProfile.find(query)
      .populate('userId')
      .skip(skip)
      .limit(safeLimit)
      .sort({ createdAt: -1 }),
    BuyerProfile.countDocuments(query),
  ]);

  return {
    items: items.map(normalizeProfile),
    total,
    page: safePage,
    pages: Math.max(Math.ceil(total / safeLimit), 1),
  };
};

export const getBuyerProfileById = async (id) => {
  const profile = await BuyerProfile.findById(id).populate('userId');
  if (!profile) {
    throw buildError('BUYER_PROFILE_NOT_FOUND', 404);
  }
  return normalizeProfile(profile);
};

export const getBuyerProfileByUserId = async (userId) => {
  const profile = await BuyerProfile.findOne({ userId }).populate('userId');
  if (!profile) {
    throw buildError('BUYER_PROFILE_NOT_FOUND', 404);
  }
  return normalizeProfile(profile);
};

export const updateBuyerProfileById = async (id, payload) => {
  const updates = pickBuyerFields(payload);

  if (!Object.keys(updates).length) {
    throw buildError('NO_FIELDS_TO_UPDATE', 400);
  }

  const profile = await BuyerProfile.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true },
  ).populate('userId');

  if (!profile) {
    throw buildError('BUYER_PROFILE_NOT_FOUND', 404);
  }

  return normalizeProfile(profile);
};

export const updateBuyerProfileByUserId = async (userId, payload) => {
  const updates = pickBuyerFields(payload);

  if (!Object.keys(updates).length) {
    throw buildError('NO_FIELDS_TO_UPDATE', 400);
  }

  const profile = await BuyerProfile.findOneAndUpdate(
    { userId },
    { $set: updates },
    { new: true, runValidators: true },
  ).populate('userId');

  if (!profile) {
    throw buildError('BUYER_PROFILE_NOT_FOUND', 404);
  }

  return normalizeProfile(profile);
};

export const deleteBuyerProfileById = async (id) => {
  const profile = await BuyerProfile.findByIdAndDelete(id).populate('userId');
  if (!profile) {
    throw buildError('BUYER_PROFILE_NOT_FOUND', 404);
  }
  return normalizeProfile(profile);
};
