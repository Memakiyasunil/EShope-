import express from 'express';
import { body } from 'express-validator';
import {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  approveReview,
  markHelpful,
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getReviews);

router.post(
  '/',
  protect,
  [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required'),
  ],
  validate,
  upload.array('images', 5),
  createReview
);

router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.put('/:id/approve', protect, authorize('admin'), approveReview);
router.put('/:id/helpful', markHelpful);

export default router;
