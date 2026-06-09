import asyncHandler from '../utils/asyncHandler.js';
import ApiError, { sendSuccess } from '../utils/apiResponse.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'name images price discount quantity stock seller',
    populate: { path: 'seller', select: 'shopName' },
  });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

const calcCartTotals = (cart, coupon = null) => {
  const subtotal = cart.items.reduce((sum, item) => {
    const price = item.product?.price ?? item.price;
    const discount = item.product?.discount ?? item.discount;
    const discounted = price - (price * discount) / 100;
    return sum + discounted * item.quantity;
  }, 0);

  let discountAmount = 0;
  if (coupon) {
    if (coupon.discountType === 'percentage') {
      discountAmount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount > 0) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    } else {
      discountAmount = coupon.discountValue;
    }
  }

  return { subtotal, discountAmount, total: Math.max(0, subtotal - discountAmount) };
};

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  let coupon = null;
  if (cart.coupon) coupon = await Coupon.findById(cart.coupon);

  const totals = calcCartTotals(cart, coupon);
  sendSuccess(res, 200, { cart, totals });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product || !product.isActive) throw new ApiError(404, 'Product not found');
  if (product.quantity < quantity) throw new ApiError(400, 'Insufficient stock');

  const cart = await getOrCreateCart(req.user._id);
  const existing = cart.items.find((item) => item.product._id.toString() === productId);

  if (existing) {
    existing.quantity += quantity;
    if (existing.quantity > product.quantity) {
      throw new ApiError(400, 'Insufficient stock');
    }
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
      discount: product.discount,
    });
  }

  await cart.save();
  const updatedCart = await getOrCreateCart(req.user._id);
  const totals = calcCartTotals(updatedCart);
  sendSuccess(res, 200, { cart: updatedCart, totals }, 'Item added to cart');
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find((i) => i._id.toString() === req.params.itemId);

  if (!item) throw new ApiError(404, 'Cart item not found');

  const product = await Product.findById(item.product._id || item.product);
  if (!product) throw new ApiError(404, 'Product not found');
  if (product.quantity < quantity) throw new ApiError(400, 'Insufficient stock');

  item.quantity = quantity;
  await cart.save();

  const updatedCart = await getOrCreateCart(req.user._id);
  const totals = calcCartTotals(updatedCart);
  sendSuccess(res, 200, { cart: updatedCart, totals }, 'Cart updated');
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find((i) => i._id.toString() === req.params.itemId);
  if (!item) throw new ApiError(404, 'Cart item not found');

  item.deleteOne();
  await cart.save();

  const updatedCart = await getOrCreateCart(req.user._id);
  const totals = calcCartTotals(updatedCart);
  sendSuccess(res, 200, { cart: updatedCart, totals }, 'Item removed from cart');
});

export const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], coupon: null });
  sendSuccess(res, 200, {}, 'Cart cleared');
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) throw new ApiError(404, 'Invalid coupon code');

  const now = new Date();
  if (now < coupon.startDate || now > coupon.endDate) {
    throw new ApiError(400, 'Coupon is not valid at this time');
  }
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    throw new ApiError(400, 'Coupon usage limit reached');
  }

  const cart = await getOrCreateCart(req.user._id);
  const totals = calcCartTotals(cart);

  if (totals.subtotal < coupon.minOrderAmount) {
    throw new ApiError(400, `Minimum order amount is ₹${coupon.minOrderAmount}`);
  }

  cart.coupon = coupon._id;
  await cart.save();

  const updatedTotals = calcCartTotals(cart, coupon);
  sendSuccess(res, 200, { cart, totals: updatedTotals, coupon }, 'Coupon applied');
});

export const removeCoupon = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.coupon = null;
  await cart.save();

  const totals = calcCartTotals(cart);
  sendSuccess(res, 200, { cart, totals }, 'Coupon removed');
});
