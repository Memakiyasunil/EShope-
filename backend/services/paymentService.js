import crypto from 'crypto';
import Razorpay from 'razorpay';
import Stripe from 'stripe';
import ApiError from '../utils/apiResponse.js';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';

let razorpayInstance = null;
let stripeInstance = null;

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new ApiError(503, 'Razorpay is not configured');
  }
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new ApiError(503, 'Stripe is not configured');
  }
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeInstance;
};

export const createRazorpayOrder = async (order, user) => {
  const razorpay = getRazorpay();
  const amountInPaise = Math.round(order.totalPrice * 100);

  const razorpayOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt: order.orderNumber,
    notes: {
      orderId: order._id.toString(),
      userId: user._id.toString(),
    },
  });

  const payment = await Payment.create({
    order: order._id,
    user: user._id,
    amount: order.totalPrice,
    method: 'razorpay',
    status: 'pending',
    razorpayOrderId: razorpayOrder.id,
  });

  return {
    payment,
    razorpayOrder: {
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    },
  };
};

export const verifyRazorpayPayment = async ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    throw new ApiError(400, 'Invalid payment signature');
  }

  const payment = await Payment.findOne({ razorpayOrderId });
  if (!payment) throw new ApiError(404, 'Payment record not found');

  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  payment.status = 'completed';
  payment.transactionId = razorpayPaymentId;
  await payment.save();

  const order = await Order.findById(payment.order);
  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentStatus = 'paid';
  order.status = 'confirmed';
  order.statusHistory.push({ status: 'confirmed', note: 'Payment received via Razorpay' });
  await order.save();

  return { payment, order };
};

export const createStripeSession = async (order, user) => {
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: user.email,
    line_items: order.items.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round((item.price - (item.price * item.discount) / 100) * 100),
      },
      quantity: item.quantity,
    })),
    metadata: {
      orderId: order._id.toString(),
      userId: user._id.toString(),
      orderNumber: order.orderNumber,
    },
    success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/payment/cancel?order=${order._id}`,
  });

  const payment = await Payment.create({
    order: order._id,
    user: user._id,
    amount: order.totalPrice,
    method: 'stripe',
    status: 'pending',
    stripeSessionId: session.id,
  });

  return { payment, sessionUrl: session.url, sessionId: session.id };
};

export const verifyStripeSession = async (sessionId) => {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== 'paid') {
    throw new ApiError(400, 'Payment not completed');
  }

  const payment = await Payment.findOne({ stripeSessionId: sessionId });
  if (!payment) throw new ApiError(404, 'Payment record not found');

  payment.stripePaymentIntentId = session.payment_intent;
  payment.status = 'completed';
  payment.transactionId = session.payment_intent;
  await payment.save();

  const order = await Order.findById(payment.order);
  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentStatus = 'paid';
  order.status = 'confirmed';
  order.statusHistory.push({ status: 'confirmed', note: 'Payment received via Stripe' });
  await order.save();

  return { payment, order };
};

export const processCODOrder = async (order, user) => {
  const payment = await Payment.create({
    order: order._id,
    user: user._id,
    amount: order.totalPrice,
    method: 'cod',
    status: 'pending',
    transactionId: `COD-${order.orderNumber}`,
  });

  order.status = 'confirmed';
  order.statusHistory.push({ status: 'confirmed', note: 'COD order confirmed' });
  await order.save();

  return { payment, order };
};

export const refundPayment = async (paymentId, amount) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) throw new ApiError(404, 'Payment not found');
  if (payment.status !== 'completed') throw new ApiError(400, 'Payment is not refundable');

  if (payment.method === 'razorpay' && payment.razorpayPaymentId) {
    const razorpay = getRazorpay();
    const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
      amount: Math.round((amount || payment.amount) * 100),
    });
    payment.refundId = refund.id;
    payment.refundAmount = amount || payment.amount;
    payment.status = 'refunded';
    await payment.save();
  } else if (payment.method === 'stripe' && payment.stripePaymentIntentId) {
    const stripe = getStripe();
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      amount: Math.round((amount || payment.amount) * 100),
    });
    payment.refundId = refund.id;
    payment.refundAmount = amount || payment.amount;
    payment.status = 'refunded';
    await payment.save();
  } else if (payment.method === 'cod') {
    payment.status = 'refunded';
    payment.refundAmount = amount || payment.amount;
    await payment.save();
  }

  const order = await Order.findById(payment.order);
  if (order) {
    order.paymentStatus = 'refunded';
    order.status = 'refunded';
    order.statusHistory.push({ status: 'refunded', note: 'Payment refunded' });
    await order.save();
  }

  return payment;
};
