import {
  createProduct,
  listProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  getVendorByUserId,
  addProductVariant,
  updateProductVariant,
  deleteProductVariant,
  adjustProductStock,
} from '../services/index.js';

const productErrorMessages = {
  PRODUCT_FIELDS_REQUIRED: 'Debes completar los campos obligatorios del producto.',
  CATEGORY_REQUIRED: 'Debes indicar la categoría del producto.',
  CATEGORY_NOT_FOUND: 'Categoría no encontrada.',
  CATEGORY_INACTIVE: 'La categoría seleccionada está inactiva.',
  VENDOR_ID_REQUIRED: 'Debes indicar la vendedora asociada.',
  VENDOR_PROFILE_NOT_FOUND: 'No se encontró el perfil de vendedora.',
  VENDOR_INACTIVE: 'La vendedora está inactiva.',
  PRODUCT_NOT_FOUND: 'Producto no encontrado.',
  PRODUCT_FORBIDDEN: 'No tienes permisos sobre este producto.',
  PRODUCT_SLUG_IN_USE: 'El slug ya está en uso por otro producto.',
  SALE_PRICE_INVALID: 'El precio en oferta debe ser menor al precio base.',
  SALE_PRICE_REQUIRES_PRICE: 'No puedes definir un precio en oferta sin precio base.',
  NO_FIELDS_TO_UPDATE: 'Debes especificar al menos un campo para actualizar.',
  VARIANT_NAME_REQUIRED: 'Cada variante debe tener un nombre.',
  VARIANT_STOCK_INVALID: 'El stock de la variante debe ser mayor o igual a 0.',
  VARIANT_SKU_IN_USE: 'El SKU de la variante ya está en uso en este producto.',
  VARIANT_NOT_FOUND: 'No se encontró la variante solicitada.',
  STOCK_MANAGED_BY_VARIANTS: 'Cuando hay variantes, el stock se administra desde ellas.',
  STOCK_CANNOT_BE_NEGATIVE: 'El stock no puede ser negativo.',
  INVALID_STOCK_OPERATION: 'Operación de stock inválida.',
  VARIANT_STOCK_REQUIRED: 'Debes especificar la variante para ajustar el stock.',
  STOCK_QUANTITY_REQUIRED: 'Debes indicar la cantidad para ajustar el stock.',
};

const handleError = (res, error) => {
  const status = error.statusCode || 500;
  const message = productErrorMessages[error.message] || 'No se pudo completar la operación.';
  return res.status(status).json({ message });
};

const parseOptionalBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value === 'true') return true;
    if (value === 'false') return false;
  }
  return undefined;
};

const parseOptionalNumber = (value) => {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
};

const buildActorContext = async (req) => {
  if (!req.user) return null;

  if (req.user.role === 'admin') {
    return { role: 'admin' };
  }

  if (req.user.role === 'vendedora') {
    const vendor = await getVendorByUserId(req.user._id);
    return { role: 'vendedora', vendorId: vendor._id?.toString() };
  }

  return { role: req.user.role };
};

const resolveVendorIdForCreate = async (req) => {
  if (req.user.role === 'admin') {
    return req.body.vendorId;
  }
  const actor = await buildActorContext(req);
  return actor?.vendorId;
};

export const createProductController = async (req, res) => {
  try {
    const vendorId = await resolveVendorIdForCreate(req);
    const payload = { ...req.body };
    delete payload.vendorId;

    const product = await createProduct({
      vendorId,
      payload,
    });

    return res.status(201).json({ message: 'Producto creado.', product });
  } catch (error) {
    return handleError(res, error);
  }
};

export const listProductsController = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      categoryId,
      vendorId,
      isActive,
      isPublished,
      minPrice,
      maxPrice,
    } = req.query;

    const result = await listProducts({
      page: Number(page),
      limit: Number(limit),
      search,
      categoryId,
      vendorId,
      isActive: parseOptionalBoolean(isActive),
      isPublished: parseOptionalBoolean(isPublished),
      minPrice: parseOptionalNumber(minPrice),
      maxPrice: parseOptionalNumber(maxPrice),
    });

    return res.json(result);
  } catch (error) {
    return handleError(res, error);
  }
};

export const getProductController = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    return res.json({ product });
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateProductController = async (req, res) => {
  try {
    const actor = await buildActorContext(req);
    const payload = { ...req.body };
    delete payload.vendorId;

    const product = await updateProductById({
      id: req.params.id,
      updates: payload,
      actor,
    });

    return res.json({ message: 'Producto actualizado.', product });
  } catch (error) {
    return handleError(res, error);
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const actor = await buildActorContext(req);
    await deleteProductById({ id: req.params.id, actor });
    return res.json({ message: 'Producto desactivado.' });
  } catch (error) {
    return handleError(res, error);
  }
};

export const addProductVariantController = async (req, res) => {
  try {
    const actor = await buildActorContext(req);
    const variant = await addProductVariant({ id: req.params.id, variant: req.body, actor });
    return res.status(201).json({ message: 'Variante creada.', variant });
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateProductVariantController = async (req, res) => {
  try {
    const actor = await buildActorContext(req);
    const variant = await updateProductVariant({
      id: req.params.id,
      variantId: req.params.variantId,
      updates: req.body,
      actor,
    });
    return res.json({ message: 'Variante actualizada.', variant });
  } catch (error) {
    return handleError(res, error);
  }
};

export const deleteProductVariantController = async (req, res) => {
  try {
    const actor = await buildActorContext(req);
    await deleteProductVariant({ id: req.params.id, variantId: req.params.variantId, actor });
    return res.json({ message: 'Variante eliminada.' });
  } catch (error) {
    return handleError(res, error);
  }
};

export const adjustProductStockController = async (req, res) => {
  try {
    const actor = await buildActorContext(req);
    const { variantId, quantity, operation } = req.body;
    const product = await adjustProductStock({
      id: req.params.id,
      variantId,
      quantity,
      operation,
      actor,
    });
    return res.json({ message: 'Stock actualizado.', product });
  } catch (error) {
    return handleError(res, error);
  }
};
