const cron = require('node-cron');
const { Op } = require('sequelize');
const LeaveRequest = require('../database/models/LeaveRequest');
const logger = require('./logger');

// Runs every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [count] = await LeaveRequest.update(
      { status: 'DONE' },
      {
        where: {
          status: 'APPROVED',
          endDate: { [Op.lt]: today },
        },
      }
    );

    if (count > 0) logger.info(`[Cron] Marked ${count} leave request(s) as DONE.`);
  } catch (err) {
    logger.error(`[Cron] Failed to update leave statuses: ${err.message}`);
  }
});
