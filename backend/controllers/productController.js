import asyncHandler from '../utils/asyncHandler.js';
import ApiError, { sendSuccess } from '../utils/apiResponse.js';
import Product from '../models/Product.js';
import Seller from '../models/Seller.js';
import Review from '../models/Review.js';
import Category from '../models/Category.js';
import { uploadMultipleToCloud } from '../middleware/upload.js';

const buildProductFilter = (query) => {
  const filter = { isActive: true };

  if (query.category) filter.category = query.category;
  if (query.subCategory) filter.subCategory = query.subCategory;
  if (query.seller) filter.seller = query.seller;
  if (query.brand) filter.brand = { $regex: query.brand, $options: 'i' };
  if (query.featured === 'true') filter.isFeatured = true;
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  if (query.search) {
    filter.$text = { $search: query.search };
  }
  if (query.stock) filter.stock = query.stock;

  return filter;
};

export const createProduct = asyncHandler(async (req, res) => {
  const seller = await Seller.findOne({ user: req.user._id, status: 'approved' });
  if (!seller) throw new ApiError(403, 'Approved seller profile required');

  const data = { ...req.body, seller: seller._id };
  if (req.files?.length) {
    data.images = await uploadMultipleToCloud(req.files, 'products');
  }

  const product = await Product.create(data);
  seller.totalProducts += 1;
  await seller.save();

  sendSuccess(res, 201, { product }, 'Product created');
});

export const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const sort = req.query.sort || '-createdAt';

  const filter = buildProductFilter(req.query);

  // Handle category slug
  if (req.query.category && !req.query.category.match(/^[0-9a-fA-F]{24}$/)) {
    const categoryDoc = await Category.findOne({ slug: req.query.category });
    if (categoryDoc) {
      filter.category = categoryDoc._id;
    } else {
      return res.status(200).json({
        success: true,
        data: [],
        pagination: { page, limit, total: 0, pages: 0 },
      });
    }
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .populate('seller', 'shopName slug logo rating')
      .skip(skip)
      .limit(limit)
      .sort(sort),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug subCategories')
    .populate('seller', 'shopName slug logo rating totalReviews');

  if (!product || !product.isActive) throw new ApiError(404, 'Product not found');
  sendSuccess(res, 200, { product });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('category', 'name slug')
    .populate('seller', 'shopName slug logo rating');

  if (!product) throw new ApiError(404, 'Product not found');
  sendSuccess(res, 200, { product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const seller = await Seller.findOne({ user: req.user._id });
  const product = await Product.findById(req.params.id);

  if (!product) throw new ApiError(404, 'Product not found');
  if (req.user.role !== 'admin' && product.seller.toString() !== seller?._id.toString()) {
    throw new ApiError(403, 'Not authorized to update this product');
  }

  Object.assign(product, req.body);
  if (req.files?.length) {
    const newImages = await uploadMultipleToCloud(req.files, 'products');
    product.images = [...(product.images || []), ...newImages];
  }

  await product.save();
  sendSuccess(res, 200, { product }, 'Product updated');
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const seller = await Seller.findOne({ user: req.user._id });
  const product = await Product.findById(req.params.id);

  if (!product) throw new ApiError(404, 'Product not found');
  if (req.user.role !== 'admin' && product.seller.toString() !== seller?._id.toString()) {
    throw new ApiError(403, 'Not authorized to delete this product');
  }

  product.isActive = false;
  await product.save();
  sendSuccess(res, 200, {}, 'Product deleted');
});

export const getSellerProducts = asyncHandler(async (req, res) => {
  const seller = await Seller.findOne({ user: req.user._id });
  if (!seller) throw new ApiError(404, 'Seller profile not found');

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find({ seller: seller._id }).populate('category', 'name').skip(skip).limit(limit).sort('-createdAt'),
    Product.countDocuments({ seller: seller._id }),
  ]);

  res.status(200).json({
    success: true,
    data: products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .populate('category', 'name slug')
    .populate('seller', 'shopName slug')
    .limit(12)
    .sort('-rating');

  sendSuccess(res, 200, { products });
});

export const getProductReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ product: req.params.id, isApproved: true })
      .populate('user', 'name avatar')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt'),
    Review.countDocuments({ product: req.params.id, isApproved: true }),
  ]);

  res.status(200).json({
    success: true,
    data: reviews,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});
