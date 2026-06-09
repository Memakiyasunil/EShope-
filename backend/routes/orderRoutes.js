import express from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  getSellerOrders,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('shippingAddress.fullName').notEmpty().withMessage('Full name is required'),
    body('shippingAddress.phone').notEmpty().withMessage('Phone is required'),
    body('shippingAddress.addressLine1').notEmpty().withMessage('Address is required'),
    body('shippingAddress.city').notEmpty().withMessage('City is required'),
    body('shippingAddress.state').notEmpty().withMessage('State is required'),
    body('shippingAddress.postalCode').notEmpty().withMessage('Postal code is required'),
    body('paymentMethod').isIn(['razorpay', 'stripe', 'cod']).withMessage('Invalid payment method'),
  ],
  validate,
  createOrder
);

router.get('/my-orders', getMyOrders);
router.get('/seller/orders', authorize('seller', 'admin'), getSellerOrders);
router.get('/all', authorize('admin'), getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', authorize('seller', 'admin'), updateOrderStatus);
router.put('/:id/cancel', cancelOrder);

export default router;
