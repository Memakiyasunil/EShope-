import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['order', 'payment', 'promotion', 'system', 'seller', 'review'],
      default: 'system',
    },
    link: { type: String, default: '' },
    referenceId: { type: mongoose.Schema.Types.ObjectId },
    referenceModel: {
      type: String,
      enum: ['Order', 'Product', 'Payment', 'Seller', 'Review'],
    },
    isRead: { type: Boolean, default: false },
    readAt: Date,
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
