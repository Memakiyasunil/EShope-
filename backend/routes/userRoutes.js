import express from 'express';
import { body } from 'express-validator';
import {
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.put('/profile', upload.single('avatar'), updateProfile);
router.get('/addresses', getAddresses);
router.post(
  '/addresses',
  [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('addressLine1').notEmpty().withMessage('Address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('postalCode').notEmpty().withMessage('Postal code is required'),
  ],
  validate,
  addAddress
);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);

router.get('/payment-methods', getPaymentMethods);
router.post(
  '/payment-methods',
  [
    body('cardNumber').notEmpty().withMessage('Card number is required'),
    body('expiryDate').notEmpty().withMessage('Expiry date is required'),
    body('cvv').notEmpty().withMessage('CVV is required'),
    body('nameOnCard').notEmpty().withMessage('Name on card is required'),
  ],
  validate,
  addPaymentMethod
);
router.put('/payment-methods/:pmId', updatePaymentMethod);
router.delete('/payment-methods/:pmId', deletePaymentMethod);

router.get('/', authorize('admin'), getAllUsers);
router.get('/:id', authorize('admin'), getUserById);
router.put('/:id/status', authorize('admin'), updateUserStatus);
router.delete('/:id', authorize('admin'), deleteUser);

export default router;
