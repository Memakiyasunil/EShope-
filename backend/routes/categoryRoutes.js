import express from 'express';
import { body } from 'express-validator';
import {
  createCategory,
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', getCategoryById);

router.post(
  '/',
  protect,
  authorize('admin'),
  [body('name').trim().notEmpty().withMessage('Category name is required')],
  validate,
  upload.single('image'),
  createCategory
);

router.put('/:id', protect, authorize('admin'), upload.single('image'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

router.post(
  '/:id/subcategories',
  protect,
  authorize('admin'),
  [body('name').trim().notEmpty().withMessage('Sub-category name is required')],
  validate,
  addSubCategory
);

router.put('/:id/subcategories/:subId', protect, authorize('admin'), updateSubCategory);
router.delete('/:id/subcategories/:subId', protect, authorize('admin'), deleteSubCategory);

export default router;
