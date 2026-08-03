'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Step 1: expand ENUM to include both old and new values
    await queryInterface.sequelize.query(`
      ALTER TABLE leave_requests
      MODIFY COLUMN type ENUM('ANNUAL','SICK','MATERNITY','PATERNITY','EMERGENCY','UNPAID','OTHER','PERMISSION','CIVIL_MARRIAGE','DEATH_SPOUSE','DEATH_CHILD','DEATH_FATHER','DEATH_MOTHER','DEATH_FATHER_IN_LAW','DEATH_MOTHER_IN_LAW','DEATH_GRANDPARENT') NOT NULL
    `);

    // Step 2: migrate old values to new equivalents
    await queryInterface.sequelize.query(`
      UPDATE leave_requests SET type = 'PERMISSION'
      WHERE type IN ('SICK', 'EMERGENCY', 'UNPAID', 'OTHER')
    `);

    // Step 3: shrink ENUM to new values only
    await queryInterface.sequelize.query(`
      ALTER TABLE leave_requests
      MODIFY COLUMN type ENUM('PERMISSION','MATERNITY','PATERNITY','CIVIL_MARRIAGE','ANNUAL','DEATH_SPOUSE','DEATH_CHILD','DEATH_FATHER','DEATH_MOTHER','DEATH_FATHER_IN_LAW','DEATH_MOTHER_IN_LAW','DEATH_GRANDPARENT') NOT NULL
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE leave_requests
      MODIFY COLUMN type ENUM('ANNUAL','SICK','MATERNITY','PATERNITY','EMERGENCY','UNPAID','OTHER') NOT NULL
    `);
  },
};
