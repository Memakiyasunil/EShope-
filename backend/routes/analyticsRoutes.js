import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getSalesAnalytics,
  getUserAnalytics,
  getSellerAnalytics,
  getOrderAnalytics,
  getSuperAdminFinances
} from '../controllers/analyticsController.js';

const router = express.Router();

router.use(protect);

// Admin Analytics
router.get('/sales', authorize('admin'), getSalesAnalytics);
router.get('/users', authorize('admin'), getUserAnalytics);
router.get('/orders', authorize('admin'), getOrderAnalytics);
router.get('/finances', authorize('admin'), getSuperAdminFinances);

// Seller Analytics
router.get('/seller', authorize('seller', 'admin'), getSellerAnalytics);

export default router;
