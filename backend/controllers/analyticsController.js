import asyncHandler from '../utils/asyncHandler.js';
import ApiError, { sendSuccess } from '../utils/apiResponse.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Seller from '../models/Seller.js';
import Withdrawal from '../models/Withdrawal.js';
import Notification from '../models/Notification.js';

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

export const getSuperAdminFinances = asyncHandler(async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    totalTurnoverData,
    todayTurnoverData,
    walletData,
    payoutData,
    activeUsers,
    inactiveUsers,
    activeSellers,
    inactiveSellers,
    todayJoiningsUser,
    todayJoiningsSeller,
    pendingWithdrawals,
    recentNotifications
  ] = await Promise.all([
    // Total Turnover
    Order.aggregate([
      { $match: { status: { $nin: ['cancelled', 'returned'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]),
    // Today's Turnover
    Order.aggregate([
      { $match: { createdAt: { $gte: todayStart }, status: { $nin: ['cancelled', 'returned'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]),
    // Wallet Balances & Total Payouts (from Seller model)
    Seller.aggregate([
      { $group: { _id: null, totalWallet: { $sum: '$walletBalance' }, totalPayouts: { $sum: '$totalPayouts' } } }
    ]),
    // Payouts from Withdrawal model
    Withdrawal.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    User.countDocuments({ isActive: true, role: 'user' }),
    User.countDocuments({ isActive: false, role: 'user' }),
    Seller.countDocuments({ status: 'approved' }),
    Seller.countDocuments({ status: { $ne: 'approved' } }),
    User.countDocuments({ createdAt: { $gte: todayStart } }),
    Seller.countDocuments({ createdAt: { $gte: todayStart } }),
    Withdrawal.countDocuments({ status: 'pending' }),
    Notification.find({ user: req.user._id }).sort('-createdAt').limit(10)
  ]);

  const totalTurnover = totalTurnoverData[0]?.total || 0;
  const todayTurnover = todayTurnoverData[0]?.total || 0;
  const totalWalletBalances = walletData[0]?.totalWallet || 0;
  const totalGeneratedPayouts = payoutData[0]?.total || walletData[0]?.totalPayouts || 0;
  
  // Platform Income: Assume average 10% commission on total turnover for demonstration,
  // or calculate from actual order item commissions if available. 
  // We'll use a conservative 10% flat estimate for the dashboard if not explicitly stored.
  const totalIncome = totalTurnover * 0.10;

  sendSuccess(res, 200, {
    totalTurnover,
    todayTurnover,
    totalIncome,
    totalWalletBalances,
    totalGeneratedPayouts,
    activeMembers: activeUsers + activeSellers,
    inactiveMembers: inactiveUsers + inactiveSellers,
    todayJoinings: todayJoiningsUser + todayJoiningsSeller,
    pendingFundRequests: pendingWithdrawals,
    recentNotifications
  });
});

