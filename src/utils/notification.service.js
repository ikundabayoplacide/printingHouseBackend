/**
 * Notification Service
 * Central helper to create notifications from anywhere in the codebase.
 * Usage:
 *   const notify = require('../utils/notification.service');
 *   await notify(userId, 'Job Assigned', 'Your job JOB-2026-001 has been assigned.', 'JOB_ASSIGNED', 'job', jobId);
 */

const Notification = require('../database/models/Notification');

/**
 * Create a notification for a user.
 * @param {string} userId - Recipient user ID
 * @param {string} title - Short title
 * @param {string} message - Full message body
 * @param {string} type - One of: JOB_CREATED, JOB_ASSIGNED, JOB_STATUS_CHANGED, DEPARTMENT_ASSIGNED, GENERAL
 * @param {string|null} relatedEntityType - e.g. 'job', 'department'
 * @param {string|null} relatedEntityId - UUID of the related entity
 */
const notify = async (
  userId,
  title,
  message,
  type = 'GENERAL',
  relatedEntityType = null,
  relatedEntityId = null
) => {
  try {
    await Notification.create({
      userId,
      title,
      message,
      type,
      relatedEntityType,
      relatedEntityId,
    });
  } catch (err) {
    // Notifications are non-critical — log but don't crash the request
    console.error('[NotificationService] Failed to create notification:', err.message);
  }
};

module.exports = notify;
