import Product from '../models/product.model.js';
import { Category, Vendor } from '../models/index.js';

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

const sanitizeVariant = (variantDoc) => {
  if (!variantDoc) return null;
  const variant =
    typeof variantDoc.toObject === 'function'
      ? variantDoc.toObject({ versionKey: false })
      : { ...variantDoc };
  if (variant._id && typeof variant._id.toString === 'function') {
    variant._id = variant._id.toString();
  }
  return variant;
};

const sanitizeProduct = (doc) => {
  if (!doc) return null;
  const product = doc.toObject({ versionKey: false });

  if (doc.categoryId && doc.categoryId._id) {
    product.category = {
      _id: doc.categoryId._id,
      name: doc.categoryId.name,
      slug: doc.categoryId.slug,
      isActive: doc.categoryId.isActive,
    };
    product.categoryId = doc.categoryId._id.toString();
  } else if (product.categoryId && product.categoryId.toString) {
    product.categoryId = product.categoryId.toString();
  }

  if (doc.vendorId && doc.vendorId._id) {
    product.vendor = {
      _id: doc.vendorId._id,
      storeName: doc.vendorId.storeName,
      slug: doc.vendorId.slug,
      isApproved: doc.vendorId.isApproved,
      isActive: doc.vendorId.isActive,
    };
    product.vendorId = doc.vendorId._id.toString();
  } else if (product.vendorId && product.vendorId.toString) {
    product.vendorId = product.vendorId.toString();
  }

  if (Array.isArray(product.variants)) {
    product.variants = product.variants.map(sanitizeVariant);
  }

  return product;
};

const pickProductFields = (payload = {}) => {
  const allowed = [
    'name',
    'slug',
    'description',
    'price',
    'salePrice',
    'stock',
    'images',
    'tags',
    'categoryId',
    'isActive',
    'isPublished',
    'variants',
  ];

  return allowed.reduce((acc, field) => {
    if (typeof payload[field] !== 'undefined') {
      acc[field] = payload[field];
    }
    return acc;
  }, {});
};

const ensureCategoryExists = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw buildError('CATEGORY_NOT_FOUND', 404);
  }
  if (!category.isActive) {
    throw buildError('CATEGORY_INACTIVE', 400);
  }
  return category;
};

const ensureVendorExists = async (vendorId) => {
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    throw buildError('VENDOR_PROFILE_NOT_FOUND', 404);
  }
  if (!vendor.isActive) {
    throw buildError('VENDOR_INACTIVE', 400);
  }
  return vendor;
};

const ensureUniqueSlug = async (slug, ignoreId) => {
  if (!slug) return;
  const existing = await Product.findOne({ slug });
  if (existing && existing._id.toString() !== ignoreId) {
    throw buildError('PRODUCT_SLUG_IN_USE', 409);
  }
};

const validateSalePrice = (price, salePrice) => {
  if (typeof salePrice === 'undefined' || salePrice === null) return;
  if (typeof price === 'undefined' || price === null) {
    throw buildError('SALE_PRICE_REQUIRES_PRICE');
  }
  if (salePrice >= price) {
    throw buildError('SALE_PRICE_INVALID');
  }
};

const pickVariantFields = (payload = {}) => {
  const allowed = [
    'name',
    'sku',
    'color',
    'size',
    'attributes',
    'price',
    'salePrice',
    'stock',
    'images',
    'isActive',
  ];

  return allowed.reduce((acc, field) => {
    if (typeof payload[field] !== 'undefined') {
      acc[field] = payload[field];
    }
    return acc;
  }, {});
};

const validateVariant = (variant, { allowPartial = false } = {}) => {
  if (!allowPartial && !variant.name) {
    throw buildError('VARIANT_NAME_REQUIRED');
  }

  if (!allowPartial) {
    if (typeof variant.stock === 'undefined' || variant.stock === null) {
      variant.stock = 0;
    }
    if (variant.stock < 0) {
      throw buildError('VARIANT_STOCK_INVALID');
    }
  } else if (typeof variant.stock !== 'undefined' && variant.stock < 0) {
    throw buildError('VARIANT_STOCK_INVALID');
  }

  if (typeof variant.price !== 'undefined') {
    validateSalePrice(variant.price, variant.salePrice);
  } else if (!allowPartial && typeof variant.salePrice !== 'undefined') {
    throw buildError('SALE_PRICE_REQUIRES_PRICE');
  }
};

const normalizeVariantsInput = (variants = []) => {
  if (!Array.isArray(variants) || !variants.length) {
    return [];
  }

  return variants.map((variant) => {
    const sanitized = pickVariantFields(variant);
    validateVariant(sanitized);
    sanitized.stock = sanitized.stock ?? 0;
    return sanitized;
  });
};

const ensureVariantSkuUniqueness = (variants = [], existingSkus = []) => {
  const seen = new Set(existingSkus.filter(Boolean).map((sku) => sku.trim().toUpperCase()));
  variants.forEach((variant) => {
    if (variant.sku) {
      const normalized = variant.sku.trim().toUpperCase();
      if (seen.has(normalized)) {
        throw buildError('VARIANT_SKU_IN_USE', 409);
      }
      seen.add(normalized);
    }
  });
};

const findProductOrThrow = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw buildError('PRODUCT_NOT_FOUND', 404);
  }
  return product;
};

const findVariantOrThrow = (product, variantId) => {
  const variant = product.variants.id(variantId);
  if (!variant) {
    throw buildError('VARIANT_NOT_FOUND', 404);
  }
  return variant;
};

export const createProduct = async ({ vendorId, payload }) => {
  if (!vendorId) {
    throw buildError('VENDOR_ID_REQUIRED');
  }

  await ensureVendorExists(vendorId);

  const data = pickProductFields(payload);
  const variants = normalizeVariantsInput(data.variants);
  ensureVariantSkuUniqueness(variants);
  if (variants.length) {
    data.variants = variants;
  } else {
    delete data.variants;
  }

  const requiresStandaloneStock = !variants.length;

  if (
    !data.name ||
    !data.description ||
    typeof data.price === 'undefined' ||
    (requiresStandaloneStock && typeof data.stock === 'undefined')
  ) {
    throw buildError('PRODUCT_FIELDS_REQUIRED');
  }

  if (!data.categoryId) {
    throw buildError('CATEGORY_REQUIRED');
  }

  await ensureCategoryExists(data.categoryId);

  const slug = slugify(data.slug || data.name);
  await ensureUniqueSlug(slug);
  data.slug = slug;

  validateSalePrice(data.price, data.salePrice);

  if (variants.length) {
    data.stock = variants.reduce((acc, variant) => acc + (variant.stock || 0), 0);
  }

  const product = await Product.create({
    vendorId,
    ...data,
  });

  await product.populate(['vendorId', 'categoryId']);
  return sanitizeProduct(product);
};

export const listProducts = async ({
  page = 1,
  limit = 20,
  search,
  categoryId,
  vendorId,
  isActive,
  isPublished,
  minPrice,
  maxPrice,
}) => {
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  if (categoryId) {
    query.categoryId = categoryId;
  }

  if (vendorId) {
    query.vendorId = vendorId;
  }

  if (typeof isActive === 'boolean') {
    query.isActive = isActive;
  }

  if (typeof isPublished === 'boolean') {
    query.isPublished = isPublished;
  }

  if (typeof minPrice === 'number' || typeof maxPrice === 'number') {
    query.price = {};
    if (typeof minPrice === 'number') {
      query.price.$gte = minPrice;
    }
    if (typeof maxPrice === 'number') {
      query.price.$lte = maxPrice;
    }
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    Product.find(query)
      .populate('vendorId')
      .populate('categoryId')
      .skip(skip)
      .limit(safeLimit)
      .sort({ createdAt: -1 }),
    Product.countDocuments(query),
  ]);

  return {
    items: items.map(sanitizeProduct),
    total,
    page: safePage,
    pages: Math.max(Math.ceil(total / safeLimit), 1),
  };
};

export const getProductById = async (id) => {
  const product = await Product.findById(id).populate('vendorId').populate('categoryId');
  if (!product) {
    throw buildError('PRODUCT_NOT_FOUND', 404);
  }
  return sanitizeProduct(product);
};

const ensureOwnership = (product, actor) => {
  if (!actor || actor.role !== 'vendedora') {
    return;
  }

  if (!actor.vendorId) {
    throw buildError('VENDOR_PROFILE_NOT_FOUND', 404);
  }

  if (product.vendorId.toString() !== actor.vendorId) {
    throw buildError('PRODUCT_FORBIDDEN', 403);
  }
};

export const updateProductById = async ({ id, updates, actor }) => {
  const data = pickProductFields(updates);

  if (!Object.keys(data).length) {
    throw buildError('NO_FIELDS_TO_UPDATE');
  }

  const product = await findProductOrThrow(id);

  ensureOwnership(product, actor);

  const replacingVariants = Object.prototype.hasOwnProperty.call(data, 'variants');
  if (replacingVariants) {
    const variants = normalizeVariantsInput(data.variants);
    ensureVariantSkuUniqueness(variants);
    product.variants = variants;
    delete data.variants;
  }

  if (product.variants.length && !replacingVariants && Object.prototype.hasOwnProperty.call(data, 'stock')) {
    throw buildError('STOCK_MANAGED_BY_VARIANTS');
  }

  if (data.categoryId) {
    await ensureCategoryExists(data.categoryId);
  }

  const nextPrice = typeof data.price === 'number' ? data.price : product.price;
  const nextSalePrice = Object.prototype.hasOwnProperty.call(data, 'salePrice') ? data.salePrice : product.salePrice;
  validateSalePrice(nextPrice, nextSalePrice);

  if (data.name || data.slug) {
    const slug = slugify(data.slug || data.name || product.name);
    await ensureUniqueSlug(slug, id);
    data.slug = slug;
  }

  if (Object.keys(data).length) {
    Object.assign(product, data);
  }

  product.recalculateStock();
  await product.save();
  await product.populate('vendorId');
  await product.populate('categoryId');

  return sanitizeProduct(product);
};

export const deleteProductById = async ({ id, actor }) => {
  const product = await Product.findById(id);
  if (!product) {
    throw buildError('PRODUCT_NOT_FOUND', 404);
  }

  ensureOwnership(product, actor);

  product.isActive = false;
  await product.save();

  await product.populate('vendorId');
  await product.populate('categoryId');

  return sanitizeProduct(product);
};

export const addProductVariant = async ({ id, variant, actor }) => {
  const product = await findProductOrThrow(id);
  ensureOwnership(product, actor);

  const sanitizedVariant = pickVariantFields(variant);
  validateVariant(sanitizedVariant);
  sanitizedVariant.stock = sanitizedVariant.stock ?? 0;

  ensureVariantSkuUniqueness([sanitizedVariant], product.variants.map((item) => item.sku));

  product.variants.push(sanitizedVariant);
  product.recalculateStock();
  await product.save();

  const createdVariant = product.variants[product.variants.length - 1];
  return sanitizeVariant(createdVariant);
};

export const updateProductVariant = async ({ id, variantId, updates, actor }) => {
  const product = await findProductOrThrow(id);
  ensureOwnership(product, actor);

  const variant = findVariantOrThrow(product, variantId);

  const sanitizedUpdates = pickVariantFields(updates);
  if (!Object.keys(sanitizedUpdates).length) {
    throw buildError('NO_FIELDS_TO_UPDATE');
  }

  validateVariant(sanitizedUpdates, { allowPartial: true });

  if (sanitizedUpdates.sku) {
    const otherSkus = product.variants
      .filter((item) => item._id.toString() !== variantId)
      .map((item) => item.sku);
    ensureVariantSkuUniqueness([sanitizedUpdates], otherSkus);
  }

  Object.assign(variant, sanitizedUpdates);
  const nextPrice =
    typeof sanitizedUpdates.price === 'number' ? sanitizedUpdates.price : variant.price;
  if (Object.prototype.hasOwnProperty.call(sanitizedUpdates, 'salePrice')) {
    const nextSalePrice = sanitizedUpdates.salePrice;
    validateSalePrice(nextPrice, nextSalePrice);
  }
  product.recalculateStock();
  await product.save();

  return sanitizeVariant(variant);
};

export const deleteProductVariant = async ({ id, variantId, actor }) => {
  const product = await findProductOrThrow(id);
  ensureOwnership(product, actor);

  const variant = findVariantOrThrow(product, variantId);
  variant.remove();
  product.recalculateStock();
  await product.save();

  return { success: true };
};

const applyStockOperation = ({ current, quantity, operation }) => {
  if (operation === 'set') {
    if (quantity < 0) {
      throw buildError('STOCK_CANNOT_BE_NEGATIVE');
    }
    return quantity;
  }

  if (operation === 'increment') {
    const next = current + quantity;
    if (next < 0) {
      throw buildError('STOCK_CANNOT_BE_NEGATIVE');
    }
    return next;
  }

  throw buildError('INVALID_STOCK_OPERATION');
};

export const adjustProductStock = async ({ id, variantId, quantity, operation = 'set', actor }) => {
  if (typeof quantity !== 'number') {
    throw buildError('STOCK_QUANTITY_REQUIRED');
  }

  const product = await findProductOrThrow(id);
  ensureOwnership(product, actor);

  if (variantId) {
    const variant = findVariantOrThrow(product, variantId);
    variant.stock = applyStockOperation({ current: variant.stock || 0, quantity, operation });
  } else {
    if (product.variants.length) {
      throw buildError('VARIANT_STOCK_REQUIRED');
    }
    product.stock = applyStockOperation({ current: product.stock || 0, quantity, operation });
  }

  product.recalculateStock();
  await product.save();

  await product.populate('vendorId');
  await product.populate('categoryId');

  return sanitizeProduct(product);
};
