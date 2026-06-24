import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: 'India' },
    isDefault: { type: Boolean, default: false },
    label: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
  },
  { timestamps: true }
);

const paymentMethodSchema = new mongoose.Schema({
  nameOnCard: {
    type: String,
    required: true
  },
  cardNumber: {
    type: String,
    required: true
  },
  expiryDate: {
    type: String,
    required: true
  },
  cvv: {
    type: String,
  },
  provider: {
    type: String,
    default: 'VISA'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin'],
    default: 'buyer',
  },
  phone: {
    type: String,
    trim: true,
  },
  avatar: {
    url: String,
    publicId: String,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  otp: String,
  otpExpire: Date,
  isActive: {
    type: Boolean,
    default: true,
  },
  addresses: [addressSchema],
  paymentMethods: [paymentMethodSchema],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  lastLogin: Date,
  refreshToken: String,
}, {
  timestamps: true,
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const bcrypt = await import('bcryptjs');
  const salt = await bcrypt.default.genSalt(10);
  this.password = await bcrypt.default.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  const bcrypt = await import('bcryptjs');
  return await bcrypt.default.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
