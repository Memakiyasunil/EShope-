import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'E-Shop Online' },
    siteTagline: { type: String, default: 'Your Multi-Vendor Marketplace' },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    address: { type: String, default: '' },
    currency: { type: String, default: 'INR' },
    currencySymbol: { type: String, default: '₹' },
    taxRate: { type: Number, default: 18, min: 0 },
    defaultDeliveryCharge: { type: Number, default: 49, min: 0 },
    freeDeliveryThreshold: { type: Number, default: 999, min: 0 },
    platformCommission: { type: Number, default: 10, min: 0, max: 100 },
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
      youtube: String,
      linkedin: String,
    },
    paymentMethods: {
      razorpay: { type: Boolean, default: true },
      stripe: { type: Boolean, default: true },
      cod: { type: Boolean, default: true },
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      metaKeywords: [String],
    },
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: '' },
  },
  { timestamps: true }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
