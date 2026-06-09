import asyncHandler from '../utils/asyncHandler.js';
import ApiError, { sendSuccess } from '../utils/apiResponse.js';
import Coupon from '../models/Coupon.js';
import Seller from '../models/Seller.js';

export const createCoupon = asyncHandler(async (req, res) => {
  const data = { ...req.body, code: req.body.code.toUpperCase() };

  if (req.user.role === 'seller') {
    const seller = await Seller.findOne({ user: req.user._id });
    if (!seller) throw new ApiError(404, 'Seller profile not found');
    data.seller = seller._id;
  }

  const coupon = await Coupon.create(data);
  sendSuccess(res, 201, { coupon }, 'Coupon created');
});

export const getCoupons = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.active === 'true') {
    const now = new Date();
    filter.isActive = true;
    filter.startDate = { $lte: now };
    filter.endDate = { $gte: now };
  }
  if (req.query.seller) filter.seller = req.query.seller;

  const [coupons, total] = await Promise.all([
    Coupon.find(filter).skip(skip).limit(limit).sort('-createdAt'),
    Coupon.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: coupons,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getCouponById = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  sendSuccess(res, 200, { coupon });
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase(), isActive: true });
  if (!coupon) throw new ApiError(404, 'Invalid coupon');

  const now = new Date();
  if (now < coupon.startDate || now > coupon.endDate) {
    throw new ApiError(400, 'Coupon expired or not yet active');
  }
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    throw new ApiError(400, 'Coupon usage limit reached');
  }

  sendSuccess(res, 200, { coupon, valid: true }, 'Coupon is valid');
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) throw new ApiError(404, 'Coupon not found');

  Object.assign(coupon, req.body);
  if (req.body.code) coupon.code = req.body.code.toUpperCase();
  await coupon.save();

  sendSuccess(res, 200, { coupon }, 'Coupon updated');
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) throw new ApiError(404, 'Coupon not found');

  coupon.isActive = false;
  await coupon.save();
  sendSuccess(res, 200, {}, 'Coupon deactivated');
});
