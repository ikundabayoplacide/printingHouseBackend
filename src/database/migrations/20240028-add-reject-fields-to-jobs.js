'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('jobs', 'rejectReason', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'notes',
    });

    // Add 'rejected' to the status ENUM
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_jobs_status" ADD VALUE IF NOT EXISTS 'rejected';
    `);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('jobs', 'rejectReason');
    // Note: PostgreSQL does not support removing ENUM values natively.
    // To fully revert, recreate the ENUM without 'rejected'.
  },
};
