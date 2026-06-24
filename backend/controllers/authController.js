import asyncHandler from '../utils/asyncHandler.js';
import ApiError, { sendSuccess } from '../utils/apiResponse.js';
import User from '../models/User.js';
import { sendTokenResponse, generateAccessToken } from '../utils/generateToken.js';
import admin from '../utils/firebaseAdmin.js';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../services/emailService.js';

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
