import express from 'express';
import { body } from 'express-validator';
import {
  registerSeller,
  getMySellerProfile,
  updateSellerProfile,
  getSellerById,
  getSellerBySlug,
  getAllSellers,
  getSellerProducts,
  approveSeller,
  rejectSeller,
  suspendSeller,
} from '../controllers/sellerController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/me/profile', protect, authorize('seller', 'admin'), getMySellerProfile);
router.put(
  '/me/profile',
  protect,
  authorize('seller', 'admin'),
  upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'banner', maxCount: 1 }]),
  updateSellerProfile
);

router.post(
  '/register',
  protect,
  [
    body('shopName').trim().notEmpty().withMessage('Shop name is required'),
  ],
  validate,
  registerSeller
);

router.get('/', getAllSellers);
router.get('/slug/:slug', getSellerBySlug);
router.get('/:id/products', getSellerProducts);
router.get('/:id', getSellerById);

router.put('/:id/approve', protect, authorize('admin'), approveSeller);
router.put('/:id/reject', protect, authorize('admin'), rejectSeller);
router.put('/:id/suspend', protect, authorize('admin'), suspendSeller);

export default router;
