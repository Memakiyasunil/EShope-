import asyncHandler from '../utils/asyncHandler.js';
import ApiError, { sendSuccess } from '../utils/apiResponse.js';
import Settings from '../models/Settings.js';
import { uploadToCloud } from '../middleware/upload.js';

const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
};

export const getSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  sendSuccess(res, 200, { settings });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();

  const allowed = [
    'siteName', 'siteTagline', 'contactEmail', 'contactPhone', 'address',
    'currency', 'currencySymbol', 'taxRate', 'defaultDeliveryCharge',
    'freeDeliveryThreshold', 'platformCommission', 'socialLinks',
    'paymentMethods', 'seo', 'maintenanceMode', 'maintenanceMessage',
  ];

  allowed.forEach((field) => {
    if (req.body[field] !== undefined) settings[field] = req.body[field];
  });

  if (req.files?.logo?.[0]) {
    const uploaded = await uploadToCloud(req.files.logo[0].path, 'settings');
    settings.logo = uploaded.url;
  }
  if (req.files?.favicon?.[0]) {
    const uploaded = await uploadToCloud(req.files.favicon[0].path, 'settings');
    settings.favicon = uploaded.url;
  }

  await settings.save();
  sendSuccess(res, 200, { settings }, 'Settings updated');
});

export const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  sendSuccess(res, 200, {
    settings: {
      siteName: settings.siteName,
      siteTagline: settings.siteTagline,
      logo: settings.logo,
      favicon: settings.favicon,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      currency: settings.currency,
      currencySymbol: settings.currencySymbol,
      socialLinks: settings.socialLinks,
      paymentMethods: settings.paymentMethods,
      maintenanceMode: settings.maintenanceMode,
      maintenanceMessage: settings.maintenanceMessage,
    },
  });
});
