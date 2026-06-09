import express from 'express';
import { getSettings, updateSettings, getPublicSettings } from '../controllers/settingsController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/public', getPublicSettings);
router.get('/', protect, authorize('admin'), getSettings);
router.put(
  '/',
  protect,
  authorize('admin'),
  upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'favicon', maxCount: 1 }]),
  updateSettings
);

export default router;
