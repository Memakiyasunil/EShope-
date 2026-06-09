import express from 'express';
import { body } from 'express-validator';
import {
  createBanner,
  getBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} from '../controllers/bannerController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getBanners);
router.get('/:id', getBannerById);

router.post(
  '/',
  protect,
  authorize('admin'),
  [body('title').trim().notEmpty().withMessage('Title is required')],
  validate,
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'mobileImage', maxCount: 1 }]),
  createBanner
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'mobileImage', maxCount: 1 }]),
  updateBanner
);

router.delete('/:id', protect, authorize('admin'), deleteBanner);

export default router;
