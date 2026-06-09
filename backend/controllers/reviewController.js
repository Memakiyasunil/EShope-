import asyncHandler from '../utils/asyncHandler.js';
import ApiError, { sendSuccess } from '../utils/apiResponse.js';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { uploadMultipleToCloud } from '../middleware/upload.js';

const updateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId, isApproved: true } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].count,
    });
  }
};

export const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, title, comment, orderId } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  const existing = await Review.findOne({ product: productId, user: req.user._id });
  if (existing) throw new ApiError(400, 'You have already reviewed this product');

  let isVerifiedPurchase = false;
  if (orderId) {
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
      'items.product': productId,
      status: 'delivered',
    });
    isVerifiedPurchase = Boolean(order);
  }

  const reviewData = {
    product: productId,
    user: req.user._id,
    rating,
    title,
    comment,
    order: orderId,
    isVerifiedPurchase,
  };

  if (req.files?.length) {
    reviewData.images = await uploadMultipleToCloud(req.files, 'reviews');
  }

  const review = await Review.create(reviewData);
  await updateProductRating(productId);

  const populated = await Review.findById(review._id).populate('user', 'name avatar');
  sendSuccess(res, 201, { review: populated }, 'Review submitted');
});

export const getReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { isApproved: true };
  if (req.query.product) filter.product = req.query.product;
  if (req.query.user) filter.user = req.query.user;

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate('user', 'name avatar')
      .populate('product', 'name slug images')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt'),
    Review.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: reviews,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }

  const { rating, title, comment } = req.body;
  if (rating) review.rating = rating;
  if (title !== undefined) review.title = title;
  if (comment) review.comment = comment;

  await review.save();
  await updateProductRating(review.product);

  sendSuccess(res, 200, { review }, 'Review updated');
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }

  const productId = review.product;
  await review.deleteOne();
  await updateProductRating(productId);

  sendSuccess(res, 200, {}, 'Review deleted');
});

export const approveReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');

  review.isApproved = req.body.isApproved ?? true;
  await review.save();
  await updateProductRating(review.product);

  sendSuccess(res, 200, { review }, 'Review moderation updated');
});

export const markHelpful = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { $inc: { helpfulCount: 1 } },
    { new: true }
  );
  if (!review) throw new ApiError(404, 'Review not found');
  sendSuccess(res, 200, { review }, 'Marked as helpful');
});
