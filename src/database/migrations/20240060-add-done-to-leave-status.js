'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_leave_requests_status" ADD VALUE IF NOT EXISTS 'DONE';`
    );
  },
  async down() {
    // Postgres does not support removing ENUM values
  },
};
