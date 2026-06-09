import express from 'express';
import { body } from 'express-validator';
import {
  createProduct,
  getProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  getFeaturedProducts,
  getProductReviews,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/seller/my-products', protect, authorize('seller', 'admin'), getSellerProducts);
router.get('/featured', getFeaturedProducts);
router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id/reviews', getProductReviews);
router.get('/:id', getProductById);

router.post(
  '/',
  protect,
  authorize('seller', 'admin'),
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('sku').trim().notEmpty().withMessage('SKU is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('quantity').isInt({ min: 0 }).withMessage('Valid quantity is required'),
  ],
  validate,
  upload.array('images', 10),
  createProduct
);

router.put(
  '/:id',
  protect,
  authorize('seller', 'admin'),
  upload.array('images', 10),
  updateProduct
);

router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct);

export default router;
