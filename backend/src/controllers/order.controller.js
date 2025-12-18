import {
  createOrderFromCart,
  listOrders,
  getOrderById,
  listVendorOrders,
  getVendorOrderById,
  updateOrderStatus,
  updateVendorOrderStatus,
} from '../services/index.js';

const orderErrorMessages = {
  USER_NOT_FOUND: 'Usuario no encontrado.',
  USER_NOT_ALLOWED: 'No puedes realizar esta acción.',
  CART_EMPTY: 'Tu carrito está vacío.',
  CART_VALIDATION_FAILED: 'Actualiza tu carrito antes de confirmar el pedido.',
  ORDER_NOT_FOUND: 'Pedido no encontrado.',
  ORDER_FORBIDDEN: 'No tienes permisos sobre este pedido.',
  ORDER_STATUS_INVALID: 'El estado enviado no es válido.',
  ORDER_VENDOR_NOT_FOUND: 'La vendedora no está asociada a este pedido.',
  VENDOR_ID_REQUIRED: 'Debes indicar la vendedora objetivo.',
};

const handleError = (res, error) => {
  const status = error.statusCode || 500;
  const message = orderErrorMessages[error.message] || 'No pudimos procesar el pedido.';
  const response = { message };

  if (error.metadata) {
    response.details = error.metadata;
  }

  return res.status(status).json(response);
};

export const createOrderController = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, notes, shippingCost } = req.body;
    const order = await createOrderFromCart({
      user: req.user,
      shippingAddress,
      paymentMethod,
      notes,
      shippingCost,
    });

    return res.status(201).json({ message: 'Pedido creado correctamente.', order });
  } catch (error) {
    return handleError(res, error);
  }
};

export const listOrdersController = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await listOrders({ actor: req.user, page: Number(page), limit: Number(limit) });
    return res.json(result);
  } catch (error) {
    return handleError(res, error);
  }
};

export const getOrderController = async (req, res) => {
  try {
    const order = await getOrderById({ id: req.params.id, actor: req.user });
    return res.json({ order });
  } catch (error) {
    return handleError(res, error);
  }
};

export const listVendorOrdersController = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, vendorId } = req.query;
    const result = await listVendorOrders({
      actor: req.user,
      page: Number(page),
      limit: Number(limit),
      status,
      vendorId,
    });
    return res.json(result);
  } catch (error) {
    return handleError(res, error);
  }
};

export const getVendorOrderController = async (req, res) => {
  try {
    const order = await getVendorOrderById({ id: req.params.id, actor: req.user, vendorId: req.query.vendorId });
    return res.json({ order });
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateOrderStatusController = async (req, res) => {
  try {
    const order = await updateOrderStatus({ id: req.params.id, status: req.body.status, notes: req.body.notes, actor: req.user });
    return res.json({ message: 'Estado de pedido actualizado.', order });
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateVendorOrderStatusController = async (req, res) => {
  try {
    const order = await updateVendorOrderStatus({
      id: req.params.id,
      status: req.body.status,
      notes: req.body.notes,
      vendorId: req.body.vendorId,
      actor: req.user,
    });
    return res.json({ message: 'Estado para la vendedora actualizado.', order });
  } catch (error) {
    return handleError(res, error);
  }
};
