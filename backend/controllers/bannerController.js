import asyncHandler from '../utils/asyncHandler.js';
import ApiError, { sendSuccess } from '../utils/apiResponse.js';
import Banner from '../models/Banner.js';
import { uploadToCloud } from '../middleware/upload.js';

export const createBanner = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.files?.image?.[0]) {
    const uploaded = await uploadToCloud(req.files.image[0].path, 'banners');
    data.image = uploaded.url;
  }
  if (req.files?.mobileImage?.[0]) {
    const uploaded = await uploadToCloud(req.files.mobileImage[0].path, 'banners');
    data.mobileImage = uploaded.url;
  }

  const banner = await Banner.create(data);
  sendSuccess(res, 201, { banner }, 'Banner created');
});

export const getBanners = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.active === 'true') {
    const now = new Date();
    filter.isActive = true;
    filter.$or = [
      { startDate: { $exists: false } },
      { startDate: { $lte: now }, endDate: { $gte: now } },
      { startDate: { $lte: now }, endDate: { $exists: false } },
    ];
  }
  if (req.query.position) filter.position = req.query.position;

  const banners = await Banner.find(filter).sort('sortOrder -createdAt');
  sendSuccess(res, 200, { banners });
});

export const getBannerById = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) throw new ApiError(404, 'Banner not found');
  sendSuccess(res, 200, { banner });
});

export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) throw new ApiError(404, 'Banner not found');

  Object.assign(banner, req.body);
  if (req.files?.image?.[0]) {
    const uploaded = await uploadToCloud(req.files.image[0].path, 'banners');
    banner.image = uploaded.url;
  }
  if (req.files?.mobileImage?.[0]) {
    const uploaded = await uploadToCloud(req.files.mobileImage[0].path, 'banners');
    banner.mobileImage = uploaded.url;
  }

  await banner.save();
  sendSuccess(res, 200, { banner }, 'Banner updated');
});

export const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) throw new ApiError(404, 'Banner not found');

  banner.isActive = false;
  await banner.save();
  sendSuccess(res, 200, {}, 'Banner deactivated');
});
