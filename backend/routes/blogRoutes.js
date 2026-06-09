import express from 'express';
import { body } from 'express-validator';
import {
  createBlog,
  getBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  publishBlog,
} from '../controllers/blogController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/slug/:slug', getBlogBySlug);
router.get('/:id', getBlogById);

router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
  ],
  validate,
  upload.single('coverImage'),
  createBlog
);

router.put('/:id', protect, authorize('admin'), upload.single('coverImage'), updateBlog);
router.delete('/:id', protect, authorize('admin'), deleteBlog);
router.put('/:id/publish', protect, authorize('admin'), publishBlog);

export default router;
