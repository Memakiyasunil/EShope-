import asyncHandler from '../utils/asyncHandler.js';
import ApiError, { sendSuccess } from '../utils/apiResponse.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Seller from '../models/Seller.js';

export const getSalesAnalytics = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [salesByDay, revenueByDay, topProducts] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $nin: ['cancelled'] } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Payment.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: 'completed' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          amount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Product.find({ isActive: true })
      .sort('-totalSold')
      .limit(10)
      .select('name sku totalSold price rating images'),
  ]);

  sendSuccess(res, 200, { salesByDay, revenueByDay, topProducts, period: days });
});

export const getUserAnalytics = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [usersByRole, registrationsByDay, activeBuyers] = await Promise.all([
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Order.distinct('user', { createdAt: { $gte: startDate } }),
  ]);

  sendSuccess(res, 200, {
    usersByRole,
    registrationsByDay,
    activeBuyers: activeBuyers.length,
    period: days,
  });
});

export const getSellerAnalytics = asyncHandler(async (req, res) => {
  const seller = await Seller.findOne({ user: req.user._id });
  if (!seller && req.user.role !== 'admin') {
    throw new ApiError(404, 'Seller profile not found');
  }

  const sellerId = req.user.role === 'admin' && req.query.sellerId
    ? req.query.sellerId
    : seller._id;

  const days = parseInt(req.query.days) || 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [orders, revenue, topProducts] = await Promise.all([
    Order.countDocuments({
      'items.seller': sellerId,
      createdAt: { $gte: startDate },
    }),
    Order.aggregate([
      {
        $match: {
          'items.seller': sellerId,
          createdAt: { $gte: startDate },
          status: { $nin: ['cancelled', 'returned'] },
        },
      },
      { $unwind: '$items' },
      { $match: { 'items.seller': sellerId } },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: {
              $multiply: [
                { $subtract: ['$items.price', { $multiply: ['$items.price', { $divide: ['$items.discount', 100] }] }] },
                '$items.quantity',
              ],
            },
          },
        },
      },
    ]),
    Product.find({ seller: sellerId, isActive: true })
      .sort('-totalSold')
      .limit(5)
      .select('name totalSold price'),
  ]);

  sendSuccess(res, 200, {
    orders,
    revenue: revenue[0]?.revenue || 0,
    topProducts,
    period: days,
  });
});

export const getOrderAnalytics = asyncHandler(async (req, res) => {
  const [statusBreakdown, paymentBreakdown, avgOrderValue] = await Promise.all([
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Order.aggregate([{ $group: { _id: '$paymentMethod', count: { $sum: 1 } } }]),
    Order.aggregate([
      { $match: { status: { $nin: ['cancelled'] } } },
      { $group: { _id: null, avg: { $avg: '$totalPrice' } } },
    ]),
  ]);

  sendSuccess(res, 200, {
    statusBreakdown,
    paymentBreakdown,
    avgOrderValue: Math.round(avgOrderValue[0]?.avg || 0),
  });
});
