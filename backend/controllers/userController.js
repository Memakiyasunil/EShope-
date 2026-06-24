import asyncHandler from '../utils/asyncHandler.js';
import ApiError, { sendSuccess } from '../utils/apiResponse.js';
import User from '../models/User.js';
import { uploadToCloud } from '../middleware/upload.js';

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (phone) user.phone = phone;

  if (req.file) {
    const uploaded = await uploadToCloud(req.file.path, 'avatars');
    user.avatar = uploaded.url;
  }

  await user.save();
  sendSuccess(res, 200, { user }, 'Profile updated');
});

export const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  sendSuccess(res, 200, { addresses: user.addresses });
});

export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (req.body.isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  user.addresses.push(req.body);
  await user.save();
  sendSuccess(res, 201, { addresses: user.addresses }, 'Address added');
});

export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) throw new ApiError(404, 'Address not found');

  if (req.body.isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  Object.assign(address, req.body);
  await user.save();
  sendSuccess(res, 200, { addresses: user.addresses }, 'Address updated');
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) throw new ApiError(404, 'Address not found');

  address.deleteOne();
  await user.save();
  sendSuccess(res, 200, { addresses: user.addresses }, 'Address deleted');
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter).select('-password -refreshToken').skip(skip).limit(limit).sort('-createdAt'),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: users,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -refreshToken');
  if (!user) throw new ApiError(404, 'User not found');
  sendSuccess(res, 200, { user });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  user.isActive = req.body.isActive;
  if (req.body.role) user.role = req.body.role;
  await user.save();

  sendSuccess(res, 200, { user }, 'User updated');
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  user.isActive = false;
  await user.save();
  sendSuccess(res, 200, {}, 'User deactivated');
});

// --- Payment Methods ---

export const getPaymentMethods = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  sendSuccess(res, 200, { paymentMethods: user.paymentMethods });
});

export const addPaymentMethod = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const { isDefault } = req.body;

  if (isDefault || user.paymentMethods.length === 0) {
    user.paymentMethods.forEach((pm) => (pm.isDefault = false));
  }

  user.paymentMethods.push({ ...req.body, isDefault: isDefault || user.paymentMethods.length === 0 });
  await user.save();

  sendSuccess(res, 201, { paymentMethods: user.paymentMethods }, 'Payment method added successfully');
});

export const updatePaymentMethod = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const pmIndex = user.paymentMethods.findIndex((pm) => pm._id.toString() === req.params.pmId);

  if (pmIndex === -1) throw new ApiError(404, 'Payment method not found');

  if (req.body.isDefault) {
    user.paymentMethods.forEach((pm) => (pm.isDefault = false));
  }

  user.paymentMethods[pmIndex] = { ...user.paymentMethods[pmIndex].toObject(), ...req.body };
  await user.save();

  sendSuccess(res, 200, { paymentMethods: user.paymentMethods }, 'Payment method updated successfully');
});

export const deletePaymentMethod = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const pmIndex = user.paymentMethods.findIndex((pm) => pm._id.toString() === req.params.pmId);

  if (pmIndex === -1) throw new ApiError(404, 'Payment method not found');

  const wasDefault = user.paymentMethods[pmIndex].isDefault;
  user.paymentMethods.splice(pmIndex, 1);

  if (wasDefault && user.paymentMethods.length > 0) {
    user.paymentMethods[0].isDefault = true;
  }

  await user.save();
  sendSuccess(res, 200, { paymentMethods: user.paymentMethods }, 'Payment method deleted successfully');
});
