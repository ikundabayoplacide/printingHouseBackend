'use strict';

module.exports = {
  async up(queryInterface) {
    // Add 'verified' to the existing status ENUM
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_jobs_status" ADD VALUE IF NOT EXISTS 'verified';
    `);

    // Drop the separate verification columns added in 20240077
    await queryInterface.removeColumn('jobs', 'verifiedStatus').catch(() => {});
    await queryInterface.removeColumn('jobs', 'verifiedById').catch(() => {});
    await queryInterface.removeColumn('jobs', 'verifiedAt').catch(() => {});
    await queryInterface.removeColumn('jobs', 'verificationNote').catch(() => {});
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_jobs_verifiedStatus";').catch(() => {});
  },

  async down() {
    // Postgres does not support removing ENUM values natively
  },
};
