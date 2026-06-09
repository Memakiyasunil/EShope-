import express from 'express';
import { body } from 'express-validator';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  moveToCart,
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.get('/', getWishlist);
router.post(
  '/',
  [body('productId').notEmpty().withMessage('Product ID is required')],
  validate,
  addToWishlist
);
router.delete('/:productId', removeFromWishlist);
router.delete('/', clearWishlist);
router.post('/:productId/move-to-cart', moveToCart);

export default router;
