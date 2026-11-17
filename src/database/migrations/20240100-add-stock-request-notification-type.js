'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_notifications_type" ADD VALUE IF NOT EXISTS 'STOCK_REQUEST';`
    );
  },

  async down(queryInterface) {
    // PostgreSQL does not support removing individual enum labels.
  },
};
