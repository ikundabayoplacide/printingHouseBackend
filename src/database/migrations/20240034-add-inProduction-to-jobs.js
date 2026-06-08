'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('jobs', 'inProduction', {
      type: Sequelize.ENUM('pending', 'inprogress', 'paused', 'done'),
      allowNull: true,
      defaultValue: null,
      comment: 'Production progress status updated by the worker',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('jobs', 'inProduction');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_jobs_inProduction";');
  },
};
