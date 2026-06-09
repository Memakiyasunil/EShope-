import express from 'express';
import { body } from 'express-validator';
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  broadcastNotification,
} from '../controllers/notificationController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.get('/', getMyNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

router.post(
  '/',
  authorize('admin'),
  [
    body('user').notEmpty().withMessage('User ID is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('message').notEmpty().withMessage('Message is required'),
  ],
  validate,
  createNotification
);

router.post(
  '/broadcast',
  authorize('admin'),
  [
    body('userIds').isArray({ min: 1 }).withMessage('User IDs array is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('message').notEmpty().withMessage('Message is required'),
  ],
  validate,
  broadcastNotification
);

export default router;
