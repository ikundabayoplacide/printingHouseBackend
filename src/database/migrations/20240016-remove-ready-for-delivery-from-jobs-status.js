'use strict';

module.exports = {
  async up(queryInterface) {
    // Migrate any existing ready-for-delivery jobs to confirmed
    await queryInterface.sequelize.query(
      "UPDATE jobs SET status = 'confirmed' WHERE status = 'ready-for-delivery';"
    );
    // PostgreSQL keeps the old enum label; rows have been migrated above.
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_jobs_status" ADD VALUE IF NOT EXISTS 'ready-for-delivery';`
    );
  },
};
