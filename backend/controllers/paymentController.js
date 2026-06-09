import asyncHandler from '../utils/asyncHandler.js';
import ApiError, { sendSuccess } from '../utils/apiResponse.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Notification from '../models/Notification.js';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createStripeSession,
  verifyStripeSession,
  processCODOrder,
  refundPayment,
} from '../services/paymentService.js';

export const initiatePayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized');
  }
  if (order.isPaid) throw new ApiError(400, 'Order already paid');

  const method = req.body.method || order.paymentMethod;

  if (method === 'razorpay') {
    const result = await createRazorpayOrder(order, req.user);
    sendSuccess(res, 200, result, 'Razorpay order created');
  } else if (method === 'stripe') {
    const result = await createStripeSession(order, req.user);
    sendSuccess(res, 200, result, 'Stripe session created');
  } else if (method === 'cod') {
    const result = await processCODOrder(order, req.user);
    sendSuccess(res, 200, result, 'COD order confirmed');
  } else {
    throw new ApiError(400, 'Invalid payment method');
  }
});

export const verifyRazorpay = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  const result = await verifyRazorpayPayment({ razorpayOrderId, razorpayPaymentId, razorpaySignature });

  await Notification.create({
    user: result.order.user,
    title: 'Payment Successful',
    message: `Payment for order ${result.order.orderNumber} received.`,
    type: 'payment',
    referenceId: result.order._id,
    referenceModel: 'Order',
  });

  sendSuccess(res, 200, result, 'Payment verified');
});

export const verifyStripe = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) throw new ApiError(400, 'Session ID required');

  const result = await verifyStripeSession(sessionId);

  await Notification.create({
    user: result.order.user,
    title: 'Payment Successful',
    message: `Payment for order ${result.order.orderNumber} received.`,
    type: 'payment',
    referenceId: result.order._id,
    referenceModel: 'Order',
  });

  sendSuccess(res, 200, result, 'Payment verified');
});

export const getPaymentByOrder = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({ order: req.params.orderId });
  if (!payment) throw new ApiError(404, 'Payment not found');

  if (
    payment.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new ApiError(403, 'Not authorized');
  }

  sendSuccess(res, 200, { payment });
});

export const getAllPayments = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.method) filter.method = req.query.method;

  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate('user', 'name email')
      .populate('order', 'orderNumber totalPrice')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt'),
    Payment.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: payments,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const refund = asyncHandler(async (req, res) => {
  const payment = await refundPayment(req.params.paymentId, req.body.amount);
  sendSuccess(res, 200, { payment }, 'Refund processed');
});
