import express from 'express';
import { body } from 'express-validator';
import {
  register,
  verifyOtp,
  login,
  refreshToken,
  logout,
  getMe,
  forgotPassword,
  resendOtp,
  verifyPasswordResetOtp,
  resetPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post(
  '/register',
  authLimiter,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  register
);

router.post(
  '/verify-otp',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').notEmpty().withMessage('OTP is required'),
  ],
  validate,
  verifyOtp
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.post('/refresh-token', authLimiter, refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

// Password Reset Flow
router.post(
  '/forgot-password',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required')
  ],
  validate,
  forgotPassword
);

router.post(
  '/resend-otp',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required')
  ],
  validate,
  resendOtp
);

router.post(
  '/verify-password-reset-otp',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').notEmpty().withMessage('OTP is required')
  ],
  validate,
  verifyPasswordResetOtp
);

router.post(
  '/reset-password',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('resetToken').notEmpty().withMessage('Reset token is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  ],
  validate,
  resetPassword
);

export default router;
