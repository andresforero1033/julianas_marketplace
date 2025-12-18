import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  generateUploadUrlController,
  createMediaAssetController,
  listMediaAssetsController,
  deleteMediaAssetController,
} from '../controllers/index.js';
import { validateRequest, requireAuth } from '../middlewares/index.js';
import { MEDIA_OWNER_TYPES } from '../models/index.js';

const router = Router();

const uploadUrlValidations = [
  body('fileName').isString().trim().withMessage('fileName es obligatorio.'),
  body('mimeType').isString().trim().withMessage('mimeType es obligatorio.'),
  body('fileSize').optional().isInt({ min: 0 }).withMessage('fileSize debe ser >= 0.').toInt(),
];

const assetValidations = [
  body('url').isString().trim().withMessage('url es obligatoria.'),
  body('thumbnailUrl').optional().isString().trim().withMessage('thumbnailUrl debe ser texto.'),
  body('ownerType')
    .optional()
    .isIn(MEDIA_OWNER_TYPES)
    .withMessage(`ownerType debe ser uno de: ${MEDIA_OWNER_TYPES.join(', ')}.`),
  body('ownerId').optional().isMongoId().withMessage('ownerId debe ser un ObjectId válido.'),
  body('originalFileName').optional().isString().trim().withMessage('originalFileName debe ser texto.'),
  body('mimeType').optional().isString().trim().withMessage('mimeType debe ser texto.'),
  body('fileSize').optional().isInt({ min: 0 }).withMessage('fileSize debe ser >= 0.').toInt(),
  body('width').optional().isInt({ min: 0 }).withMessage('width debe ser >= 0.').toInt(),
  body('height').optional().isInt({ min: 0 }).withMessage('height debe ser >= 0.').toInt(),
  body('tags').optional().isArray({ max: 20 }).withMessage('tags debe ser un arreglo de strings.'),
  body('tags.*').optional({ nullable: true }).isString().trim().withMessage('Cada tag debe ser texto.'),
  body('meta')
    .optional()
    .custom((value) => typeof value === 'object' && !Array.isArray(value))
    .withMessage('meta debe ser un objeto.'),
];

const listValidations = [
  query('ownerType')
    .optional()
    .isIn(MEDIA_OWNER_TYPES)
    .withMessage(`ownerType debe ser uno de: ${MEDIA_OWNER_TYPES.join(', ')}.`),
  query('ownerId').optional().isMongoId().withMessage('ownerId debe ser un ObjectId válido.'),
  query('page').optional().isInt({ min: 1 }).withMessage('page debe ser >= 1.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit debe estar entre 1 y 100.'),
];

const assetIdValidation = [param('id').isMongoId().withMessage('El ID proporcionado no es válido.')];

router.post('/presign', requireAuth, validateRequest(uploadUrlValidations), generateUploadUrlController);
router.post('/assets', requireAuth, validateRequest(assetValidations), createMediaAssetController);
router.get('/assets', requireAuth, validateRequest(listValidations), listMediaAssetsController);
router.delete('/assets/:id', requireAuth, validateRequest(assetIdValidation), deleteMediaAssetController);

export default router;
