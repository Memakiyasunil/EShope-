import admin from '../utils/firebaseAdmin.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/apiResponse.js';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, no token');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = await User.findOne({ firebaseUid: decodedToken.uid }).select('-password -refreshToken');
    if (!req.user) {
      throw new ApiError(401, 'User not found in database');
    }
    if (!req.user.isActive) {
      throw new ApiError(401, 'Account is deactivated');
    }
    next();
  } catch (error) {
    throw new ApiError(401, 'Not authorized, token failed');
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `Role '${req.user.role}' is not authorized`));
    }
    next();
  };
};

export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = await User.findOne({ firebaseUid: decodedToken.uid }).select('-password -refreshToken');
    } catch {
      req.user = null;
    }
  }

  next();
});
