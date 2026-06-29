'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('jobs', 'jobFor', {
      type: Sequelize.ENUM('hobe', 'general'),
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('jobs', 'jobFor');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_jobs_jobFor";');
  },
};
