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
