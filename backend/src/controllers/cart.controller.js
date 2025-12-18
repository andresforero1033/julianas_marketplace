import {
  getCartForUser,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCartItems,
  validateCartStockForUser,
} from '../services/index.js';

const cartErrorMessages = {
  PRODUCT_NOT_FOUND: 'Producto no encontrado.',
  PRODUCT_NOT_AVAILABLE: 'El producto no está disponible para la venta.',
  VARIANT_REQUIRED: 'Debes seleccionar una variante para este producto.',
  VARIANT_NOT_FOUND: 'No encontramos la variante solicitada.',
  VARIANT_INACTIVE: 'La variante seleccionada no está activa.',
  QUANTITY_INVALID: 'La cantidad debe ser mayor o igual a 1.',
  INSUFFICIENT_STOCK: 'No hay suficiente stock para completar la operación.',
  CART_ITEM_NOT_FOUND: 'El producto no existe en tu carrito.',
  UNKNOWN_ERROR: 'Ocurrió un error inesperado al validar el carrito.',
};

const handleError = (res, error) => {
  const status = error.statusCode || 500;
  const message = cartErrorMessages[error.message] || 'No pudimos procesar el carrito.';
  return res.status(status).json({ message });
};

export const getCartController = async (req, res) => {
  try {
    const cart = await getCartForUser({ userId: req.user._id });
    return res.json({ cart });
  } catch (error) {
    return handleError(res, error);
  }
};

export const addCartItemController = async (req, res) => {
  try {
    const { productId, variantId, quantity } = req.body;
    const cart = await addItemToCart({ userId: req.user._id, productId, variantId, quantity });
    return res.status(201).json({ message: 'Producto agregado al carrito.', cart });
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateCartItemController = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await updateCartItem({ userId: req.user._id, itemId: req.params.itemId, quantity });
    return res.json({ message: 'Carrito actualizado.', cart });
  } catch (error) {
    return handleError(res, error);
  }
};

export const removeCartItemController = async (req, res) => {
  try {
    const cart = await removeCartItem({ userId: req.user._id, itemId: req.params.itemId });
    return res.json({ message: 'Producto eliminado del carrito.', cart });
  } catch (error) {
    return handleError(res, error);
  }
};

export const clearCartController = async (req, res) => {
  try {
    const cart = await clearCartItems({ userId: req.user._id });
    return res.json({ message: 'Carrito vaciado.', cart });
  } catch (error) {
    return handleError(res, error);
  }
};

export const validateCartStockController = async (req, res) => {
  try {
    const result = await validateCartStockForUser({ userId: req.user._id });
    const message = result.validation.isValid
      ? 'Stock verificado con éxito.'
      : 'Algunos productos tienen incidencias de stock.';
    return res.json({ message, ...result });
  } catch (error) {
    return handleError(res, error);
  }
};
