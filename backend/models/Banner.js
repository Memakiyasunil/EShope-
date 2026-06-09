import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true, default: '' },
    image: { type: String, required: true },
    mobileImage: { type: String, default: '' },
    link: { type: String, default: '' },
    linkType: {
      type: String,
      enum: ['product', 'category', 'external', 'none'],
      default: 'none',
    },
    linkTarget: String,
    position: {
      type: String,
      enum: ['hero', 'sidebar', 'footer', 'popup'],
      default: 'hero',
    },
    sortOrder: { type: Number, default: 0 },
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
