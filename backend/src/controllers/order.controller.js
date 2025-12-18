import { createOrderFromCart, listOrders, getOrderById } from '../services/index.js';

const orderErrorMessages = {
  USER_NOT_FOUND: 'Usuario no encontrado.',
  USER_NOT_ALLOWED: 'No puedes realizar esta acción.',
  CART_EMPTY: 'Tu carrito está vacío.',
  CART_VALIDATION_FAILED: 'Actualiza tu carrito antes de confirmar el pedido.',
  ORDER_NOT_FOUND: 'Pedido no encontrado.',
  ORDER_FORBIDDEN: 'No tienes permisos sobre este pedido.',
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
