const Notification = require('../database/models/Notification');
const { success, error, paginated } = require('../utils/apiResponse');
const { getPagination } = require('../utils/helpers');

/**
 * GET /api/notifications
 * Get all notifications for the authenticated user (paginated)
 * ?unreadOnly=true to filter unread only
 */
const getMyNotifications = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { unreadOnly } = req.query;

    const where = { userId: req.user.id };
    if (unreadOnly === 'true') where.isRead = false;

    const { count, rows } = await Notification.findAndCountAll({
      where,
      offset: skip,
      limit,
      order: [['createdAt', 'DESC']],
    });

    return paginated(res, rows, count, page, limit);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/notifications/unread-count
 * Returns the count of unread notifications for the authenticated user
 */
const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.count({
      where: { userId: req.user.id, isRead: false },
    });

    return success(res, { unreadCount: count });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read
 */
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!notification) return error(res, 'Notification not found.', 404);

    await notification.update({ isRead: true });

    return success(res, notification, 'Notification marked as read.');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read for the authenticated user
 */
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id, isRead: false } }
    );

    return success(res, null, 'All notifications marked as read.');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/notifications/:id
 * Delete a single notification (only owner can delete)
 */
const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!notification) return error(res, 'Notification not found.', 404);

    await notification.destroy();

    return success(res, null, 'Notification deleted.');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/notifications
 * Delete all notifications for the authenticated user
 */
const deleteAllNotifications = async (req, res, next) => {
  try {
    await Notification.destroy({ where: { userId: req.user.id } });
    return success(res, null, 'All notifications deleted.');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
};
