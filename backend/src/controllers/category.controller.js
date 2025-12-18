import {
  createCategory,
  listCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
} from '../services/index.js';

const categoryErrorMessages = {
  CATEGORY_NAME_REQUIRED: 'Debes proporcionar el nombre de la categoría.',
  CATEGORY_SLUG_IN_USE: 'El slug ya está en uso.',
  CATEGORY_NOT_FOUND: 'Categoría no encontrada.',
  CATEGORY_INACTIVE: 'La categoría está inactiva.',
  NO_FIELDS_TO_UPDATE: 'Debes especificar al menos un campo para actualizar.',
};

const handleError = (res, error) => {
  const status = error.statusCode || 500;
  const message = categoryErrorMessages[error.message] || 'No se pudo completar la operación.';
  return res.status(status).json({ message });
};

export const createCategoryController = async (req, res) => {
  try {
    const category = await createCategory(req.body);
    return res.status(201).json({ message: 'Categoría creada.', category });
  } catch (error) {
    return handleError(res, error);
  }
};

export const listCategoriesController = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, isActive } = req.query;
    const normalizedIsActive =
      typeof isActive === 'boolean'
        ? isActive
        : typeof isActive === 'string'
          ? isActive === 'true'
          : undefined;
    const result = await listCategories({
      page: Number(page),
      limit: Number(limit),
      search,
      isActive: normalizedIsActive,
    });
    return res.json(result);
  } catch (error) {
    return handleError(res, error);
  }
};

export const getCategoryController = async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    return res.json({ category });
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const category = await updateCategoryById(req.params.id, req.body);
    return res.json({ message: 'Categoría actualizada.', category });
  } catch (error) {
    return handleError(res, error);
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    await deleteCategoryById(req.params.id);
    return res.json({ message: 'Categoría desactivada.' });
  } catch (error) {
    return handleError(res, error);
  }
};
