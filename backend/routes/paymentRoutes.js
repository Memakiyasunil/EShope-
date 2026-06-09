import express from 'express';
import { body } from 'express-validator';
import {
  initiatePayment,
  verifyRazorpay,
  verifyStripe,
  getPaymentByOrder,
  getAllPayments,
  refund,
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { paymentLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(protect);

router.post('/:orderId/initiate', paymentLimiter, initiatePayment);
router.post(
  '/verify/razorpay',
  paymentLimiter,
  [
    body('razorpayOrderId').notEmpty().withMessage('Razorpay order ID is required'),
    body('razorpayPaymentId').notEmpty().withMessage('Razorpay payment ID is required'),
    body('razorpaySignature').notEmpty().withMessage('Razorpay signature is required'),
  ],
  validate,
  verifyRazorpay
);
router.post(
  '/verify/stripe',
  paymentLimiter,
  [body('sessionId').notEmpty().withMessage('Session ID is required')],
  validate,
  verifyStripe
);
router.get('/order/:orderId', getPaymentByOrder);
router.get('/', authorize('admin'), getAllPayments);
router.post('/:paymentId/refund', authorize('admin'), refund);

export default router;
