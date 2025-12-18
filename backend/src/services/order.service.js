import mongoose from 'mongoose';
import Order, { ORDER_STATUSES } from '../models/order.model.js';
import { clearCartItems, validateCartStockForUser } from './cart.service.js';
import { adjustProductStock } from './product.service.js';
import { getBuyerProfileByUserId } from './buyerProfile.service.js';
import { getVendorByUserId } from './vendor.service.js';

const { Types } = mongoose;

const buildError = (message, statusCode = 400, metadata = {}) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (Object.keys(metadata).length) {
    error.metadata = metadata;
  }
  return error;
};

const assertValidStatus = (status) => {
  if (!ORDER_STATUSES.includes(status)) {
    throw buildError('ORDER_STATUS_INVALID');
  }
};

const sanitizeOrder = (doc, { vendorId } = {}) => {
  if (!doc) return null;
  const order = doc.toObject({ versionKey: false });

  order._id = order._id.toString();
  order.userId = order.userId?.toString();
  if (order.buyerProfileId) {
    order.buyerProfileId = order.buyerProfileId.toString();
  }

  order.items = order.items.map((item) => ({
    ...item,
    _id: item._id.toString(),
    productId: item.productId?.toString(),
    vendorId: item.vendorId?.toString(),
    variantId: item.variantId ? item.variantId.toString() : null,
  }));

  order.vendors = order.vendors.map((vendor) => ({
    ...vendor,
    vendorId: vendor.vendorId?.toString(),
    statusHistory: (vendor.statusHistory || []).map((entry) => ({
      ...entry,
      changedAt: entry.changedAt instanceof Date ? entry.changedAt.toISOString() : entry.changedAt,
    })),
  }));

  order.statusHistory = order.statusHistory.map((entry) => ({
    ...entry,
    changedAt: entry.changedAt instanceof Date ? entry.changedAt.toISOString() : entry.changedAt,
  }));

  if (vendorId) {
    const vendorIdStr = vendorId.toString();
    order.items = order.items.filter((item) => item.vendorId === vendorIdStr);
    const vendorSummary = order.vendors.find((entry) => entry.vendorId === vendorIdStr) || null;
    order.vendorContext = vendorSummary;
    order.vendors = vendorSummary ? [vendorSummary] : [];
  }

  order.createdAt = order.createdAt?.toISOString?.() || order.createdAt;
  order.updatedAt = order.updatedAt?.toISOString?.() || order.updatedAt;

  return order;
};

const generateOrderNumber = async () => {
  const randomSuffix = () => Math.floor(1000 + Math.random() * 9000);
  let attempts = 0;

  while (attempts < 5) {
    const candidate = `ORD-${Date.now()}-${randomSuffix()}`;
    // eslint-disable-next-line no-await-in-loop
    const exists = await Order.exists({ orderNumber: candidate });
    if (!exists) {
      return candidate;
    }
    attempts += 1;
  }

  return `ORD-${Date.now()}-${randomSuffix()}`;
};

const mapCartItemToOrderItem = (item) => {
  const toObjectId = (value) => {
    if (!value) return undefined;
    return Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : undefined;
  };

  return {
    productId: toObjectId(item.productId),
    variantId: toObjectId(item.variantId),
    vendorId: toObjectId(item.vendorId),
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    unitSalePrice: typeof item.unitSalePrice === 'number' ? item.unitSalePrice : undefined,
    subtotal: item.subtotal,
    productName: item.productName,
    variantName: item.variantName,
    sku: item.sku,
    thumbnail: item.thumbnail,
  };
};

const buildVendorSummaries = (items) => {
  const map = new Map();

  items.forEach((item) => {
    const key = item.vendorId?.toString();
    if (!key) return;

    const current = map.get(key) || {
      vendorId: item.vendorId,
      itemsCount: 0,
      totalQuantity: 0,
      subtotal: 0,
    };

    current.itemsCount += 1;
    current.totalQuantity += item.quantity;
    current.subtotal += item.subtotal;

    map.set(key, current);
  });

  return Array.from(map.values()).map((entry) => ({
    ...entry,
    subtotal: Number(entry.subtotal.toFixed(2)),
    status: 'pending',
    statusHistory: [
      {
        status: 'pending',
        notes: 'Pedido pendiente para la vendedora.',
        changedAt: new Date(),
        changedBy: 'system',
      },
    ],
  }));
};

const ensureBuyerActor = (user = {}) => {
  if (!user?._id) {
    throw buildError('USER_NOT_FOUND', 401);
  }

  if (user.role !== 'compradora' && user.role !== 'admin') {
    throw buildError('USER_NOT_ALLOWED', 403);
  }
};

const resolveVendorContext = async ({ actor, vendorId }) => {
  if (!actor?._id) {
    throw buildError('USER_NOT_FOUND', 401);
  }

  if (actor.role === 'vendedora') {
    const vendor = await getVendorByUserId(actor._id);
    return { vendorId: vendor._id.toString(), isSelf: true };
  }

  if (actor.role === 'admin') {
    if (!vendorId) {
      throw buildError('VENDOR_ID_REQUIRED', 400);
    }
    return { vendorId, isSelf: false };
  }

  throw buildError('USER_NOT_ALLOWED', 403);
};

const getBuyerSnapshot = async ({ user, shippingAddress }) => {
  try {
    const profile = await getBuyerProfileByUserId(user._id);
    return {
      buyerProfileId: profile._id,
      snapshot: {
        fullName: profile.fullName,
        phone: profile.phone,
        email: user.email,
      },
    };
  } catch (error) {
    return {
      buyerProfileId: undefined,
      snapshot: {
        fullName: shippingAddress.recipientName || user.email,
        phone: shippingAddress.phone,
        email: user.email,
      },
    };
  }
};

export const createOrderFromCart = async ({ user, shippingAddress, paymentMethod = {}, notes, shippingCost = 0 }) => {
  ensureBuyerActor(user);

  const { cart, validation } = await validateCartStockForUser({ userId: user._id });

  if (!cart.totalItems) {
    throw buildError('CART_EMPTY', 400);
  }

  if (!validation.isValid) {
    throw buildError('CART_VALIDATION_FAILED', 400, validation);
  }

  const { buyerProfileId, snapshot } = await getBuyerSnapshot({ user, shippingAddress });

  const orderItems = cart.items.map(mapCartItemToOrderItem);
  const vendors = buildVendorSummaries(orderItems);
  const safeShipping = typeof shippingCost === 'number' && shippingCost > 0 ? shippingCost : 0;
  const subtotal = cart.subtotal;
  const total = Number((subtotal + safeShipping).toFixed(2));

  const orderPayload = {
    orderNumber: await generateOrderNumber(),
    userId: user._id,
    buyerProfileId,
    buyerSnapshot: snapshot,
    shippingAddress,
    paymentMethod: {
      type: paymentMethod.type || 'manual',
      provider: paymentMethod.provider,
      reference: paymentMethod.reference,
    },
    currency: cart.currency || 'COP',
    subtotal,
    shippingCost: safeShipping,
    total,
    totalItems: cart.totalItems,
    totalQuantity: cart.totalQuantity,
    status: 'pending',
    statusHistory: [
      {
        status: 'pending',
        notes: 'Pedido creado automáticamente desde el carrito.',
        changedAt: new Date(),
        changedBy: 'system',
      },
    ],
    items: orderItems,
    vendors,
    notes,
  };

  const appliedAdjustments = [];

  try {
    for (const item of cart.items) {
      // eslint-disable-next-line no-await-in-loop
      await adjustProductStock({
        id: item.productId,
        variantId: item.variantId || undefined,
        quantity: -item.quantity,
        operation: 'increment',
        actor: { role: 'system' },
      });
      appliedAdjustments.push({ productId: item.productId, variantId: item.variantId, quantity: item.quantity });
    }

    const order = await Order.create(orderPayload);
    await clearCartItems({ userId: user._id });

    return sanitizeOrder(order);
  } catch (error) {
    await Promise.all(
      appliedAdjustments.map((adjustment) =>
        adjustProductStock({
          id: adjustment.productId,
          variantId: adjustment.variantId || undefined,
          quantity: adjustment.quantity,
          operation: 'increment',
          actor: { role: 'system' },
        }).catch(() => null),
      ),
    );
    throw error;
  }
};

export const listOrders = async ({ actor, page = 1, limit = 20 }) => {
  ensureBuyerActor(actor);

  const query = actor.role === 'admin' ? {} : { userId: actor._id };
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit),
    Order.countDocuments(query),
  ]);

  return {
    items: items.map(sanitizeOrder),
    total,
    page: safePage,
    pages: Math.max(Math.ceil(total / safeLimit), 1),
  };
};

const ensureOrderAccess = (order, actor) => {
  if (actor.role === 'admin') {
    return;
  }

  if (order.userId.toString() !== actor._id) {
    throw buildError('ORDER_FORBIDDEN', 403);
  }
};

export const getOrderById = async ({ id, actor }) => {
  ensureBuyerActor(actor);
  const order = await Order.findById(id);
  if (!order) {
    throw buildError('ORDER_NOT_FOUND', 404);
  }

  ensureOrderAccess(order, actor);
  return sanitizeOrder(order);
};

export const listVendorOrders = async ({ actor, page = 1, limit = 20, status, vendorId }) => {
  const { vendorId: scopeVendorId } = await resolveVendorContext({ actor, vendorId });

  const vendorObjectId = new Types.ObjectId(scopeVendorId);
  const query = { 'vendors.vendorId': vendorObjectId };
  if (status) {
    assertValidStatus(status);
    query['vendors.status'] = status;
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit),
    Order.countDocuments(query),
  ]);

  return {
    items: items.map((order) => sanitizeOrder(order, { vendorId: scopeVendorId })),
    total,
    page: safePage,
    pages: Math.max(Math.ceil(total / safeLimit), 1),
  };
};

export const getVendorOrderById = async ({ id, actor, vendorId }) => {
  const { vendorId: scopeVendorId } = await resolveVendorContext({ actor, vendorId });
  const order = await Order.findById(id);
  if (!order) {
    throw buildError('ORDER_NOT_FOUND', 404);
  }

  const vendorEntry = order.vendors.find((entry) => entry.vendorId.toString() === scopeVendorId);
  if (!vendorEntry) {
    throw buildError('ORDER_VENDOR_NOT_FOUND', 404);
  }

  return sanitizeOrder(order, { vendorId: scopeVendorId });
};

export const updateOrderStatus = async ({ id, status, notes, actor }) => {
  if (actor.role !== 'admin') {
    throw buildError('USER_NOT_ALLOWED', 403);
  }

  assertValidStatus(status);
  const order = await Order.findById(id);
  if (!order) {
    throw buildError('ORDER_NOT_FOUND', 404);
  }

  if (order.status === status) {
    return sanitizeOrder(order);
  }

  order.status = status;
  order.statusHistory.push({
    status,
    notes,
    changedAt: new Date(),
    changedBy: 'admin',
  });

  await order.save();
  return sanitizeOrder(order);
};

export const updateVendorOrderStatus = async ({ id, status, notes, actor, vendorId }) => {
  assertValidStatus(status);
  const { vendorId: scopeVendorId, isSelf } = await resolveVendorContext({ actor, vendorId });

  const order = await Order.findById(id);
  if (!order) {
    throw buildError('ORDER_NOT_FOUND', 404);
  }

  const vendorEntry = order.vendors.find((entry) => entry.vendorId.toString() === scopeVendorId);
  if (!vendorEntry) {
    throw buildError('ORDER_VENDOR_NOT_FOUND', 404);
  }

  vendorEntry.status = status;
  vendorEntry.statusHistory = vendorEntry.statusHistory || [];
  vendorEntry.statusHistory.push({
    status,
    notes,
    changedAt: new Date(),
    changedBy: actor.role === 'admin' && !isSelf ? 'admin' : 'vendor',
  });

  await order.save();

  const options = actor.role === 'vendedora' ? { vendorId: scopeVendorId } : {};
  return sanitizeOrder(order, options);
};
