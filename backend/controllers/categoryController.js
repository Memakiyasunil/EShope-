import asyncHandler from '../utils/asyncHandler.js';
import ApiError, { sendSuccess } from '../utils/apiResponse.js';
import Category from '../models/Category.js';
import { uploadToCloud } from '../middleware/upload.js';

export const createCategory = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    const uploaded = await uploadToCloud(req.file.path, 'categories');
    data.image = uploaded.url;
  }

  const category = await Category.create(data);
  sendSuccess(res, 201, { category }, 'Category created');
});

export const getCategories = asyncHandler(async (req, res) => {
  const filter = req.query.active === 'false' ? {} : { isActive: true };
  const categories = await Category.find(filter).sort('sortOrder name');
  sendSuccess(res, 200, { categories });
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');
  sendSuccess(res, 200, { category });
});

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true });
  if (!category) throw new ApiError(404, 'Category not found');
  sendSuccess(res, 200, { category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');

  Object.assign(category, req.body);
  if (req.file) {
    const uploaded = await uploadToCloud(req.file.path, 'categories');
    category.image = uploaded.url;
  }

  await category.save();
  sendSuccess(res, 200, { category }, 'Category updated');
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');

  category.isActive = false;
  await category.save();
  sendSuccess(res, 200, {}, 'Category deactivated');
});

export const addSubCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');

  category.subCategories.push(req.body);
  await category.save();
  sendSuccess(res, 201, { category }, 'Sub-category added');
});

export const updateSubCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');

  const sub = category.subCategories.id(req.params.subId);
  if (!sub) throw new ApiError(404, 'Sub-category not found');

  Object.assign(sub, req.body);
  await category.save();
  sendSuccess(res, 200, { category }, 'Sub-category updated');
});

export const deleteSubCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');

  const sub = category.subCategories.id(req.params.subId);
  if (!sub) throw new ApiError(404, 'Sub-category not found');

  sub.deleteOne();
  await category.save();
  sendSuccess(res, 200, { category }, 'Sub-category deleted');
});
