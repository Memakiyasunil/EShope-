import asyncHandler from '../utils/asyncHandler.js';
import ApiError, { sendSuccess } from '../utils/apiResponse.js';
import User from '../models/User.js';
import { sendTokenResponse, generateAccessToken } from '../utils/generateToken.js';
import admin from '../utils/firebaseAdmin.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail, sendPasswordResetOtpEmail } from '../services/emailService.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    if (user.isEmailVerified) {
      throw new ApiError(400, 'User already exists and is verified. Please log in.');
    }
    // If not verified, allow them to register again (updates their info)
    user.name = name;
    user.password = password; // Will be hashed by pre-save hook
    user.role = role || 'buyer';
    user.phone = phone || '';
  } else {
    user = new User({ name, email, password, role: role || 'buyer', phone });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Set OTP and expiry (15 mins)
  user.otp = otp;
  user.otpExpire = Date.now() + 15 * 60 * 1000;

  await user.save();

  try {
    await sendVerificationEmail(user, otp);
    sendSuccess(res, 201, null, 'OTP sent to email. Please verify to continue.');
  } catch (error) {
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save({ validateBeforeSave: false });
    
    console.error('[Nodemailer Error]:', error); // ADDED SO WE CAN SEE WHY AWS IS FAILING
    throw new ApiError(500, 'Could not send OTP email. Please try again.');
  }
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, 'Please provide email and OTP');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, 'Email is already verified');
  }

  if (user.otp !== otp || user.otpExpire < Date.now()) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  user.isEmailVerified = true;
  user.otp = undefined;
  user.otpExpire = undefined;
  await user.save();

  await sendTokenResponse(user, 200, res);
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

  if (!user.isEmailVerified) {
    throw new ApiError(401, 'Please verify your email first');
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

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

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, 'Please provide an email');

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'User not found');

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  user.otp = otp;
  user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 minutes
  user.otpAttempts = 1;
  user.lastOtpSentAt = new Date();

  await user.save({ validateBeforeSave: false });

  try {
    await sendPasswordResetOtpEmail(user, otp);
    sendSuccess(res, 200, null, 'OTP sent to email');
  } catch (error) {
    console.error('Forgot password email error:', error);
    // Dev Bypass: if email fails, we log OTP to console and return success
    console.log(`\n\n[DEV BYPASS] OTP for ${email} is: ${otp}\n\n`);
    return sendSuccess(res, 200, null, 'Email failed but OTP logged to server console');
  }
});

export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, 'Please provide an email');

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'User not found');

  if (user.lastOtpSentAt) {
    const timeDiff = (Date.now() - user.lastOtpSentAt.getTime()) / 1000;
    if (timeDiff < 30) {
      throw new ApiError(429, 'Please wait 30 seconds before requesting a new OTP');
    }
  }

  if (user.otpAttempts >= 5) {
    const timeSinceLastOtp = (Date.now() - user.lastOtpSentAt.getTime()) / (1000 * 60);
    if (timeSinceLastOtp < 60) {
      throw new ApiError(429, 'Maximum OTP attempts reached. Please try again after 1 hour.');
    } else {
      user.otpAttempts = 0; // reset after 1 hour
    }
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpire = Date.now() + 5 * 60 * 1000;
  user.otpAttempts += 1;
  user.lastOtpSentAt = new Date();

  await user.save({ validateBeforeSave: false });

  try {
    await sendPasswordResetOtpEmail(user, otp);
    sendSuccess(res, 200, null, 'New OTP has been sent successfully');
  } catch (error) {
    console.error('Resend OTP email error:', error);
    console.log(`\n\n[DEV BYPASS] New OTP for ${email} is: ${otp}\n\n`);
    return sendSuccess(res, 200, null, 'Email failed but new OTP logged to server console');
  }
});

export const verifyPasswordResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) throw new ApiError(400, 'Please provide email and OTP');

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'User not found');

  if (user.otp !== otp || user.otpExpire < Date.now()) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  // Create temporary reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 mins for resetting

  user.otp = undefined;
  user.otpExpire = undefined;
  user.otpAttempts = 0;
  
  await user.save({ validateBeforeSave: false });

  sendSuccess(res, 200, { resetToken }, 'OTP verified successfully');
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, resetToken, newPassword } = req.body;
  if (!email || !resetToken || !newPassword) {
    throw new ApiError(400, 'Missing required fields');
  }

  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  const user = await User.findOne({
    email,
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) throw new ApiError(400, 'Invalid or expired reset token');

  // Verify password strength basic
  if (newPassword.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters long');
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  sendSuccess(res, 200, null, 'Password reset successfully');
});
