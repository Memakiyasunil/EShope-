import express from 'express';
import {
  getSalesAnalytics,
  getUserAnalytics,
  getSellerAnalytics,
  getOrderAnalytics,
} from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/sales', authorize('admin'), getSalesAnalytics);
router.get('/users', authorize('admin'), getUserAnalytics);
router.get('/orders', authorize('admin'), getOrderAnalytics);
router.get('/seller', authorize('seller', 'admin'), getSellerAnalytics);

export default router;
