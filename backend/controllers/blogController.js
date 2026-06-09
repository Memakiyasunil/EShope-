import asyncHandler from '../utils/asyncHandler.js';
import ApiError, { sendSuccess } from '../utils/apiResponse.js';
import Blog from '../models/Blog.js';
import { uploadToCloud } from '../middleware/upload.js';

export const createBlog = asyncHandler(async (req, res) => {
  const data = { ...req.body, author: req.user._id };
  if (req.file) {
    const uploaded = await uploadToCloud(req.file.path, 'blogs');
    data.coverImage = uploaded.url;
  }

  const blog = await Blog.create(data);
  sendSuccess(res, 201, { blog }, 'Blog created');
});

export const getBlogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.published === 'true') filter.isPublished = true;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { tags: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .populate('author', 'name avatar')
      .skip(skip)
      .limit(limit)
      .sort('-publishedAt -createdAt'),
    Blog.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: blogs,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('author', 'name avatar');
  if (!blog) throw new ApiError(404, 'Blog not found');
  sendSuccess(res, 200, { blog });
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOneAndUpdate(
    { slug: req.params.slug, isPublished: true },
    { $inc: { views: 1 } },
    { new: true }
  ).populate('author', 'name avatar');

  if (!blog) throw new ApiError(404, 'Blog not found');
  sendSuccess(res, 200, { blog });
});

export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new ApiError(404, 'Blog not found');

  Object.assign(blog, req.body);
  if (req.file) {
    const uploaded = await uploadToCloud(req.file.path, 'blogs');
    blog.coverImage = uploaded.url;
  }

  await blog.save();
  sendSuccess(res, 200, { blog }, 'Blog updated');
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new ApiError(404, 'Blog not found');

  await blog.deleteOne();
  sendSuccess(res, 200, {}, 'Blog deleted');
});

export const publishBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new ApiError(404, 'Blog not found');

  blog.isPublished = req.body.isPublished ?? true;
  if (blog.isPublished && !blog.publishedAt) blog.publishedAt = new Date();
  await blog.save();

  sendSuccess(res, 200, { blog }, 'Blog publish status updated');
});
