import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError, { sendSuccess } from '../utils/apiResponse.js';
import User from '../models/User.js';
import { sendTokenResponse, generateAccessToken } from '../utils/generateToken.js';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from '../services/emailService.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(400, 'User already exists with this email');

  const allowedRoles = ['buyer', 'seller'];
  const userRole = allowedRoles.includes(role) ? role : 'buyer';

  const user = await User.create({ name, email, password, role: userRole, phone });

  const verificationToken = user.getEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  try {
    await sendVerificationEmail(user, verificationToken);
  } catch {
    console.warn('Verification email could not be sent');
  }

  await sendTokenResponse(user, 201, res);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }

  user.lastLogin = new Date();
  await sendTokenResponse(user, 200, res);
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) throw new ApiError(400, 'Refresh token required');

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== token) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    const accessToken = generateAccessToken(user._id);
    sendSuccess(res, 200, { accessToken }, 'Token refreshed');
  } catch {
    throw new ApiError(401, 'Invalid refresh token');
  }
});

export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  sendSuccess(res, 200, {}, 'Logged out successfully');
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  sendSuccess(res, 200, { user });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpire: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(400, 'Invalid or expired verification token');

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save();

  try {
    await sendWelcomeEmail(user);
  } catch {
    console.warn('Welcome email could not be sent');
  }

  sendSuccess(res, 200, {}, 'Email verified successfully');
});

export const resendVerification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.isEmailVerified) throw new ApiError(400, 'Email already verified');

  const token = user.getEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  await sendVerificationEmail(user, token);
  sendSuccess(res, 200, {}, 'Verification email sent');
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    sendSuccess(res, 200, {}, 'If email exists, reset link has been sent');
    return;
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  try {
    await sendPasswordResetEmail(user, resetToken);
    sendSuccess(res, 200, {}, 'Password reset email sent');
  } catch {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, 'Email could not be sent');
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(400, 'Invalid or expired reset token');

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  await sendTokenResponse(user, 200, res);
});

export const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(req.body.currentPassword))) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  user.password = req.body.newPassword;
  await user.save();
  sendSuccess(res, 200, {}, 'Password updated successfully');
});
