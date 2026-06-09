import asyncHandler from '../utils/asyncHandler.js';
import ApiError, { sendSuccess } from '../utils/apiResponse.js';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate({
    path: 'products',
    select: 'name slug images price discount rating stock seller',
    populate: { path: 'seller', select: 'shopName slug' },
  });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }
  return wishlist;
};

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  sendSuccess(res, 200, { wishlist });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product || !product.isActive) throw new ApiError(404, 'Product not found');

  const wishlist = await getOrCreateWishlist(req.user._id);
  const exists = wishlist.products.some((p) => p._id.toString() === productId);

  if (exists) throw new ApiError(400, 'Product already in wishlist');

  wishlist.products.push(productId);
  await wishlist.save();

  const updated = await getOrCreateWishlist(req.user._id);
  sendSuccess(res, 200, { wishlist: updated }, 'Added to wishlist');
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  wishlist.products = wishlist.products.filter(
    (p) => p._id.toString() !== req.params.productId
  );
  await wishlist.save();

  const updated = await getOrCreateWishlist(req.user._id);
  sendSuccess(res, 200, { wishlist: updated }, 'Removed from wishlist');
});

export const clearWishlist = asyncHandler(async (req, res) => {
  await Wishlist.findOneAndUpdate({ user: req.user._id }, { products: [] });
  sendSuccess(res, 200, {}, 'Wishlist cleared');
});

export const moveToCart = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  const productExists = wishlist.products.some(
    (p) => p._id.toString() === req.params.productId
  );
  if (!productExists) throw new ApiError(404, 'Product not in wishlist');

  wishlist.products = wishlist.products.filter(
    (p) => p._id.toString() !== req.params.productId
  );
  await wishlist.save();

  sendSuccess(res, 200, { productId: req.params.productId }, 'Product ready to add to cart');
});
