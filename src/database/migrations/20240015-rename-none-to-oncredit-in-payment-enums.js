'use strict';

module.exports = {
  async up(queryInterface) {
    // PostgreSQL enum labels are added in place; removed labels are retained.
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_payments_paymentMethod" ADD VALUE IF NOT EXISTS 'ONCREDIT';`
    );
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_payments_paymentState" ADD VALUE IF NOT EXISTS 'ONCREDIT';`
    );

    // Step 2: migrate existing NONE data to ONCREDIT
    await queryInterface.sequelize.query(
      `UPDATE payments SET "paymentMethod" = 'ONCREDIT' WHERE "paymentMethod" = 'NONE';`
    );
    await queryInterface.sequelize.query(
      `UPDATE payments SET "paymentState" = 'ONCREDIT' WHERE "paymentState" = 'NONE';`
    );

    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_jobs_paymentStatus" ADD VALUE IF NOT EXISTS 'oncredit';`
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `UPDATE payments SET "paymentMethod" = 'NONE' WHERE "paymentMethod" = 'ONCREDIT';`
    );
    await queryInterface.sequelize.query(
      `UPDATE payments SET "paymentState" = 'NONE' WHERE "paymentState" = 'ONCREDIT';`
    );
    await queryInterface.sequelize.query(
      `UPDATE jobs SET "paymentStatus" = 'partial' WHERE "paymentStatus" = 'oncredit';`
    );
  },
};
