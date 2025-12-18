import Category from '../models/category.model.js';

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

const sanitizeCategory = (doc) => {
  if (!doc) return null;
  return doc.toObject({ versionKey: false });
};

const ensureUniqueSlug = async (slug, ignoreId) => {
  const existing = await Category.findOne({ slug });
  if (existing && existing._id.toString() !== ignoreId) {
    throw buildError('CATEGORY_SLUG_IN_USE', 409);
  }
};

const pickCategoryFields = (payload = {}) => {
  const allowed = ['name', 'slug', 'description', 'isActive'];
  return allowed.reduce((acc, field) => {
    if (typeof payload[field] !== 'undefined') {
      acc[field] = payload[field];
    }
    return acc;
  }, {});
};

export const createCategory = async (payload) => {
  if (!payload.name) {
    throw buildError('CATEGORY_NAME_REQUIRED');
  }

  const normalized = pickCategoryFields(payload);
  normalized.name = normalized.name.trim();
  normalized.slug = slugify(normalized.slug || normalized.name);

  await ensureUniqueSlug(normalized.slug);

  const category = await Category.create(normalized);
  return sanitizeCategory(category);
};

export const listCategories = async ({ page = 1, limit = 20, search, isActive }) => {
  const query = {};

  if (typeof isActive === 'boolean') {
    query.isActive = isActive;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    Category.find(query).skip(skip).limit(safeLimit).sort({ createdAt: -1 }),
    Category.countDocuments(query),
  ]);

  return {
    items: items.map(sanitizeCategory),
    total,
    page: safePage,
    pages: Math.max(Math.ceil(total / safeLimit), 1),
  };
};

export const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw buildError('CATEGORY_NOT_FOUND', 404);
  }
  return sanitizeCategory(category);
};

export const updateCategoryById = async (id, payload) => {
  const updates = pickCategoryFields(payload);

  if (!Object.keys(updates).length) {
    throw buildError('NO_FIELDS_TO_UPDATE');
  }

  if (updates.name) {
    updates.name = updates.name.trim();
  }

  if (updates.slug || updates.name) {
    const slug = slugify(updates.slug || updates.name);
    await ensureUniqueSlug(slug, id);
    updates.slug = slug;
  }

  const category = await Category.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });

  if (!category) {
    throw buildError('CATEGORY_NOT_FOUND', 404);
  }

  return sanitizeCategory(category);
};

export const deleteCategoryById = async (id) => {
  const category = await Category.findByIdAndUpdate(
    id,
    { $set: { isActive: false } },
    { new: true },
  );

  if (!category) {
    throw buildError('CATEGORY_NOT_FOUND', 404);
  }

  return sanitizeCategory(category);
};
