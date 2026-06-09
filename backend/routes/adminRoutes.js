import express from 'express';
import { body } from 'express-validator';
import {
  getDashboard,
  createAdmin,
  getPendingApprovals,
  toggleMaintenance,
  getSystemStats,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/pending-approvals', getPendingApprovals);
router.get('/system-stats', getSystemStats);
router.put('/maintenance', toggleMaintenance);

router.post(
  '/create-admin',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  createAdmin
);

export default router;
