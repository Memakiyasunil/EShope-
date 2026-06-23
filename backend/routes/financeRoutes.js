import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getAllWithdrawals,
  updateWithdrawalStatus,
  requestWithdrawal,
  getSellerWithdrawals,
} from '../controllers/financeController.js';

const router = express.Router();

router.use(protect);

// Seller Routes
router.get('/withdrawals/me', authorize('seller'), getSellerWithdrawals);
router.post('/withdrawals', authorize('seller'), requestWithdrawal);

// Admin Routes
router.get('/withdrawals', authorize('admin'), getAllWithdrawals);
router.put('/withdrawals/:id', authorize('admin'), updateWithdrawalStatus);

export default router;
