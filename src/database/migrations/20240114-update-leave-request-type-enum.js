'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Add the values needed by this migration. PostgreSQL retains obsolete enum labels.
    for (const value of [
      'PERMISSION', 'CIVIL_MARRIAGE', 'DEATH_SPOUSE', 'DEATH_CHILD',
      'DEATH_FATHER', 'DEATH_MOTHER', 'DEATH_FATHER_IN_LAW',
      'DEATH_MOTHER_IN_LAW', 'DEATH_GRANDPARENT',
    ]) {
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_leave_requests_type" ADD VALUE IF NOT EXISTS '${value}';`
      );
    }

    // Step 2: migrate old values to new equivalents
    await queryInterface.sequelize.query(`
      UPDATE leave_requests SET type = 'PERMISSION'
      WHERE type IN ('SICK', 'EMERGENCY', 'UNPAID', 'OTHER')
    `);

    // PostgreSQL does not support removing individual enum labels.
  },

  async down(queryInterface) {
    // PostgreSQL does not support removing individual enum labels.
  },
};
