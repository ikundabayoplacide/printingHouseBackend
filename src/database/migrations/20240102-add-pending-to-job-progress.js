'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_jobs_progress" ADD VALUE IF NOT EXISTS 'pending';`
    );
  },

  async down(queryInterface) {
    // PostgreSQL does not support removing individual enum labels.
  },
};
