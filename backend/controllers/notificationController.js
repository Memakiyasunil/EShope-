import asyncHandler from '../utils/asyncHandler.js';
import ApiError, { sendSuccess } from '../utils/apiResponse.js';
import Notification from '../models/Notification.js';

export const getMyNotifications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = { user: req.user._id };
  if (req.query.unread === 'true') filter.isRead = false;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter).skip(skip).limit(limit).sort('-createdAt'),
    Notification.countDocuments(filter),
    Notification.countDocuments({ user: req.user._id, isRead: false }),
  ]);

  res.status(200).json({
    success: true,
    data: notifications,
    unreadCount,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!notification) throw new ApiError(404, 'Notification not found');

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  sendSuccess(res, 200, { notification }, 'Notification marked as read');
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { isRead: true, readAt: new Date() }
  );
  sendSuccess(res, 200, {}, 'All notifications marked as read');
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!notification) throw new ApiError(404, 'Notification not found');
  sendSuccess(res, 200, {}, 'Notification deleted');
});

export const createNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.create(req.body);
  sendSuccess(res, 201, { notification }, 'Notification created');
});

export const broadcastNotification = asyncHandler(async (req, res) => {
  const { userIds, title, message, type, link } = req.body;

  const notifications = userIds.map((userId) => ({
    user: userId,
    title,
    message,
    type: type || 'system',
    link,
  }));

  await Notification.insertMany(notifications);
  sendSuccess(res, 201, { count: notifications.length }, 'Notifications broadcast');
});
