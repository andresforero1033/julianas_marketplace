import Vendor from '../models/vendor.model.js';
import { User } from '../models/index.js';
import { sanitizeUser } from './user.service.js';

const buildError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const slugify = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const ensureVendorUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw buildError('USER_NOT_FOUND', 404);
  }

  if (user.role !== 'vendedora') {
    throw buildError('USER_NOT_VENDEDORA', 400);
  }

  if (!user.isActive) {
    throw buildError('USER_INACTIVE', 400);
  }

  return user;
};

const normalizeVendor = (doc) => {
  if (!doc) return null;
  const vendor = doc.toObject({ versionKey: false });

  if (doc.userId && doc.userId._id && typeof doc.userId.toObject === 'function') {
    vendor.user = sanitizeUser(doc.userId);
    vendor.userId = doc.userId._id.toString();
  } else if (vendor.userId && vendor.userId.toString) {
    vendor.userId = vendor.userId.toString();
  }

  return vendor;
};

const pickVendorFields = (payload = {}) => {
  const allowed = [
    'storeName',
    'slug',
    'description',
    'logo',
    'banner',
    'contactEmail',
    'contactPhone',
    'location',
    'socialLinks',
    'policies',
    'isApproved',
    'isActive',
  ];

  return allowed.reduce((acc, field) => {
    if (typeof payload[field] !== 'undefined') {
      acc[field] = payload[field];
    }
    return acc;
  }, {});
};

const applySlugIfNeeded = (updates) => {
  if (updates.slug) {
    updates.slug = slugify(updates.slug);
  } else if (updates.storeName) {
    updates.slug = slugify(updates.storeName);
  }
};

export const createVendorProfile = async ({ userId, ...payload }) => {
  await ensureVendorUser(userId);

  const existing = await Vendor.findOne({ userId });
  if (existing) {
    throw buildError('VENDOR_PROFILE_EXISTS', 409);
  }

  const updates = pickVendorFields(payload);
  applySlugIfNeeded(updates);

  if (!updates.storeName) {
    throw buildError('STORE_NAME_REQUIRED', 400);
  }

  const vendor = await Vendor.create({
    userId,
    ...updates,
  });

  await vendor.populate('userId');
  return normalizeVendor(vendor);
};

export const listVendors = async ({ page = 1, limit = 20, search, isApproved, isActive }) => {
  const query = {};

  if (search) {
    query.$or = [
      { storeName: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (typeof isApproved === 'boolean') {
    query.isApproved = isApproved;
  }

  if (typeof isActive === 'boolean') {
    query.isActive = isActive;
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    Vendor.find(query)
      .populate('userId')
      .skip(skip)
      .limit(safeLimit)
      .sort({ createdAt: -1 }),
    Vendor.countDocuments(query),
  ]);

  return {
    items: items.map(normalizeVendor),
    total,
    page: safePage,
    pages: Math.max(Math.ceil(total / safeLimit), 1),
  };
};

export const getVendorById = async (id) => {
  const vendor = await Vendor.findById(id).populate('userId');
  if (!vendor) {
    throw buildError('VENDOR_PROFILE_NOT_FOUND', 404);
  }
  return normalizeVendor(vendor);
};

export const getVendorByUserId = async (userId) => {
  const vendor = await Vendor.findOne({ userId }).populate('userId');
  if (!vendor) {
    throw buildError('VENDOR_PROFILE_NOT_FOUND', 404);
  }
  return normalizeVendor(vendor);
};

export const updateVendorById = async (id, payload) => {
  const updates = pickVendorFields(payload);

  if (!Object.keys(updates).length) {
    throw buildError('NO_FIELDS_TO_UPDATE', 400);
  }

  applySlugIfNeeded(updates);

  const vendor = await Vendor.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true },
  ).populate('userId');

  if (!vendor) {
    throw buildError('VENDOR_PROFILE_NOT_FOUND', 404);
  }

  return normalizeVendor(vendor);
};

export const updateVendorByUserId = async (userId, payload) => {
  const updates = pickVendorFields(payload);

  if (!Object.keys(updates).length) {
    throw buildError('NO_FIELDS_TO_UPDATE', 400);
  }

  applySlugIfNeeded(updates);

  const vendor = await Vendor.findOneAndUpdate(
    { userId },
    { $set: updates },
    { new: true, runValidators: true },
  ).populate('userId');

  if (!vendor) {
    throw buildError('VENDOR_PROFILE_NOT_FOUND', 404);
  }

  return normalizeVendor(vendor);
};

export const deleteVendorById = async (id) => {
  const vendor = await Vendor.findByIdAndDelete(id).populate('userId');
  if (!vendor) {
    throw buildError('VENDOR_PROFILE_NOT_FOUND', 404);
  }
  return normalizeVendor(vendor);
};
