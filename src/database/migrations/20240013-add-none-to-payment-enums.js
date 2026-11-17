'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_payments_paymentMethod" ADD VALUE IF NOT EXISTS 'NONE';`
    );
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_payments_paymentState" ADD VALUE IF NOT EXISTS 'NONE';`
    );
  },

  async down(queryInterface) {
    // PostgreSQL does not support removing individual enum values safely.
    // Keep the labels in the database type; application code can stop using them.
    await queryInterface.sequelize.query(
      `UPDATE payments SET "paymentMethod" = 'CARD' WHERE "paymentMethod" = 'NONE';`
    );
    await queryInterface.sequelize.query(
      `UPDATE payments SET "paymentState" = 'FULL' WHERE "paymentState" = 'NONE';`
    );
  },
};
