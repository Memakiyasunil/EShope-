import asyncHandler from '../utils/asyncHandler.js';
import ApiError, { sendSuccess } from '../utils/apiResponse.js';
import Withdrawal from '../models/Withdrawal.js';
import Seller from '../models/Seller.js';
import Notification from '../models/Notification.js';
import mongoose from 'mongoose';

// @desc    Get all withdrawals
// @route   GET /api/finances/withdrawals
// @access  Private/Admin
export const getAllWithdrawals = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const query = status ? { status } : {};

  const withdrawals = await Withdrawal.find(query)
    .populate('seller', 'shopName email')
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await Withdrawal.countDocuments(query);

  sendSuccess(res, 200, {
    withdrawals,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalCount: count,
  });
});

// @desc    Update withdrawal status
// @route   PUT /api/finances/withdrawals/:id
// @access  Private/Admin
export const updateWithdrawalStatus = asyncHandler(async (req, res) => {
  const { status, adminNote, transactionId } = req.body;
  
  const withdrawal = await Withdrawal.findById(req.params.id).populate('seller');
  if (!withdrawal) {
    throw new ApiError(404, 'Withdrawal request not found');
  }

  if (withdrawal.status === 'completed' || withdrawal.status === 'rejected') {
    throw new ApiError(400, 'Withdrawal request is already processed');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    withdrawal.status = status;
    if (adminNote) withdrawal.adminNote = adminNote;
    if (transactionId) withdrawal.transactionId = transactionId;

    await withdrawal.save({ session });

    // If rejected, refund the seller's wallet
    if (status === 'rejected') {
      const seller = await Seller.findById(withdrawal.seller._id).session(session);
      seller.walletBalance += withdrawal.amount;
      await seller.save({ session });

      await Notification.create([{
        user: seller.user,
        title: 'Withdrawal Rejected',
        message: `Your withdrawal request of ₹${withdrawal.amount} was rejected. Note: ${adminNote || 'No reason provided.'}`,
        type: 'system',
        referenceId: withdrawal._id,
        referenceModel: 'Withdrawal'
      }], { session });
    } else if (status === 'completed') {
      const seller = await Seller.findById(withdrawal.seller._id).session(session);
      seller.totalPayouts += withdrawal.amount;
      await seller.save({ session });

      await Notification.create([{
        user: seller.user,
        title: 'Withdrawal Completed',
        message: `Your withdrawal of ₹${withdrawal.amount} has been successfully processed.`,
        type: 'payment',
        referenceId: withdrawal._id,
        referenceModel: 'Withdrawal'
      }], { session });
    } else if (status === 'processing') {
      await Notification.create([{
        user: withdrawal.seller.user,
        title: 'Withdrawal Processing',
        message: `Your withdrawal request of ₹${withdrawal.amount} is now being processed.`,
        type: 'system',
        referenceId: withdrawal._id,
        referenceModel: 'Withdrawal'
      }], { session });
    }

    await session.commitTransaction();
    session.endSession();

    sendSuccess(res, 200, {
      message: `Withdrawal marked as ${status}`,
      withdrawal,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, error.message);
  }
});

// @desc    Request a withdrawal
// @route   POST /api/finances/withdrawals
// @access  Private/Seller
export const requestWithdrawal = asyncHandler(async (req, res) => {
  const { amount, paymentMethod } = req.body;
  
  if (!amount || amount <= 0) {
    throw new ApiError(400, 'Please enter a valid amount');
  }

  const seller = await Seller.findOne({ user: req.user._id });
  if (!seller) {
    throw new ApiError(404, 'Seller profile not found');
  }

  if (seller.walletBalance < amount) {
    throw new ApiError(400, `Insufficient wallet balance. Available: ₹${seller.walletBalance}`);
  }

  // Ensure no other pending withdrawals exist to prevent spam
  const existingPending = await Withdrawal.findOne({ seller: seller._id, status: 'pending' });
  if (existingPending) {
    throw new ApiError(400, 'You already have a pending withdrawal request. Please wait for it to be processed.');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const withdrawal = await Withdrawal.create([{
      seller: seller._id,
      amount,
      paymentMethod,
      bankDetails: seller.bankDetails, // snapshot of current bank details
    }], { session });

    // Deduct from wallet immediately
    seller.walletBalance -= amount;
    await seller.save({ session });

    // Notify admins (optional: find admins and notify them, or just rely on dashboard)

    await session.commitTransaction();
    session.endSession();

    sendSuccess(res, 201, {
      message: 'Withdrawal request submitted successfully',
      withdrawal: withdrawal[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, error.message);
  }
});

// @desc    Get seller's own withdrawals
// @route   GET /api/finances/withdrawals/me
// @access  Private/Seller
export const getSellerWithdrawals = asyncHandler(async (req, res) => {
  const seller = await Seller.findOne({ user: req.user._id });
  if (!seller) {
    throw new ApiError(404, 'Seller profile not found');
  }

  const withdrawals = await Withdrawal.find({ seller: seller._id }).sort('-createdAt');
  
  sendSuccess(res, 200, {
    withdrawals,
    walletBalance: seller.walletBalance,
    totalPayouts: seller.totalPayouts,
  });
});
