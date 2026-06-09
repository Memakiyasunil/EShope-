import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, required: true, trim: true },
    shortDescription: { type: String, trim: true, default: '' },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subCategory: { type: String, trim: true },
    brand: { type: String, trim: true, default: '' },
    images: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    stock: {
      type: String,
      enum: ['in_stock', 'out_of_stock', 'low_stock'],
      default: 'in_stock',
    },
    weight: { type: Number, default: 0, min: 0 },
    deliveryCharge: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seller',
      required: true,
    },
    tags: [{ type: String, trim: true }],
    specifications: [
      {
        key: String,
        value: String,
      },
    ],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    totalSold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.virtual('discountedPrice').get(function () {
  if (!this.discount) return this.price;
  return Math.round(this.price - (this.price * this.discount) / 100);
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

productSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = `${this.name}-${this.sku}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (this.quantity <= 0) {
    this.stock = 'out_of_stock';
  } else if (this.quantity <= 10) {
    this.stock = 'low_stock';
  } else {
    this.stock = 'in_stock';
  }
  next();
});

productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
productSchema.index({ category: 1, seller: 1, price: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
