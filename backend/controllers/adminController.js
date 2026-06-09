import asyncHandler from '../utils/asyncHandler.js';
import ApiError, { sendSuccess } from '../utils/apiResponse.js';
import User from '../models/User.js';
import Seller from '../models/Seller.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Review from '../models/Review.js';
import Category from '../models/Category.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalSellers,
    totalProducts,
    totalOrders,
    pendingSellers,
    pendingReviews,
    recentOrders,
    revenueResult,
  ] = await Promise.all([
    User.countDocuments({ role: 'buyer' }),
    Seller.countDocuments({ status: 'approved' }),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Seller.countDocuments({ status: 'pending' }),
    Review.countDocuments({ isApproved: false }),
    Order.find().populate('user', 'name email').sort('-createdAt').limit(5),
    Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ]);

  const totalRevenue = revenueResult[0]?.total || 0;

  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  sendSuccess(res, 200, {
    stats: {
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingSellers,
      pendingReviews,
    },
    ordersByStatus,
    recentOrders,
  });
});

export const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(400, 'User already exists');

  const admin = await User.create({
    name,
    email,
    password,
    role: 'admin',
    isEmailVerified: true,
  });

  sendSuccess(res, 201, {
    admin: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  }, 'Admin created');
});

export const getPendingApprovals = asyncHandler(async (req, res) => {
  const [sellers, reviews] = await Promise.all([
    Seller.find({ status: 'pending' }).populate('user', 'name email phone'),
    Review.find({ isApproved: false }).populate('user', 'name').populate('product', 'name'),
  ]);

  sendSuccess(res, 200, { sellers, reviews });
});

export const toggleMaintenance = asyncHandler(async (req, res) => {
  const Settings = (await import('../models/Settings.js')).default;
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});

  settings.maintenanceMode = req.body.maintenanceMode ?? !settings.maintenanceMode;
  if (req.body.message) settings.maintenanceMessage = req.body.message;
  await settings.save();

  sendSuccess(res, 200, {
    maintenanceMode: settings.maintenanceMode,
    maintenanceMessage: settings.maintenanceMessage,
  }, 'Maintenance mode updated');
});

export const getSystemStats = asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [newUsers, newOrders, newProducts, categories] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Order.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Product.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Category.countDocuments({ isActive: true }),
  ]);

  sendSuccess(res, 200, {
    last30Days: { newUsers, newOrders, newProducts },
    activeCategories: categories,
  });
});
