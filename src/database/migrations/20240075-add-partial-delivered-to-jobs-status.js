'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_jobs_status" ADD VALUE IF NOT EXISTS 'partial-delivered';
    `);
  },

  async down() {
    // Postgres does not support removing ENUM values natively
    // A full ENUM recreation would be needed; leaving as no-op for safety
  },
};
