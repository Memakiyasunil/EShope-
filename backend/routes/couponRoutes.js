import express from 'express';
import { body } from 'express-validator';
import {
  createCoupon,
  getCoupons,
  getCouponById,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.get('/', getCoupons);
router.get('/validate/:code', validateCoupon);
router.get('/:id', getCouponById);

router.post(
  '/',
  protect,
  authorize('admin', 'seller'),
  [
    body('code').trim().notEmpty().withMessage('Coupon code is required'),
    body('discountType').isIn(['percentage', 'fixed']).withMessage('Invalid discount type'),
    body('discountValue').isFloat({ min: 0 }).withMessage('Valid discount value is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate').isISO8601().withMessage('Valid end date is required'),
  ],
  validate,
  createCoupon
);

router.put('/:id', protect, authorize('admin', 'seller'), updateCoupon);
router.delete('/:id', protect, authorize('admin', 'seller'), deleteCoupon);

export default router;
