import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

const buildError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const calculateSubtotal = (quantity, unitPrice, unitSalePrice) => {
  const effectivePrice = typeof unitSalePrice === 'number' ? unitSalePrice : unitPrice;
  return Number((quantity * effectivePrice).toFixed(2));
};

const sanitizeCart = (doc) => {
  if (!doc) return null;
  const cart = doc.toObject({ versionKey: false });
  cart._id = cart._id.toString();
  cart.userId = cart.userId?.toString();
  cart.items = cart.items.map((item) => ({
    ...item,
    _id: item._id.toString(),
    productId: item.productId.toString(),
    vendorId: item.vendorId.toString(),
    variantId: item.variantId ? item.variantId.toString() : null,
  }));
  return cart;
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
};

const findProductOrThrow = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw buildError('PRODUCT_NOT_FOUND', 404);
  }
  if (!product.isActive || !product.isPublished) {
    throw buildError('PRODUCT_NOT_AVAILABLE', 400);
  }
  return product;
};

const resolveInventorySource = (product, variantId) => {
  if (product.variants.length) {
    if (!variantId) {
      throw buildError('VARIANT_REQUIRED');
    }
    const variant = product.variants.id(variantId);
    if (!variant) {
      throw buildError('VARIANT_NOT_FOUND', 404);
    }
    if (!variant.isActive) {
      throw buildError('VARIANT_INACTIVE', 400);
    }
    return { variant, stock: variant.stock || 0, price: variant.price ?? product.price, salePrice: variant.salePrice ?? product.salePrice };
  }

  if (variantId) {
    throw buildError('VARIANT_NOT_FOUND', 404);
  }

  return { variant: null, stock: product.stock || 0, price: product.price, salePrice: product.salePrice };
};

const ensureStockAvailability = (requested, available) => {
  if (available <= 0 || requested > available) {
    throw buildError('INSUFFICIENT_STOCK', 409);
  }
};

export const getCartForUser = async ({ userId }) => {
  const cart = await getOrCreateCart(userId);
  return sanitizeCart(cart);
};

export const addItemToCart = async ({ userId, productId, variantId, quantity }) => {
  if (typeof quantity !== 'number' || quantity < 1) {
    throw buildError('QUANTITY_INVALID');
  }

  const cart = await getOrCreateCart(userId);
  const product = await findProductOrThrow(productId);
  const { variant, stock, price, salePrice } = resolveInventorySource(product, variantId);

  const itemIndex = cart.items.findIndex(
    (item) =>
      item.productId.toString() === productId &&
      ((item.variantId && variantId && item.variantId.toString() === variantId) || (!item.variantId && !variantId)),
  );

  const existingQuantity = itemIndex >= 0 ? cart.items[itemIndex].quantity : 0;
  const nextQuantity = existingQuantity + quantity;
  ensureStockAvailability(nextQuantity, stock);

  const snapshot = {
    unitPrice: price,
    unitSalePrice: typeof salePrice === 'number' ? salePrice : undefined,
    productName: product.name,
    variantName: variant?.name,
    sku: variant?.sku,
    thumbnail: variant?.images?.[0] || product.images?.[0],
    vendorId: product.vendorId,
  };

  if (itemIndex >= 0) {
    const item = cart.items[itemIndex];
    item.quantity = nextQuantity;
    item.unitPrice = snapshot.unitPrice;
    item.unitSalePrice = snapshot.unitSalePrice;
    item.subtotal = calculateSubtotal(nextQuantity, snapshot.unitPrice, snapshot.unitSalePrice);
    item.productName = snapshot.productName;
    item.variantName = snapshot.variantName;
    item.sku = snapshot.sku;
    item.thumbnail = snapshot.thumbnail;
  } else {
    cart.items.push({
      productId,
      variantId,
      vendorId: snapshot.vendorId,
      quantity,
      unitPrice: snapshot.unitPrice,
      unitSalePrice: snapshot.unitSalePrice,
      subtotal: calculateSubtotal(quantity, snapshot.unitPrice, snapshot.unitSalePrice),
      productName: snapshot.productName,
      variantName: snapshot.variantName,
      sku: snapshot.sku,
      thumbnail: snapshot.thumbnail,
    });
  }

  cart.recalculateTotals();
  await cart.save();

  return sanitizeCart(cart);
};

export const updateCartItem = async ({ userId, itemId, quantity }) => {
  if (typeof quantity !== 'number' || quantity < 1) {
    throw buildError('QUANTITY_INVALID');
  }

  const cart = await getOrCreateCart(userId);
  const item = cart.items.id(itemId);
  if (!item) {
    throw buildError('CART_ITEM_NOT_FOUND', 404);
  }

  const product = await findProductOrThrow(item.productId);
  const { variant, stock, price, salePrice } = resolveInventorySource(product, item.variantId?.toString());
  ensureStockAvailability(quantity, stock);

  item.quantity = quantity;
  item.unitPrice = price;
  item.unitSalePrice = typeof salePrice === 'number' ? salePrice : undefined;
  item.subtotal = calculateSubtotal(quantity, price, salePrice);
  item.productName = product.name;
  item.variantName = variant?.name;
  item.sku = variant?.sku;
  item.thumbnail = variant?.images?.[0] || product.images?.[0];

  cart.recalculateTotals();
  await cart.save();

  return sanitizeCart(cart);
};

export const removeCartItem = async ({ userId, itemId }) => {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.id(itemId);
  if (!item) {
    throw buildError('CART_ITEM_NOT_FOUND', 404);
  }

  item.remove();
  cart.recalculateTotals();
  await cart.save();

  return sanitizeCart(cart);
};

export const clearCartItems = async ({ userId }) => {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  cart.recalculateTotals();
  await cart.save();
  return sanitizeCart(cart);
};

const buildValidationIssue = ({ item, issues, status, meta = {} }) => ({
  status,
  itemId: item._id.toString(),
  productId: item.productId.toString(),
  variantId: item.variantId ? item.variantId.toString() : null,
  requestedQuantity: item.quantity,
  productName: meta.productName || item.productName,
  variantName: meta.variantName || item.variantName,
  availableQuantity: typeof meta.availableQuantity === 'number' ? meta.availableQuantity : 0,
  price: typeof meta.price === 'number' ? meta.price : undefined,
  salePrice: typeof meta.salePrice === 'number' ? meta.salePrice : undefined,
  sku: meta.sku || item.sku,
  thumbnail: meta.thumbnail || item.thumbnail,
  issues,
});

export const validateCartStockForUser = async ({ userId }) => {
  const cart = await getOrCreateCart(userId);

  if (!cart.items.length) {
    return {
      cart: sanitizeCart(cart),
      validation: {
        isValid: true,
        totalItems: 0,
        totalQuantity: 0,
        items: [],
        checkedAt: new Date().toISOString(),
      },
    };
  }

  const results = await Promise.all(
    cart.items.map(async (item) => {
      try {
        const product = await findProductOrThrow(item.productId);
        if (!product.isActive || !product.isPublished) {
          throw buildError('PRODUCT_NOT_AVAILABLE', 400);
        }

        const { variant, stock, price, salePrice } = resolveInventorySource(
          product,
          item.variantId ? item.variantId.toString() : undefined,
        );

        if (stock < item.quantity) {
          throw buildError('INSUFFICIENT_STOCK', 409);
        }

        return buildValidationIssue({
          item,
          status: 'valid',
          issues: [],
          meta: {
            availableQuantity: stock,
            price,
            salePrice,
            productName: product.name,
            variantName: variant?.name,
            sku: variant?.sku,
            thumbnail: variant?.images?.[0] || product.images?.[0],
          },
        });
      } catch (error) {
        return buildValidationIssue({
          item,
          status: 'invalid',
          issues: [error.message || 'UNKNOWN_ERROR'],
        });
      }
    }),
  );

  const isValid = results.every((detail) => detail.status === 'valid');

  return {
    cart: sanitizeCart(cart),
    validation: {
      isValid,
      totalItems: cart.totalItems,
      totalQuantity: cart.totalQuantity,
      items: results,
      checkedAt: new Date().toISOString(),
    },
  };
};
