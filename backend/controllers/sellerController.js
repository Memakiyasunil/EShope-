import asyncHandler from '../utils/asyncHandler.js';
import ApiError, { sendSuccess } from '../utils/apiResponse.js';
import Seller from '../models/Seller.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { uploadToCloud } from '../middleware/upload.js';
import { sendSellerApprovalEmail } from '../services/emailService.js';

export const registerSeller = asyncHandler(async (req, res) => {
  const existing = await Seller.findOne({ user: req.user._id });
  if (existing) throw new ApiError(400, 'Seller profile already exists');

  const seller = await Seller.create({
    user: req.user._id,
    ...req.body,
    email: req.body.email || req.user.email,
  });

  await User.findByIdAndUpdate(req.user._id, { role: 'seller' });

  sendSuccess(res, 201, { seller }, 'Seller registration submitted');
});

export const getMySellerProfile = asyncHandler(async (req, res) => {
  const seller = await Seller.findOne({ user: req.user._id }).populate('user', 'name email phone avatar');
  if (!seller) throw new ApiError(404, 'Seller profile not found');
  sendSuccess(res, 200, { seller });
});

export const updateSellerProfile = asyncHandler(async (req, res) => {
  const seller = await Seller.findOne({ user: req.user._id });
  if (!seller) throw new ApiError(404, 'Seller profile not found');

  const allowed = [
    'shopName', 'description', 'email', 'phone', 'address',
    'gstNumber', 'panNumber', 'bankDetails',
  ];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) seller[field] = req.body[field];
  });

  if (req.files?.logo?.[0]) {
    const uploaded = await uploadToCloud(req.files.logo[0].path, 'sellers');
    seller.logo = uploaded.url;
  }
  if (req.files?.banner?.[0]) {
    const uploaded = await uploadToCloud(req.files.banner[0].path, 'sellers');
    seller.banner = uploaded.url;
  }

  await seller.save();
  sendSuccess(res, 200, { seller }, 'Seller profile updated');
});

export const getSellerById = asyncHandler(async (req, res) => {
  const seller = await Seller.findById(req.params.id)
    .populate('user', 'name email avatar')
    .select('-bankDetails');
  if (!seller || !seller.isActive) throw new ApiError(404, 'Seller not found');
  sendSuccess(res, 200, { seller });
});

export const getSellerBySlug = asyncHandler(async (req, res) => {
  const seller = await Seller.findOne({ slug: req.params.slug, isActive: true, status: 'approved' })
    .populate('user', 'name avatar')
    .select('-bankDetails');
  if (!seller) throw new ApiError(404, 'Seller not found');
  sendSuccess(res, 200, { seller });
});

export const getAllSellers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    filter.shopName = { $regex: req.query.search, $options: 'i' };
  }

  const [sellers, total] = await Promise.all([
    Seller.find(filter)
      .populate('user', 'name email')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt'),
    Seller.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: sellers,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getSellerProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find({ seller: req.params.id, isActive: true })
      .populate('category', 'name slug')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt'),
    Product.countDocuments({ seller: req.params.id, isActive: true }),
  ]);

  res.status(200).json({
    success: true,
    data: products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const approveSeller = asyncHandler(async (req, res) => {
  const seller = await Seller.findById(req.params.id).populate('user');
  if (!seller) throw new ApiError(404, 'Seller not found');

  seller.status = 'approved';
  seller.isVerified = true;
  seller.isActive = true;
  seller.rejectionReason = undefined;
  await seller.save();

  try {
    await sendSellerApprovalEmail(seller.user, seller, true);
  } catch {
    console.warn('Seller approval email could not be sent');
  }

  sendSuccess(res, 200, { seller }, 'Seller approved');
});

export const rejectSeller = asyncHandler(async (req, res) => {
  const seller = await Seller.findById(req.params.id).populate('user');
  if (!seller) throw new ApiError(404, 'Seller not found');

  seller.status = 'rejected';
  seller.rejectionReason = req.body.reason || 'Application rejected';
  await seller.save();

  try {
    await sendSellerApprovalEmail(seller.user, seller, false);
  } catch {
    console.warn('Seller rejection email could not be sent');
  }

  sendSuccess(res, 200, { seller }, 'Seller rejected');
});

export const suspendSeller = asyncHandler(async (req, res) => {
  const seller = await Seller.findById(req.params.id);
  if (!seller) throw new ApiError(404, 'Seller not found');

  seller.status = 'suspended';
  seller.isActive = false;
  await seller.save();

  sendSuccess(res, 200, { seller }, 'Seller suspended');
});
