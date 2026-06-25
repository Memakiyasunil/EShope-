import asyncHandler from '../utils/asyncHandler.js';
import ApiError, { sendSuccess } from '../utils/apiResponse.js';
import Order, { ORDER_STATUSES } from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import Seller from '../models/Seller.js';
import Settings from '../models/Settings.js';
import Notification from '../models/Notification.js';
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from '../services/emailService.js';

const calcOrderPricing = async (cartItems, couponId) => {
  let itemsPrice = 0;
  let deliveryCharge = 0;
  let taxPrice = 0;

  const orderItems = [];

  for (const item of cartItems) {
    const product = item.product;
    const discountedPrice = product.price - (product.price * product.discount) / 100;
    itemsPrice += discountedPrice * item.quantity;
    deliveryCharge += (product.deliveryCharge || 0) * item.quantity;
    taxPrice += ((discountedPrice * item.quantity) * (product.tax || 0)) / 100;

    orderItems.push({
      product: product._id,
      name: product.name,
      sku: product.sku,
      image: product.images?.[0] || '',
      price: product.price,
      discount: product.discount,
      quantity: item.quantity,
      seller: product.seller,
    });
  }

  let discountAmount = 0;
  let coupon = null;
  if (couponId) {
    coupon = await Coupon.findById(couponId);
    if (coupon) {
      if (coupon.discountType === 'percentage') {
        discountAmount = (itemsPrice * coupon.discountValue) / 100;
        if (coupon.maxDiscount > 0) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      } else {
        discountAmount = coupon.discountValue;
      }
    }
  }

  const settings = await Settings.findOne();
  if (settings && itemsPrice >= settings.freeDeliveryThreshold) {
    deliveryCharge = 0;
  }

  const totalPrice = Math.max(0, itemsPrice + taxPrice + deliveryCharge - discountAmount);

  return { orderItems, itemsPrice, taxPrice, deliveryCharge, discountAmount, totalPrice, coupon };
};

export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, notes, items } = req.body;

  let populatedItems = [];
  let coupon = null;

  if (items && items.length > 0) {
    for (const item of items) {
      const productDoc = await Product.findById(item.product);
      if (!productDoc || !productDoc.isActive) throw new ApiError(400, `Product "${item.name || 'Unknown'}" is unavailable. Please remove it from your cart.`);
      if (productDoc.quantity < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${productDoc.name}`);
      }
      populatedItems.push({ product: productDoc, quantity: item.quantity });
    }
  } else {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart?.items?.length) throw new ApiError(400, 'Cart is empty');
    
    for (const item of cart.items) {
      if (!item.product?.isActive) throw new ApiError(400, `Product ${item.product?.name} is unavailable`);
      if (item.product.quantity < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${item.product.name}`);
      }
    }
    populatedItems = cart.items;
    coupon = cart.coupon;
  }

  const pricing = await calcOrderPricing(populatedItems, coupon);

  const order = await Order.create({
    user: req.user._id,
    items: pricing.orderItems,
    shippingAddress,
    paymentMethod,
    notes,
    itemsPrice: pricing.itemsPrice,
    taxPrice: pricing.taxPrice,
    deliveryCharge: pricing.deliveryCharge,
    discountAmount: pricing.discountAmount,
    coupon: pricing.coupon?._id,
    totalPrice: pricing.totalPrice,
    statusHistory: [{ status: 'pending', note: 'Order placed' }],
  });

  for (const item of populatedItems) {
    const productId = item.product._id || item.product;
    await Product.findByIdAndUpdate(productId, {
      $inc: { quantity: -item.quantity, totalSold: item.quantity },
    });
  }

  if (pricing.coupon) {
    await Coupon.findByIdAndUpdate(pricing.coupon._id, { $inc: { usedCount: 1 } });
  }

  // Clear the backend cart if it exists
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], coupon: null });

  await Notification.create({
    user: req.user._id,
    title: 'Order Placed',
    message: `Your order ${order.orderNumber} has been placed.`,
    type: 'order',
    referenceId: order._id,
    referenceModel: 'Order',
  });

  try {
    await sendOrderConfirmationEmail(req.user, order);
  } catch {
    console.warn('Order confirmation email could not be sent');
  }

  sendSuccess(res, 201, { order }, 'Order created');
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { user: req.user._id };
  if (req.query.status) filter.status = req.query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter).populate('items.product', 'name images').skip(skip).limit(limit).sort('-createdAt'),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('items.product', 'name images slug')
    .populate('items.seller', 'shopName slug');

  if (!order) throw new ApiError(404, 'Order not found');

  if (
    req.user.role !== 'admin' &&
    order.user._id.toString() !== req.user._id.toString()
  ) {
    const seller = await Seller.findOne({ user: req.user._id });
    const hasSellerItem = order.items.some(
      (item) => item.seller._id?.toString() === seller?._id?.toString()
    );
    if (!hasSellerItem) throw new ApiError(403, 'Not authorized');
  }

  sendSuccess(res, 200, { order });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  if (!ORDER_STATUSES.includes(status)) throw new ApiError(400, 'Invalid status');

  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) throw new ApiError(404, 'Order not found');

  if (req.user.role === 'seller') {
    const seller = await Seller.findOne({ user: req.user._id });
    const sellerItems = order.items.filter(
      (item) => item.seller.toString() === seller?._id?.toString()
    );
    if (!sellerItems.length) throw new ApiError(403, 'Not authorized');

    sellerItems.forEach((item) => {
      item.status = status;
    });
  } else {
    order.status = status;
    order.items.forEach((item) => {
      item.status = status;
    });
  }

  order.statusHistory.push({
    status,
    note: note || `Status updated to ${status}`,
    updatedBy: req.user._id,
  });

  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }

  await order.save();

  await Notification.create({
    user: order.user._id,
    title: 'Order Update',
    message: `Order ${order.orderNumber} is now ${status}.`,
    type: 'order',
    referenceId: order._id,
    referenceModel: 'Order',
  });

  try {
    await sendOrderStatusEmail(order.user, order);
  } catch {
    console.warn('Order status email could not be sent');
  }

  sendSuccess(res, 200, { order }, 'Order status updated');
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }

  const cancellable = ['pending', 'confirmed'];
  if (!cancellable.includes(order.status)) {
    throw new ApiError(400, 'Order cannot be cancelled at this stage');
  }

  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { quantity: item.quantity, totalSold: -item.quantity },
    });
  }

  order.status = 'cancelled';
  order.cancelReason = req.body.reason || 'Cancelled by user';
  order.statusHistory.push({ status: 'cancelled', note: order.cancelReason, updatedBy: req.user._id });
  await order.save();

  sendSuccess(res, 200, { order }, 'Order cancelled');
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt'),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getSellerOrders = asyncHandler(async (req, res) => {
  const seller = await Seller.findOne({ user: req.user._id });
  if (!seller) throw new ApiError(404, 'Seller profile not found');

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = { 'items.seller': seller._id };
  if (req.query.status) filter.status = req.query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email phone')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt'),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});
